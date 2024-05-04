const express = require('express')
const connectDB = require('./databases/db')
const app = express()

const cookie_parser = require('cookie-parser')

const UserRouter = require('./routes/UserRoutes')
const APIRouter = require('./routes/AppRoutes')
const HomeRouter = require('./routes/HomeRoutes')
const ErrorRouter = require('./routes/ErrorRoutes')
const AdminRouter = require('./routes/AdminRoutes')

const { restrict,less_restrict,admin } = require('./middlewares/middleware')

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
app.use('/home',less_restrict,HomeRouter)
app.use('/error',ErrorRouter)
app.use('/admin',admin,AdminRouter)

app.get('/', (req,res) => {
  return res.redirect('/home')
})

app.listen(3000, async () => {
    db = await connectDB();
    console.log(`http://localhost:3000`);
  });