const express = require('express')
const connectDB = require('./db')
const app = express()

const UserRouter = require('./routes/UserRoutes')
const APIRouter = require('./routes/AppRoutes')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const handlebars = require("express-handlebars");
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));

app.use('/api',UserRouter)
app.use('/query',APIRouter)

app.listen(3000, async () => {
    db = await connectDB();
    console.log(`http://localhost:3000`);
  });