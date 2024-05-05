const { Issue } = require('../models/Issue')
const { Response } = require('../models/Response')
const { GHUser } = require('../models/GHUser')
const { ObjectId } = require('mongodb')

const create = async (req,res) => {
  try{
    if(ObjectId.isValid(req.user._id)){
      const hey = await GHUser.findOne({"_id": req.user._id})
      if(hey){
    return res.status(200).render('main.hbs',{layout: "create.hbs",
      _id: req.user._id
    })
  } else {
    return res.status(403).redirect('/error?error_details=Not_Allowed')
  }
  } else {
    return res.status(403).redirect('/error?error_details=Not_Allowed')
  }
  } catch(err) {
    return res.status(500).redirect('/error?error_details=Error_Occurred')
  }
  }

const save = async (req,res) => {
    try{
        
      const {contact_info,skillset,github_id,repo_link,description} = req.body

      const check = await Issue.findOne({repo_link: repo_link})
      if(check == null){
      const trial = new Issue({
          username: req.user.username,
          contact_info: contact_info,
          skillset: skillset,
          github_id: github_id,
          repo_link: repo_link,
          description: description,
          createdBy: req.user._id
      })
      await trial.save()
  return res.status(201).redirect(`/api/user`)} else {
    return res.status(403).redirect('/error?error_details=Query_Already_Exists')
  }
  } catch(err) {
      return res.status(500).redirect('/error?error_details=Error_Occurred')
  }
  }

  const list = async (req, res) => {    
    try {
      const issues = await Issue.find({ username: req.user.username }).lean().exec();
      return res.status(200).render('main.hbs',{layout: "issues.hbs",
      issues: issues
    });
    } catch (error) {
      return res.status(500).redirect('/error?error_details=Error_Occurred')
    }};

const responder = async (req,res) => {
  try{
  const {username,_id} = req.query
  const user = await GHUser.findOne({username: username})
  if(ObjectId.isValid(_id) && user != null){
  return res.status(200).render('main.hbs',{layout: "response.hbs",
  _id: req.user._id,
  issue_id: _id,
  creator: user._id})}
  else {
    return res.status(400).redirect('/error?error_details=Invalid_URL')
  }
} catch(err) {
  return res.status(500).redirect('/error?error_details=Error_Occurred')
}
}

const save_response = async (req,res) => {
  try{
  const {issue_id,creator,github_id} = req.body
  if(creator != req.user._id && ObjectId.isValid(issue_id)){
    const resp_check = await Response.findOne({"responder.uid": req.user._id, "issue" : issue_id})
    if(resp_check == null){
    const response_ = new Response({
      responder:{
        username : req.user.username,
        uid : req.user._id,
        github_id : github_id
      },
      issue: issue_id,
      creator: creator
    })
    await response_.save()
    return res.status(201).redirect('/home')} else {
      return res.status(403).redirect('/error?error_details=Already_Responded')
    }
  }else{
    return res.status(403).redirect('/error?error_details=Not_Allowed')
  }} catch(err) {
    return res.status(500).redirect('/error?error_details=Error_Occurred')
  }
}
  
module.exports = { create,save,list,responder,save_response }