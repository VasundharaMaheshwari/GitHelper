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

module.exports = { refresh }