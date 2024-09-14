const express = require('express')
const connectDB = require('./databases/db')
const app = express()

const http = require('http')

const server = http.createServer(app)

const { Server } = require('socket.io')

const io = new Server(server)

const { setid,getid,delid } = require('./services/socketio')

io.on('connection', (socket) => {

  const { userId } = socket.handshake.auth
  setid(userId,socket.id)

  socket.on('user-message', (msg) => {
    io.emit('message', msg)
  })

  socket.on('disconnect', (socket) => {
    delid(userId)
  })
})

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
app.use(express.json());

app.use(cookie_parser())

app.use((req, res, next) => {      
  res.set('Cache-Control', 'no-store')
  next() 
})

const handlebars = require("express-handlebars");

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