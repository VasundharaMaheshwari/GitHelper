const { Issue } = require('../models/Issue')
const { GHUser } = require('../models/GHUser')
const { ObjectId } = require('mongodb');

const create = async (req,res) => {
    const {id} = req.query
    if(ObjectId.isValid(id)){
    
    const user = await GHUser.findOne({ "_id": id })
    if(user != null){
    return res.render('main.hbs',{layout: 'create.hbs',
    id: user._id
  })} else {
    return res.redirect('/error?error_details=Not_Allowed')
  }
} else {
  return res.redirect('/error?error_details=Invalid_URL')
}
  }

const save = async (req,res) => {
    try{
        
      const {id,contact_info,skillset,github_id,repo_link,description} = req.body

      const user = await GHUser.findOne({ "_id": id })
      if(ObjectId.isValid(id)){
      if(user!=null){
      const check = await Issue.findOne({repo_link: repo_link})
      if(check == null){
      const trial = new Issue({
          username: user.username,
          contact_info: contact_info,
          skillset: skillset,
          github_id: github_id,
          repo_link: repo_link,
          description: description
      })
      await trial.save()
      const id = user._id
  return res.redirect(`/api/user?id=${id}`)}
  else {
    return res.redirect('/error?error_details=Query_Already_Created')
  }} else {
    return res.redirect('/error?error_details=Not_Allowed')
  }
} else {
  return res.redirect('/error?error_details=Invalid_URL')
}
  } catch(err) {
      console.log(err)
  }
  }

  const list = async (req, res) => {
    const { id } = req.query;
    if(ObjectId.isValid(id)){
    const user = await GHUser.findOne({"_id": id})
    
    try {
      const issues = await Issue.find({ username: user.username }).lean().exec();
      res.render('main.hbs',{layout: "issues.hbs",
      issues: issues
    });
    } catch (error) {
      return res.redirect('/error?error_details=Error_Occurred')
    }} else {
      return res.redirect('/error?error_details=Invalid_URL')
    }
  };
  

module.exports = { create,save,list }