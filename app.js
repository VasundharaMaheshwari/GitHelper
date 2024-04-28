const express = require('express')
const connectDB = require('./db')
const mongoose = require('mongoose')
const body = require('body-parser')
const app = express()
const { MongoClient } = require('mongodb')
const { GHUser } = require('./model')

const CryptoJS = require('crypto-js')

const handlebars = require("express-handlebars");
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

let db;

app.post('/api/login',async (req,res) => {
  try{
    console.log(req.body)
    const usernamelg = req.body.username;
    const passwordlg = req.body.encryptedpassword;
    const user = await GHUser.findOne({ username: usernamelg})
    const keyr = await GHUser.findOne({ meow: "meow" })
    if(user == null){
        res.send('Please register')
    }else{
      const decrypted = CryptoJS.AES.decrypt(user.password, keyr.password).toString(CryptoJS.enc.Utf8);
      if(passwordlg != decrypted){
        res.send('Wrong password')
      } else {
        if(user.role == "User"){
      return res.render('main.hbs',{layout: "user.hbs",
      username: user.username,
      email: user.email
    })}
      else{
        if(user.role == "Admin"){
        return res.redirect('/admin')
        }
      }
    }
    } } catch (err) {
      console.log(err)
  }
})

app.post('/api/register',async (req,res) => {
  try{
    const user = await GHUser.findOne({username: req.body.username})
    if(user == null){
    console.log(req.body)
    const keyr = await GHUser.findOne({ meow: "meow" })
    const encrypted = CryptoJS.AES.encrypt(req.body.encryptedpassword, keyr.password).toString();
    //console.log(encrypted)
    const trial2 = new GHUser({
        username: req.body.username,
        email: req.body.email,
        password: encrypted,
        role: "User"
    })
    await trial2.save()
return res.redirect('/login')
  }else{
    res.send('Username taken')
  }
} catch(err) {
    console.log(err)
}
})

app.get('/admin',(req,res) => {
  res.render('admin.hbs')
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