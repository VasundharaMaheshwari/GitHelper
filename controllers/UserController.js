const { GHUser } = require('../models/GHUser')
const CryptoJS = require('crypto-js')

const register = async (req,res) => {
    try{
      const {username,email,encryptedpassword} = req.body;

      const user = await GHUser.findOne({username: username})

      if(user == null){
      const keyr = await GHUser.findOne({ meow: "meow" })
      const encrypted = CryptoJS.AES.encrypt(encryptedpassword, keyr.password).toString();

      const trial2 = new GHUser({
          username: username,
          email: email,
          password: encrypted,
          role: "User"
      })

      await trial2.save()
  return res.redirect('/api/login')
    }else{
      res.send('Username taken')
    }
  } catch(err) {
      console.log(err)
  }
  }

const login = async (req,res) => {
    try{
      const {username,encryptedpassword} = req.body

      const user = await GHUser.findOne({ username: username })

      if(user == null){
          res.send('Please register')
      }else{
        const keyr = await GHUser.findOne({ meow: "meow" })
        const decrypted = CryptoJS.AES.decrypt(user.password, keyr.password).toString(CryptoJS.enc.Utf8);

        if(encryptedpassword != decrypted){
          res.send('Wrong password')
        } else {
          if(user.role == "User"){
        return res.render('main.hbs',{layout: "user.hbs",
        username: user.username,
        email: user.email
      })}
        else{
          if(user.role == "Admin"){
          return res.render('admin.hbs')
          }
        }
      }
      } } catch (err) {
        console.log(err)
    }
  }

module.exports = { login,register }