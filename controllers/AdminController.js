const { ObjectId } = require('mongodb');
const { GHUser } = require('../models/GHUser')
const { Issue } = require('../models/Issue')
const { Response } = require('../models/Response')
const { Convo } = require('../models/Convo')
const { Block } = require('../models/Block')
const { validationResult } = require('express-validator');
const { Msg } = require('../models/Msg');

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

  const deleter = async (req, res) => {
    try {
      const error = validationResult(req);
      if (error.isEmpty()) {
        const { _id } = req.query;
        if (ObjectId.isValid(_id)) {

          const stat = await Issue.findOneAndDelete({ "_id": _id });
  
          const responses = await Response.find({ "issue": _id }).lean();
          const respDelete = await Response.deleteMany({ "issue": _id }).lean().exec();
  
          const responseIds = responses.map(resp => resp._id);
          const convos = await Convo.find({ "response": { $in: responseIds } }).lean();
          const conDelete = await Convo.deleteMany({ "response": { $in: responseIds } }).lean().exec();
  
          const convoIds = convos.map(con => con._id);
          const msgDelete = await Msg.deleteMany({ "convoId": { $in: convoIds } }).lean().exec();
  
          if (stat && respDelete && conDelete && msgDelete) {
            return res.status(200).redirect('/admin/home');
          } else {
            return res.status(403).redirect('/error?error_details=Unable_To_Delete_Query');
          }
        } else {
          return res.status(404).redirect('/error?error_details=Query_Does_Not_Exist');
        }
      } 
      return res.send("Oops! Error Occurred...");
    } catch (err) {
      return res.status(500).redirect('/error?error_details=Error_Occurred');
    }
  };
  

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
        if(user.role !== "Admin"){
          const user_resp = await GHUser.findOneAndDelete({"_id": _id})
          const issue_resp = await Issue.deleteMany({"createdBy": _id})
          const resp_resp = await Response.deleteMany({$or: [
            {"responder.uid": _id},{"creator": _id}
          ]})
          const con_resp = await Convo.deleteMany({$or: [
            {"initiator": _id},{"receiver": _id}
          ]})
          const msg_resp = await Msg.deleteMany({$or: [
            {"sender": _id},{"receiver": _id}
          ]})

          const trial2 = new Block({
            email: user.email,
            github_id: user.github_id
        })

        await trial2.save()

          if(user_resp && issue_resp && resp_resp && con_resp && msg_resp){
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

const viewer = async (req,res) => {
  try{
    const errors = validationResult(req)
    if(errors.isEmpty()){
  const {_id} = req.query
  if(ObjectId.isValid(_id)){

  const issue_details = await Issue.findOne({"_id": _id})
  if(issue_details != null){
    return res.status(200).render('main.hbs',{layout: "individual_admin.hbs",
    _id: _id,
    username: issue_details.username,
    contact_info: issue_details.contact_info,
    skillset: issue_details.skillset,
    github_id: issue_details.github_id,
    repo_link: issue_details.repo_link,
    description: issue_details.description
  })
  }
  else{
    return res.status(404).redirect('/error?error_details=Query_Not_Found')
  }
} else {
  return res.status(400).redirect('/error?error_details=Invalid_URL')
} }
return res.send("Oops! Error Occurred...")
  } catch(err) {
    return res.status(500).redirect('/error?error_details=Error_Occurred')
  }
}

const detailsBan =  async (req,res) => {
  try{
    const bannedUsers = await Block.find().lean().exec()
  return res.status(200).render('main.hbs',{layout: "admin.hbs",
       username: req.user.username,
       email: req.user.email,
       github_id: req.user.github_id,
       bannedUsers: bannedUsers
  })}  catch (err) {
    return res.status(500).redirect('/error?error_details=Error_Occurred')
  } }

module.exports = { loader,deleter,userlist,usermod,viewer,detailsBan }