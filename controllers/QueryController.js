const { ObjectId } = require('mongodb');
const { Issue } = require('../models/Issue');
const { Response } = require('../models/Response');
const { validationResult } = require('express-validator');
const { Convo } = require('../models/Convo');
const { Msg } = require('../models/Msg');

const edit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { queryId } = req.query;
      if (ObjectId.isValid(queryId) && ObjectId.isValid(req.user._id)) {
        const issue = await Issue.findOne({ '_id': queryId, 'createdBy': req.user._id });
        if (issue === null) {
          return res.status(404).redirect('/error?error_details=Query_Does_Not_Exist');
        }
        return res.status(200).render('main.hbs', {
          layout: 'edit.hbs',
          contact_info: issue.contact_info,
          skillset: issue.skillset,
          // github_id: issue.github_id,
          repo_link: issue.repo_link,
          description: issue.description,
          queryId: issue._id,
          _id: req.user._id
        });
      } else {
        return res.status(404).redirect('/error?error_details=Invalid_URL');
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const delete_query = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { queryId } = req.query;
      const regex = /^[a-zA-Z0-9_]+$/;
      const checker = regex.test(req.user.username);
      if (ObjectId.isValid(queryId) && checker) {
        const issue = await Issue.findOneAndDelete({ '_id': queryId, 'username': req.user.username });
        if (issue) {
          const responses = await Response.find({ 'issue': queryId }).lean();

          const responseIds = responses.map(response => response._id);

          const respDeleteStatus = await Response.deleteMany({ 'issue': queryId }).lean().exec();

          const conDeleteStatus = await Convo.deleteMany({ 'response': { $in: responseIds } }).lean().exec();

          const msgDeleteStatus = await Msg.deleteMany({ 'issue': queryId }).lean().exec();

          if (respDeleteStatus && conDeleteStatus && msgDeleteStatus) {
            return res.status(200).redirect('/query/list');
          } else {
            return res.status(403).redirect('/error?error_details=Unable_To_Delete_Query');
          }
        } else {
          return res.status(403).redirect('/error?error_details=Unable_To_Find_Query');
        }
      } else {
        return res.status(404).redirect('/error?error_details=Invalid_URL');
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};


const show_res = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { queryId } = req.query;
      if (ObjectId.isValid(queryId) && ObjectId.isValid(req.user._id)) {
        const responses = await Response.find({ 'issue': queryId, 'creator': req.user._id }).lean().exec();
        return res.status(200).render('main.hbs', {
          layout: 'responses.hbs',
          responses: responses
        });
      } else {
        return res.status(404).redirect('/error?error_details=Invalid_URL');
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const save_edit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { queryId } = req.query;
      const { contact_info, skillset, repo_link, description } = req.body;
      const regex = /^[a-zA-Z0-9_]+$/;
      const checker = regex.test(req.user.username);
      if (ObjectId.isValid(queryId) && checker) {
        const second = await Issue.findOne({ 'repo_link': repo_link, 'createdBy': req.user._id });
        if (queryId.toString() === second._id.toString() && second.username === req.user.username) {
          const first = await Issue.findOneAndUpdate({ '_id': queryId }, {
            // username: req.user.username,
            contact_info: contact_info,
            skillset: skillset,
            // github_id: github_id,
            // repo_link: repo_link,
            description: description
          });
          if (first) {
            return res.status(200).redirect('/query/list');
          } else {
            return res.status(403).redirect('/error?error_details=Unable_To_Edit_Query');
          }
        } else {
          return res.status(403).redirect('/error?error_details=Unable_To_Find_Valid_Query');
        }
      } else {
        return res.status(404).redirect('/error?error_details=Invalid_URL');
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

module.exports = { edit, delete_query, show_res, save_edit };