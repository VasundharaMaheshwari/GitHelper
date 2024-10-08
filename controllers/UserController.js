const { GHUser } = require('../models/GHUser')
const CryptoJS = require('crypto-js')
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator')

require('dotenv').config()

const {v4: uuidv4} = require('uuid')
const { setUser } = require('../services/auth')

const register = async (req,res) => {
    try{
      const errors = validationResult(req)
      if(errors.isEmpty()){
      const {username,email,encryptedpassword} = req.body;

      const user = await GHUser.findOne({username: username})
      const emailcheck = await GHUser.findOne({email: email})

      if(user == null && emailcheck == null){
      const encrypted = CryptoJS.AES.encrypt(encryptedpassword, process.env.SECRET_KEY).toString();

      const trial2 = new GHUser({
          username: username,
          email: email,
          password: encrypted,
          role: "User"
      })

      await trial2.save()
  return res.status(201).redirect('/api/login')
    }else{
      return res.status(403).redirect('/error?error_details=Username_or_Email_Already_Taken')
    }
  }
  return res.send("Oops! Error Occurred...")
  } catch(err) {
    return res.status(500).redirect(`/error?error_details=Error_Occurred`)
  }
  }

const login = async (req,res) => {
    try{
      const error = validationResult(req)
      if(error.isEmpty()){
      const {username,encryptedpassword} = req.body

      const user = await GHUser.findOne({ username: username })

      if(user == null){
        return res.status(404).redirect('/error?error_details=Please_Register')
      }else{
        const decrypted = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);

        if(encryptedpassword != decrypted){
          return res.status(401).redirect('/error?error_details=Incorrect_Password')
        } else {

          const sessionId = uuidv4()
          setUser(sessionId,user)
          res.cookie("uid",sessionId)

        return res.status(200).redirect(`/api/user`)}
      }
    }
    return res.send("Oops! Error Occurred...")
      }  catch (err) {
        return res.status(500).redirect('/error?error_details=Unexpected_Error_Occurred')
    }
  }

const load = async (req,res) => {
try{
  if(ObjectId.isValid(req.user._id)){
    const user = await GHUser.findOne({"_id": req.user._id})
    if(user && user.role == "User"){
    res.status(200).render('main.hbs',{layout: "user.hbs",
    username: user.username,
    email: user.email,
    })
    } else {
      if(user && user.role == "Admin"){
        res.status(403).redirect('/admin')
      } else {
        return res.status(403).redirect('/error?error_details=Not_Allowed') }
    }
  } else {
    return res.status(400).redirect('/error?error_details=Invalid_URL')
  }
} catch(err){
  return res.status(500).redirect('/error?error_details=Error_Occurred')
}}

module.exports = { login,register,load }