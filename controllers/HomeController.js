const { Issue } = require('../models/Issue');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');
const { GHUser } = require('../models/GHUser');
const { Response } = require('../models/Response');

const refresh = async (req, res) => {
  try {
    const userGH = ObjectId.isValid(req.user?._id) ? req.user?._id : null;
    const user = await GHUser.findOne({ '_id': userGH });
    if (user && user.role === 'Admin') {
      return res.status(403).redirect('/admin/home');
    }
    res.status(200).render('main.hbs', {
      layout: 'home.hbs',
      user: user,
    });
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const details = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { _id } = req.query;
      if (ObjectId.isValid(_id)) {

        const issue_details = await Issue.findOne({ '_id': _id });
        const userGH = ObjectId.isValid(req.user?._id) ? req.user?._id : null;
        let user = await GHUser.findOne({ '_id': userGH });
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        const usernameGH = (req) => usernameRegex.test(req.user?.username);
        const usercheck = usernameGH ? req.user?.username : null;
        const resp_check = await Response.findOne({ 'responder.uid': req.user?._id, issue: issue_details._id });
        if (user?.role === 'Admin' || usercheck === issue_details.username || resp_check) {
          user = null;
        }
        if (issue_details !== null) {
          return res.status(200).render('main.hbs', {
            layout: 'individual.hbs',
            issue_id: _id,
            username: issue_details.username,
            creator: issue_details.createdBy,
            contact_info: issue_details.contact_info,
            skillset: issue_details.skillset,
            github_id: issue_details.github_id,
            repo_link: issue_details.repo_link,
            description: issue_details.description,
            user: user
          });
        }
        else {
          return res.status(404).redirect('/error?error_details=Query_Not_Found');
        }
      } else {
        return res.status(400).redirect('/error?error_details=Invalid_URL');
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const logout = (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie('session');
    return res.status(200).redirect('/');
  } catch {
    return res.status(500).redirect('/error?error_details=Failed_To_Logout');
  }
};

function splitSkillset(input) {
  let skills = input.includes(',')
    ? input.split(',')
    : input.split(' ');

  return skills.map(skill => skill.trim()).filter(skill => skill.length > 0);
};

const searchLoad = async (req, res) => {
  const issues = await Issue.find({ priority: 1 });
  let queries = [];
  for (let query of issues) {
    const skills = splitSkillset(query.skillset);
    let modifiedQuery = {
      skillset: skills,
      repo_link: query.repo_link,
      github_id: query.github_id,
      username: query.username,
      _id: query._id,
      description: query.description
    };
    queries.push(modifiedQuery);
  }
  return res.status(200).render('main.hbs', {
    layout: 'search.hbs',
    queries
  });
};

const searchPost = async (req, res) => {
  const { searchTerm } = req.body;
  const searchSkills = splitSkillset(searchTerm.toLowerCase());

  const seen = new Set(); // to avoid duplicates
  const finalResults = [];

  for (const skill of searchSkills) {
    const issues = await Issue.find({
      skillset: { $regex: new RegExp(skill, 'i') }
    });

    for (const issue of issues) {
      if (!seen.has(issue._id.toString())) {
        seen.add(issue._id.toString());
        finalResults.push(issue);
      }
    }
    finalResults.sort((a, b) => b.priority - a.priority);
  }

  return res.status(200).json(finalResults);
};

module.exports = { refresh, details, logout, searchLoad, searchPost };