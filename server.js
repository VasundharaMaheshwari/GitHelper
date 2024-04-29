const express = require('express')
const connectDB = require('./services/db')
const app = express()

const cookie_parser = require('cookie-parser')

const UserRouter = require('./routes/UserRoutes')
const APIRouter = require('./routes/AppRoutes')
const HomeRouter = require('./routes/HomeRoutes')
const ErrorRouter = require('./routes/ErrorRoutes')

const { restrict } = require('./middlewares/auth')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookie_parser())

const handlebars = require("express-handlebars");
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));

app.use('/api',UserRouter)
app.use('/query',restrict,APIRouter)
app.use('/home',HomeRouter)
app.use('/error',ErrorRouter)

app.get('/', (req,res) => {
  return res.redirect('/home')
})

app.listen(3000, async () => {
    db = await connectDB();
    console.log(`http://localhost:3000`);
  });