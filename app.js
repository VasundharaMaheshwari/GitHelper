const express = require('express')
const connectDB = require('./db')
const mongoose = require('mongoose')
const body = require('body-parser')
const app = express()
const { MongoClient } = require('mongodb')
const { User } = require('./model')

const handlebars = require("express-handlebars");
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

let db;

app.post('/api/login',(req,res) => {

})

app.post('/api/register',(req,res) => {
  
})

app.get('/login',(req,res) => {
  res.render('login.hbs')
})

app.get('/register',(req,res) => {
  res.render('register.hbs')
})

app.listen(3000, async () => {
    db = await connectDB();
    console.log(`http://localhost:3000`);
  });