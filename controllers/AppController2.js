const { ObjectId } = require('mongodb')
const { Issue } = require('../models/Issue')

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
          _id: issue._id
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
        const status = await Issue.findOneAndDelete({"_id" : queryId})
        if(status){
          return res.status(200).redirect('/query/list')
        } else {
          return res.status(403).redirect('/error?error_details=Unable_To_Delete_Query')
        }
      } else {
        return res.status(404).redirect('/error?error_details=Query_Does_Not_Exist')
      }
    } catch(err) {
      return res.status(500).redirect('/error?error_details=Error_Occurred')
    }
  }

const show_res = (req,res) => {
    return res.status(201).send('Success')
}

module.exports = { edit,delete_query,show_res }