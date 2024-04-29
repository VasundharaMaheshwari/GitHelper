const { Issue } = require('../models/Issue')
const { GHUser } = require('../models/GHUser')

const create = (req,res) => {
    return res.render('create.hbs')
  }

const save = async (req,res) => {
    try{
        
      const {contact_info,skillset,github_id,repo_link,description} = req.body

      const check = await Issue.findOne({repo_link: repo_link})
      if(check == null){
      const trial = new Issue({
          username: req.user.username,
          contact_info: contact_info,
          skillset: skillset,
          github_id: github_id,
          repo_link: repo_link,
          description: description,
          createdBy: req.user._id
      })
      await trial.save()
  return res.redirect(`/api/user`)}
  } catch(err) {
      return res.redirect('/error?error_details=Error_Occurred')
  }
  }

  const list = async (req, res) => {    
    try {
      const issues = await Issue.find({ username: req.user.username }).lean().exec();
      res.render('main.hbs',{layout: "issues.hbs",
      issues: issues
    });
    } catch (error) {
      return res.redirect('/error?error_details=Error_Occurred')
    }};

const responder = async (req,res) => {
  const {username,_id} = req.query
  const user = await GHUser.findOne({username: username})
  return res.render('main.hbs',{layout: "response.hbs",
  issue_id: _id,
  creator: user._id
})
}
  
module.exports = { create,save,list,responder }