const { ObjectId } = require('mongodb')
const { Issue } = require('../models/Issue')
const { Response } = require('../models/Response')

const edit = async (req,res) => {
    try{
      const {queryId} = req.query
      if(ObjectId.isValid(queryId)){
        const issue = await Issue.findOne({"_id": queryId})
        if(issue == null){
          return res.status(404).redirect('/error?error_details=Query_Does_Not_Exist')
        }
        return res.status(200).render('main.hbs',{layout: "edit.hbs",
          contact_info: issue.contact_info,
          skillset: issue.skillset,
          github_id: issue.github_id,
          repo_link: issue.repo_link,
          description: issue.description,
          queryId: issue._id,
          _id: req.user._id
        })
      } else{
        return res.status(404).redirect('/error?error_details=Invalid_URL')
      }
    } catch(err) {
      return res.status(500).redirect('/error?error_details=Error_Occurred')
    }
}

const delete_query = async (req,res) => {
    try {
      const {queryId} = req.query
      if(ObjectId.isValid(queryId)){
        const status = await Issue.findOneAndDelete({"_id" : queryId, "username": req.user.username})
        const resp = await Response.deleteMany({"issue": queryId}).lean().exec()
        if(status && resp){
          return res.status(200).redirect('/query/list')
        } else {
          return res.status(403).redirect('/error?error_details=Unable_To_Delete_Query')
        }
      } else {
        return res.status(404).redirect('/error?error_details=Invalid_URL')
      }
    } catch(err) {
      return res.status(500).redirect('/error?error_details=Error_Occurred')
    }
  }

const show_res = async (req,res) => {
    try{
      const {queryId} = req.query
      if(ObjectId.isValid(queryId)){
      const responses = await Response.find({"issue": queryId, "creator": req.user._id}).lean().exec()
      return res.status(200).render('main.hbs',{layout: "responses.hbs",
        responses: responses
      })
      } else {
        return res.status(404).redirect('/error?error_details=Invalid_URL')
      }
    } catch(err) {
      return res.status(500).redirect('/error?error_details=Error_Occurred')
    }
}

const save_edit = async (req,res) => {
  try{
    const {queryId} = req.query
    const {contact_info,skillset,github_id,repo_link,description} = req.body
    if(ObjectId.isValid(queryId)){
      const second = await Issue.findOne({"repo_link": repo_link})
      if(queryId == second._id && second.username == req.user.username){
        const first = await Issue.findOneAndUpdate({"_id": queryId},{
          username: req.user.username,
          contact_info: contact_info,
          skillset: skillset,
          github_id: github_id,
          repo_link: repo_link,
          description: description
        })
        if(first){
          return res.status(200).redirect('/query/list')
        } else {
          return res.status(403).redirect('/error?error_details=Unable_To_Edit_Query')
        }
      }else {
        return res.status(403).redirect('/error?error_details=Already_Exists')
      }
    } else {
      return res.status(404).redirect('/error?error_details=Invalid_URL')
    }
  } catch(err) {
    return res.status(500).redirect('/error?error_details=Error_Occurred')
  }
}

module.exports = { edit,delete_query,show_res,save_edit }