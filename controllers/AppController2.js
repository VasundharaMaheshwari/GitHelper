const { ObjectId } = require('mongodb')
const { Issue } = require('../models/Issue')

const edit = (req,res) => {
    return res.status(201).send('Success')
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
        console.log(err)
      return res.status(500).redirect('/error?error_details=Error_Occurred')
    }
  }

const show_res = (req,res) => {
    return res.status(201).send('Success')
}

module.exports = { edit,delete_query,show_res }