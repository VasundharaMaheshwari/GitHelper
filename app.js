const express = require('express')
const connectDB = require('./db')
const mongoose = require('mongoose')
const body = require('body-parser')
const app = express()
const { MongoClient } = require('mongodb')

const handlebars = require("express-handlebars");
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get('/login',(req,res) => {
  res.render('login.hbs')
})

app.get('/register',(req,res) => {
  res.render('register.hbs')
})

app.listen(3000, async () => {
    await connectDB();
    console.log(`http://localhost:3000`);
  });