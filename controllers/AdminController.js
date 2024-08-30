const { ObjectId } = require('mongodb');
const { GHUser } = require('../models/GHUser')
const { Issue } = require('../models/Issue')
const { Response } = require('../models/Response')
const { validationResult } = require('express-validator')

const loader = async (req, res) => {    
    try {
      if(ObjectId.isValid(req.user._id)){
        const user = await GHUser.findOne({"_id": req.user._id})
        const issues = await Issue.find().lean().exec();
        return res.status(200).render('main.hbs',{layout: "home_admin.hbs",
        user: user,
        issues: issues
        });
      } else {
        return res.status(400).redirect('/error?error_details=Invalid_URL')
      }
    } catch (error) {
      return res.status(500).redirect('/error?error_details=Error_Occured');
    }
  }

const deleter = async (req,res) => {
  try {
    const error = validationResult(req)
    if(error.isEmpty()){
      const {_id} = req.query
      if(ObjectId.isValid(_id)){
        const stat = await Issue.findOneAndDelete({"_id" : _id})
        const resp = await Response.deleteMany({"issue": _id}).lean().exec()
        if(stat && resp){
          return res.status(200).redirect('/admin/home')
        } else {
          return res.status(403).redirect('/error?error_details=Unable_To_Delete_Query')
        }
      } else {
        return res.status(404).redirect('/error?error_details=Query_Does_Not_Exist')
      }
    } 
    return res.send("Oops! Error Occurred...")
  } catch(err) {
    return res.status(500).redirect('/error?error_details=Error_Occurred')
  }
}

const userlist = async (req,res) => {
  try{
    const users = await GHUser.find({"role": "User"}).lean().exec();
    if(users){
      return res.status(200).render('main.hbs',{layout: "usermod.hbs",
        users: users
      })
    } else {
      return res.status(404).redirect('/error?error_details=No_Users_To_Display')
    }
  } catch(err) {
    return res.status(500).redirect('/error?error_details=Error_Occurred')
  }
}

const usermod = async (req,res) => {
  try{
    const errors = validationResult(req)
    if(errors.isEmpty()){
      const {_id} = req.query
      if(ObjectId.isValid(_id)){
        const user = await GHUser.findOne({"_id": _id})
        if(user.role != "Admin"){
          const user_resp = await GHUser.findOneAndDelete({"_id": _id})
          const issue_resp = await Issue.deleteMany({"createdBy": _id})
          const resp_resp = await Response.deleteMany({"responder.uid": _id})
          const resp_resp2 = await Response.deleteMany({"creator": _id})
          if(user_resp && issue_resp && resp_resp && resp_resp2){
            return res.status(200).redirect('/admin/userlist')
          } else {
            return res.status(403).redirect('/error?error_details=Unable_To_Delete_User')
          }
        } else {
          return res.status(405).redirect('/error?error_details=Cannot_Delete_Admin_Account')
        }
      } else {
        return res.status(404).redirect('/error?error_details=User_Does_Not_Exist')
      }
    } 
    return res.send("Oops! Error Occurred...")
  } catch(err) {
    return res.status(500).redirect('/error?error_details=Error_Occurred')
  }
}

module.exports = { loader,deleter,userlist,usermod }