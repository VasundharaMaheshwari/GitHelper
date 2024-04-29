const { Issue } = require('../models/Issue')
const { ObjectId } = require('mongodb');

const refresh = async (req, res) => {    
    try {
      const issues = await Issue.find().lean().exec();
      res.render('main.hbs',{layout: "home.hbs",
      issues: issues
    });
    } catch (error) {
      return res.redirect('/error?error_details=Error_Occured');
    }
  };

const details = async (req,res) => {
  const {_id} = req.query
  if(ObjectId.isValid(_id)){

  const issue_details = await Issue.findOne({"_id": _id})

  if(issue_details != null){
    return res.render('main.hbs',{layout: "individual.hbs",
    id: _id,
    username: issue_details.username,
    contact_info: issue_details.contact_info,
    skillset: issue_details.skillset,
    github_id: issue_details.github_id,
    repo_link: issue_details.repo_link,
    description: issue_details.description
  })
  }
  else{
    return res.redirect('/error?error_details=Query_Not_Found')
  }
} else {
  return res.redirect('/error?error_details=Invalid_URL')
}
}

module.exports = { refresh,details }