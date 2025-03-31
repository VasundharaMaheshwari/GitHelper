const express = require('express');
const connectDB = require('./databases/db');
const app = express();

// const cors = require('cors');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
});

let sess = {
  name: 'session',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, sameSite: 'Lax', httpOnly: true, maxAge: 1000 * 60 * 60 * 2 },
  store: store
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}

app.use(session(sess));

const http = require('http');

const hbs = require('hbs');

const server = http.createServer(app);

const { Server } = require('socket.io');

const io = new Server(server);

const { setid, getid, delBySocketId } = require('./services/socketio');

const { ObjectId } = require('mongodb');

app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));
const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60
});

io.on('connection', (socket) => {
  const { userId, receiverId } = socket.handshake.auth;

  if (!getid(userId, receiverId)) {
    setid(userId, receiverId, socket.id);
  } else {
    socket.emit('error', { message: 'Chat_Already_Opened_Elsewhere' });
  }

  socket.on('user-message', async (message) => {
    const { sender, receiver, msg, convoId, ip } = message;

    if (typeof msg !== 'string' || !msg.trim() || !ObjectId.isValid(sender) || !ObjectId.isValid(receiver) || !ObjectId.isValid(convoId)) {
      socket.emit('chat_rule', { type: 'type', message: 'Invalid message format' });
      return;
    }

    if (msg.length === 0 || msg.length > 500) {
      socket.emit('chat_rule', { type: 'length', message: 'Message length must be between 1 and 500 characters' });
      return;
    }

    try {

      await rateLimiter.consume(ip);

      const sockettx = getid(sender, receiver);
      const socketrx = getid(receiver, sender);

      if (sockettx) {
        io.to(sockettx).emit('sent-message', msg);
      }

      if (socketrx) {
        io.to(socketrx).emit('received-message', msg);
      }


      const newMessage = new Msg({
        sender: sender,
        receiver: receiver,
        msg: msg,
        convoId: convoId
      });

      await newMessage.save();

    } catch (rejRes) {
      const time = Math.floor(rejRes.msBeforeNext / 1000);
      socket.emit('chat_rule', { type: 'ddos', message: `Message limit exceeded. Wait for ${time} seconds.` });
    }
  });

  socket.on('disconnect', () => {
    delBySocketId(socket.id);
  });
});

hbs.registerHelper('ifCond', function (v1, v2, options) {
  return (v1.toString() === v2.toString()) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('ifCondGTE', function (v1, v2, options) {
  return (v1 >= v2) ? options.fn(this) : options.inverse(this);
});

app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));

const cookie_parser = require('cookie-parser');

const UserRouter = require('./routes/UserRoutes');
const APIRouter = require('./routes/AppRoutes');
const QueryRouter = require('./routes/QueryRoutes');
const HomeRouter = require('./routes/HomeRoutes');
const ErrorRouter = require('./routes/ErrorRoutes');
const AdminRouter = require('./routes/AdminRoutes');
const ChatRouter = require('./routes/ChatRoutes');
const AuthRouter = require('./routes/AuthRoutes');

const { restrict, less_restrict, admin, query_check, ghAuth } = require('./middlewares/middleware');
const { verify_limit_ip } = require('./middlewares/rate_limiter2');

app.disable('x-powered-by');

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '1mb' }));

app.use(cookie_parser(process.env.COOKIE_SIGN));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.set('X-Frame-Options', 'DENY');
  res.set('Server', 'webserver');
  next();
});

const handlebars = require('express-handlebars');
const { Msg } = require('./models/Msg');
const { overall_limit } = require('./middlewares/rate_limiter');

app.use(overall_limit);

// app.use(cors({
//   origin: 'http://localhost:3000', // Adjust to your frontend's origin
//   credentials: true // Allow cookies to be sent with requests
// }));

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));

app.use('/api', UserRouter);
app.use('/auth', verify_limit_ip, ghAuth, AuthRouter);
app.use('/query', restrict, APIRouter);
app.use('/query_work', query_check, QueryRouter);
app.use('/home', less_restrict, HomeRouter);
app.use('/error', ErrorRouter);
app.use('/admin', admin, AdminRouter);
app.use('/chat', restrict, ChatRouter);

app.get('/', (req, res) => {
  return res.status(302).redirect('/home');
});

server.listen(process.env.PORT, async () => {
  await connectDB();
  // console.log('http://localhost:3000');
});

const passport = require('passport');
const { default: mongoose } = require('mongoose');
const { GHUser } = require('./models/GHUser');
const GitHubStrategy = require('passport-github2').Strategy;

app.use(passport.initialize());

// passport.serializeUser(function (user, cb) {
//   cb(null, user);
// });

// passport.deserializeUser(function (id, cb) {
//   cb(null, null);
// });

passport.use('github', new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/github/callback',
  passReqToCallback: true
},
async function (req, accessToken, refreshToken, profile, done) {
  try {
    if (req.signedCookies.verify) {
      const incompleteId = req.signedCookies.verify;
      const incomplete = new mongoose.Types.ObjectId(incompleteId);
      const user = await GHUser.findById(incomplete);

      if (user) {
        if (profile.username === user.github_id.id) {
          await GHUser.findByIdAndUpdate(incomplete, {
            'github_id.verified': true,
          });
          profile.accessToken = accessToken;
          return done(null, profile);
        } else {
          return done(null, false, { message: 'GitHub ID received not linked with account.' });
        }
      } else {
        return done(null, false, { message: 'Incomplete user not found.' });
      }
    }
    return done(null, false, { message: 'Session not found for user.' });
  } catch (error) {
    return done(error);
  }
}
));

passport.use('github-refresh', new GitHubStrategy({
  clientID: process.env.REFRESH_ID,
  clientSecret: process.env.REFRESH_SECRET,
  callbackURL: 'http://localhost:3000/api/refresh/callback',
  passReqToCallback: true
},
async function (req, accessToken, refreshToken, profile, done) {
  try {
    if (req.signedCookies.refresh) {
      const incompleteId = req.signedCookies.refresh;
      const incomplete = new mongoose.Types.ObjectId(incompleteId);
      const user = await GHUser.findById(incomplete);
      if (profile.username === user.github_id.id) {
        profile.accessToken = accessToken;
        return done(null, profile);
      } else {
        return done(null, false, { message: 'GitHub ID received not linked with account.' });
      }
    }
    return done(null, false, { message: 'Session not found for user.' });
  } catch (error) {
    return done(error);
  }
}));