const { Issue } = require('../models/Issue')
const { ObjectId } = require('mongodb');

const { delUser } = require('../services/auth');
const { GHUser } = require('../models/GHUser');

const refresh = async (req, res) => {    
    try {
      const userGH = ObjectId.isValid(req.user?._id) ? req.user?._id : null 
      const user = await GHUser.findOne({"_id": userGH})
      if(user && user.role == "Admin"){
        return res.status(403).redirect('/admin/home')
      }
      const issues = await Issue.find().lean().exec();
      res.status(200).render('main.hbs',{layout: "home.hbs",
      user: user,
      issues: issues
    });
    } catch (error) {
      return res.status(500).redirect('/error?error_details=Error_Occurred');
    }
  };

const details = async (req,res) => {
  try{
  const {_id} = req.query
  if(ObjectId.isValid(_id)){

  const issue_details = await Issue.findOne({"_id": _id})
  const userGH = ObjectId.isValid(req.user?._id) ? req.user?._id : null 
  var user = await GHUser.findOne({"_id": userGH})
  if(user?.role == "Admin" || req.user?.username == issue_details.username){
    user = null
  }
  if(issue_details != null){
    return res.status(200).render('main.hbs',{layout: "individual.hbs",
    _id: _id,
    username: issue_details.username,
    contact_info: issue_details.contact_info,
    skillset: issue_details.skillset,
    github_id: issue_details.github_id,
    repo_link: issue_details.repo_link,
    description: issue_details.description,
    user: user
  })
  }
  else{
    return res.status(404).redirect('/error?error_details=Query_Not_Found')
  }
} else {
  return res.status(400).redirect('/error?error_details=Invalid_URL')
}
  } catch(err) {
    console.log(err)
    return res.status(500).redirect('/error?error_details=Error_Occurred')
  }
}

const logout = (req,res) => {
  try{
  delUser(res.cookie?.uid)
  res.clearCookie('uid')
  return res.status(200).redirect('/api/login')
  } catch (err) {
    return res.status(500).redirect('/error?error_details=Failed_To_Logout')
  }
}

module.exports = { refresh,details,logout }