const { Issue } = require('../models/Issue')
const { Response } = require('../models/Response')
const { GHUser } = require('../models/GHUser')
const { ObjectId } = require('mongodb')
const { validationResult } = require('express-validator')

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
        const error = validationResult(req)
        if(error.isEmpty()){
      const {contact_info,skillset,repo_link,description} = req.body
      const regex = /^[a-zA-Z0-9_]+$/
      const checker = regex.test(req.user.username)
      if(checker){
      const check = await Issue.findOne({repo_link: repo_link})
      if(check === null){
      const trial = new Issue({
          username: req.user.username,
          contact_info: contact_info,
          skillset: skillset,
          github_id: req.user.github_id,
          repo_link: repo_link,
          description: description,
          createdBy: req.user._id
      })
      await trial.save()
  return res.status(201).redirect(`/api/user`)} else {
    return res.status(403).redirect('/error?error_details=Query_Already_Exists')
  }
  } else {
    return res.status(400).redirect('/error?error_details=Invalid_URL')
  }}
  return res.send("Oops! Error Occurred...")
} catch(err) {
      return res.status(500).redirect('/error?error_details=Error_Occurred')
  }
  }

  const list = async (req, res) => {    
    try {
      const regex = /^[a-zA-Z0-9_]+$/
      const checker = regex.test(req.user.username)
      if(checker){
      const issues = await Issue.find({ username: req.user.username }).lean().exec()
      return res.status(200).render('main.hbs',{layout: "issues.hbs",
      issues: issues
    })
    } else {
      return res.status(400).redirect('/error?error_details=Invalid_URL')
    }
  } catch (error) {
      return res.status(500).redirect('/error?error_details=Error_Occurred')
    }}

const save_response = async (req,res) => {
  try{
    const errors = validationResult(req)
    if(errors.isEmpty()){
  const {issue_id,creator} = req.body
  const regex = /^[a-zA-Z0-9_]+$/
  const checker = regex.test(req.user.username)
  if(creator.toString() !== req.user._id.toString() && ObjectId.isValid(issue_id) && ObjectId.isValid(req.user._id) && checker){
    const resp_check = await Response.findOne({"responder.uid": req.user._id, "issue" : issue_id})
    if(resp_check === null){
    const response_ = new Response({
      responder:{
        username : req.user.username,
        uid : req.user._id,
        github_id : req.user.github_id
      },
      issue: issue_id,
      creator: creator,
      approved: false
    })
    await response_.save()
    return res.status(201).redirect('/home')} else {
      return res.status(403).redirect('/error?error_details=Already_Responded')
    }
  }else{
    return res.status(403).redirect('/error?error_details=Not_Allowed')
  }
}
return res.send("Oops! Error Occurred...")
} catch(err) {
    return res.status(500).redirect('/error?error_details=Error_Occurred')
  }
}
  
module.exports = { create,save,list,save_response }