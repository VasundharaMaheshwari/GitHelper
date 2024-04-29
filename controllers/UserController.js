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
      return res.redirect('/error?error_details=User_Already_Created')
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
        return res.redirect('/error?error_details=Please_Register')
      }else{
        const keyr = await Key.findOne({ identifier: "meow" })
        const decrypted = CryptoJS.AES.decrypt(user.password, keyr.key).toString(CryptoJS.enc.Utf8);

        if(encryptedpassword != decrypted){
          return res.redirect('/error?error_details=Invalid_Password')
        } else {
            const id = user._id
        return res.redirect(`/api/user?id=${id}`)}
      }
      }  catch (err) {
        console.log(err)
    }
  }

const load = async (req,res) => {
  const {id} = req.query
  const user = await GHUser.findOne({"_id": id})
  if(user && user.role == "User"){
  res.render('main.hbs',{layout: "user.hbs",
  username: user.username,
  email: user.email,
  id: id
  })
} else {
  if(user && user.role == "Admin"){
    res.render('admin.hbs')
  } else {
    return res.redirect('/error?error_details=Not_Allowed') }
}
}

module.exports = { login,register,load }