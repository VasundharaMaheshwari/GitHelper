const { GHUser } = require('../models/GHUser')
const { Issue } = require('../models/Issue')

const loader = async (req, res) => {    
    try {
      const user = await GHUser.findOne({"_id": req.user?._id})
      const issues = await Issue.find().lean().exec();
      return res.render('main.hbs',{layout: "home_admin.hbs",
      user: user,
      issues: issues
    });
    } catch (error) {
      return res.redirect('/error?error_details=Error_Occured');
    }
  }

module.exports = { loader }