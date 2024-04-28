const { Issue } = require('../models/Issue')
const { GHUser } = require('../models/GHUser')

const create = async (req,res) => {
    const {username} = req.body
    
    const user = await GHUser.findOne({ username: username })
    if(user != null){
    return res.render('main.hbs',{layout: 'create.hbs',
    username: username
  })} else {
    return res.render('main.hbs',{layout: "error.hbs",
    error_message: "Not Allowed"
  })
  }
  }

const save = async (req,res) => {
    try{
        
      const {username,contact_info,skillset,github_id,repo_link,description} = req.body

      const user = await GHUser.findOne({ username: username })
      if(user!=null){
      const check = await Issue.findOne({repo_link: repo_link})
      if(check == null){
      const trial = new Issue({
          username: username,
          contact_info: contact_info,
          skillset: skillset,
          github_id: github_id,
          repo_link: repo_link,
          description: description
      })
      await trial.save()
  return res.redirect('/api/login')}
  else {
    return res.render('main.hbs',{layout: "error.hbs",
    error_message: "Query Already Created"
  })
  }} else {
    return res.render('main.hbs',{layout: "error.hbs",
    error_message: "Not Allowed"
  })
  }
  } catch(err) {
      console.log(err)
  }
  }

module.exports = { create,save }