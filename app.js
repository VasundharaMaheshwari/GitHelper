const express = require('express')
const connectDB = require('./db')
const mongoose = require('mongoose')
const body = require('body-parser')
const app = express()
const { MongoClient } = require('mongodb')
const { GHUser } = require('./model')

const handlebars = require("express-handlebars");
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

let db;

app.post('/api/login',async (req,res) => {
  try{
    const usernamelg = req.body.username;
    const passwordlg = req.body.password;
    const user = await GHUser.findOne({ username: usernamelg, password: passwordlg })
    if(user == null){
        res.send('Please register')
    }else{
      return res.redirect('/register')
    } } catch (err) {
      console.log(err)
  }
})

app.post('/api/register',async (req,res) => {
  try{
    const trial2 = new GHUser({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    await trial2.save()
return res.redirect('/login')
} catch(err) {
    console.log(err)
}
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