const { Issue } = require('../models/Issue')
const { GHUser } = require('../models/GHUser')

const create = async (req,res) => {
    const {username} = req.query
    
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
      const email = user.email
  return res.redirect(`/api/user?username=${username}&email=${email}`)}
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

  const list = async (req, res) => {
    const { username } = req.query;
    
    try {
      const issues = await Issue.find({ username: username }).lean().exec();
      res.render('main.hbs',{layout: "issues.hbs",
      issues: issues
    });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while fetching issues.");
    }
  };
  

module.exports = { create,save,list }