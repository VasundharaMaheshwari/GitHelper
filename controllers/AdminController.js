const { ObjectId } = require('mongodb');
const { GHUser } = require('../models/GHUser')
const { Issue } = require('../models/Issue')
const { Response } = require('../models/Response')

const loader = async (req, res) => {    
    try {
      const user = await GHUser.findOne({"_id": req.user?._id})
      const issues = await Issue.find().lean().exec();
      return res.status(200).render('main.hbs',{layout: "home_admin.hbs",
      user: user,
      issues: issues
    });
    } catch (error) {
      return res.status(500).redirect('/error?error_details=Error_Occured');
    }
  }

const deleter = async (req,res) => {
  try {
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
  } catch(err) {
    console.log(err)
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
    console.log(err)
    return res.status(500).redirect('/error?error_details=Error_Occurred')
  }
}

module.exports = { loader,deleter,userlist }