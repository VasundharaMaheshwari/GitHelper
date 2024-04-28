const { GHUser } = require('../models/GHUser')
const CryptoJS = require('crypto-js')
const { Key } = require('../models/Key')

const register = async (req,res) => {
    try{
      const {username,email,encryptedpassword} = req.body;

      const user = await GHUser.findOne({username: username})

      if(user == null){
      const keyr = await Key.findOne({ identifier: "meow" })
      const encrypted = CryptoJS.AES.encrypt(encryptedpassword, keyr.key).toString();

      const trial2 = new GHUser({
          username: username,
          email: email,
          password: encrypted,
          role: "User"
      })

      await trial2.save()
  return res.redirect('/api/login')
    }else{
      res.render('main.hbs',{layout: "error.hbs",
      error_message: "User Already Exists"
    })
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
        res.render('main.hbs',{layout: "error.hbs",
        error_message: "Please Register"
      })
      }else{
        const keyr = await Key.findOne({ identifier: "meow" })
        const decrypted = CryptoJS.AES.decrypt(user.password, keyr.key).toString(CryptoJS.enc.Utf8);

        if(encryptedpassword != decrypted){
          res.render('main.hbs',{layout: "error.hbs",
      error_message: "Wrong Password"
    })
        } else {
          if(user.role == "User"){
            const email = user.email
        return res.redirect(`/api/user?username=${username}&email=${email}`)}
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