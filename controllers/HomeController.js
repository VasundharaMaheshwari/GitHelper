const { Issue } = require('../models/Issue')

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

  const issue_details = await Issue.findOne({"_id": _id})

  if(issue_details != null){
    return res.send(issue_details)
  }
  else{
    return res.redirect('/error?error_details=Query_Not_Found')
  }
}

module.exports = { refresh,details }