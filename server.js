const express = require('express')
const connectDB = require('./databases/db')
const app = express()

const http = require('http')

const hbs = require('hbs')

const server = http.createServer(app)

const { Server } = require('socket.io')

const io = new Server(server)

const { setid,getid, delBySocketId } = require('./services/socketio')

const { ObjectId } = require('mongodb')

app.use(express.static('public', { setHeaders: (res, path) => {
  if (path.endsWith('.png')) {
    res.setHeader('Content-Type', 'image/png');
  }
}})); 
const { RateLimiterMemory } = require('rate-limiter-flexible')

const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60
})

io.on('connection', (socket) => {
  const { userId, receiverId } = socket.handshake.auth;

  if(!getid(userId,receiverId)){
  setid(userId, receiverId, socket.id);
  } else {
    socket.emit('error', {message: "Chat_Already_Opened_Elsewhere"})
  }

  socket.on('user-message', async (message) => {
    const { sender, receiver, msg, convoId } = message;

    if(typeof msg !== 'string' || !msg.trim() || !ObjectId.isValid(sender) || !ObjectId.isValid(receiver) || !ObjectId.isValid(convoId)){
      socket.emit('chat_rule',{type: "type", message: "Invalid message format"})
      return
    }
    
    if(msg.length === 0 || msg.length > 500){
      socket.emit('chat_rule',{type: "length", message: "Message length must be between 1 and 500 characters"})
      return
    }

    try{

    await rateLimiter.consume(socket.id)

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
      })

      await newMessage.save()

    } catch (rejRes) {
      const time = Math.floor(rejRes.msBeforeNext/1000)
      socket.emit('chat_rule',{type: "ddos", message: `Message limit exceeded. Wait for ${time} seconds.`})
    }
});

  socket.on('disconnect', () => {
    delBySocketId(socket.id);  
  });
});

hbs.registerHelper('ifCond', function(v1, v2, options) {
  return (v1.toString() === v2.toString()) ? options.fn(this) : options.inverse(this);
});

app.use(express.static('public', { setHeaders: (res, path) => {
  if (path.endsWith('.png')) {
    res.setHeader('Content-Type', 'image/png');
  }
}}))

app.set('trust proxy', 1);

const cookie_parser = require('cookie-parser')

const UserRouter = require('./routes/UserRoutes')
const APIRouter = require('./routes/AppRoutes')
const QueryRouter = require('./routes/QueryRoutes')
const HomeRouter = require('./routes/HomeRoutes')
const ErrorRouter = require('./routes/ErrorRoutes')
const AdminRouter = require('./routes/AdminRoutes')
const ChatRouter = require('./routes/ChatRoutes')

const { restrict,less_restrict,admin,query_check } = require('./middlewares/middleware')

app.disable("x-powered-by")

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '1mb' }));

app.use(cookie_parser())

app.use((req, res, next) => {      
  res.set('Cache-Control', 'no-store')
  next() 
})

const handlebars = require("express-handlebars");
const { Msg } = require('./models/Msg')
const { overall_limit } = require('./middlewares/rate_limiter')

app.use(overall_limit)

app.set("view engine", "handlebars");
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));

app.use('/api',UserRouter)
app.use('/query',restrict,APIRouter)
app.use('/query_work',query_check,QueryRouter)
app.use('/home',less_restrict,HomeRouter)
app.use('/error',ErrorRouter)
app.use('/admin',admin,AdminRouter)
app.use('/chat',restrict,ChatRouter)

app.get('/', (req,res) => {
  return res.status(302).redirect('/home')
})

server.listen(3000, async () => {
    db = await connectDB();
    console.log(`http://localhost:3000`);
  });