const { Issue } = require('../models/Issue')

const refresh = async (req, res) => {    
    try {
      const issues = await Issue.find().lean().exec();
      res.render('main.hbs',{layout: "home.hbs",
      issues: issues
    });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while fetching issues.");
    }
  };

const details = async (req,res) => {
  const {_id} = req.query

  const issue_details = await Issue.findOne({"_id": _id})

  if(issue_details != null){
    return res.send(issue_details)
  }
  else{
    return res.render('main.hbs',{layout: "error.hbs",
    error_message: "Issue No Longer Exists"
  })
  }
}

module.exports = { refresh,details }