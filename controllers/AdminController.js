const { ObjectId } = require('mongodb');
const { GHUser } = require('../models/GHUser');
const { Issue } = require('../models/Issue');
const { Response } = require('../models/Response');
const { Convo } = require('../models/Convo');
const { Block } = require('../models/Block');
const { validationResult } = require('express-validator');
const { Msg } = require('../models/Msg');
const { default: mongoose } = require('mongoose');
const { OTP } = require('../models/OTP');
const { VerifyOTP } = require('../models/VerifyOTP');

const loader = async (req, res) => {
  try {
    if (ObjectId.isValid(req.user._id)) {
      const user = await GHUser.findOne({ '_id': req.user._id });
      const issues = await Issue.find().lean().exec();
      return res.status(200).render('main.hbs', {
        layout: 'home_admin.hbs',
        user: user,
        issues: issues
      });
    } else {
      return res.status(400).redirect('/error?error_details=Invalid_URL');
    }
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occured');
  }
};

const deleter = async (req, res) => {
  try {
    const error = validationResult(req);
    if (error.isEmpty()) {
      const { _id } = req.query;
      if (ObjectId.isValid(_id)) {

        const stat = await Issue.findOneAndDelete({ '_id': _id });

        // const responses = await Response.find({ 'issue': _id, 'status': { $nin: ['Accepted'] } }).lean();
        const extra = await Response.updateMany({ 'issue': _id, status: 'Accepted' }, { extra: stat }).lean().exec();

        const respDeleteStatus = await Response.deleteMany({ 'issue': _id, status: { $nin: ['Accepted'] } }).lean().exec();

        // const responseIds = responses.map(resp => resp._id);
        // const convos = await Convo.find({ 'response': { $in: responseIds } }).lean();
        // const conDelete = await Convo.deleteMany({ 'response': { $in: responseIds } }).lean().exec();

        // const convoIds = convos.map(con => con._id);
        // const msgDelete = await Msg.deleteMany({ 'convoId': { $in: convoIds } }).lean().exec();

        if (stat && extra && respDeleteStatus) {
          return res.status(200).redirect('/admin/home');
        } else {
          return res.status(403).redirect('/error?error_details=Unable_To_Delete_Query');
        }
      } else {
        return res.status(404).redirect('/error?error_details=Query_Does_Not_Exist');
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};


const userlist = async (req, res) => {
  try {
    const users = await GHUser.find({ 'role': 'User' }).lean().exec();
    if (users) {
      return res.status(200).render('main.hbs', {
        layout: 'usermod.hbs',
        users: users
      });
    } else {
      return res.status(404).redirect('/error?error_details=No_Users_To_Display');
    }
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const usermod = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { _id } = req.query;
      if (ObjectId.isValid(_id)) {
        const user = await GHUser.findOne({ '_id': _id });
        if (user.role !== 'Admin') {
          const user_resp = await GHUser.findOneAndDelete({ '_id': _id });
          const resp_resp = await Response.deleteMany({ 'responder.uid': _id });
          const responses = await Response.find({ 'creator': _id, status: 'Accepted' });
          for (const response of responses) {
            const issue = await Issue.findOne({ '_id': response.issue });
            if (issue) {
              await Response.findByIdAndUpdate(response._id, { extra: issue });
            }
          }
          const resp = await Response.deleteMany({
            'creator': _id, status: { $nin: ['Accepted'] }
          });
          const issue_resp = await Issue.deleteMany({ 'createdBy': _id });
          const con_resp = await Convo.deleteMany({
            $or: [
              { 'initiator': _id }, { 'receiver': _id }
            ]
          });
          const msg_resp = await Msg.deleteMany({
            $or: [
              { 'sender': _id }, { 'receiver': _id }
            ]
          });
          const OTP_resp = await OTP.deleteMany({ email: user.email.address });

          const OTP_verify = await VerifyOTP.deleteMany({ email: user.email.address });

          const trial2 = new Block({
            email: user.email.address,
            github_id: user.github_id.id
          });

          await trial2.save();

          const sessionCollection = mongoose.connection.collection('sessions');
          const sess_resp = await sessionCollection.deleteMany({ 'session.userId': user._id });

          if (user_resp && issue_resp && resp_resp && con_resp && msg_resp && sess_resp && OTP_resp && OTP_verify && resp) {
            return res.status(200).redirect('/admin/userlist');
          } else {
            return res.status(403).redirect('/error?error_details=Unable_To_Delete_User');
          }
        } else {
          return res.status(405).redirect('/error?error_details=Cannot_Delete_Admin_Account');
        }
      } else {
        return res.status(404).redirect('/error?error_details=User_Does_Not_Exist');
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const viewer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { _id } = req.query;
      if (ObjectId.isValid(_id)) {

        const issue_details = await Issue.findOne({ '_id': _id });
        if (issue_details !== null) {
          return res.status(200).render('main.hbs', {
            layout: 'individual_admin.hbs',
            _id: _id,
            username: issue_details.username,
            contact_info: issue_details.contact_info,
            skillset: issue_details.skillset,
            github_id: issue_details.github_id,
            repo_link: issue_details.repo_link,
            description: issue_details.description
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

const detailsBan = async (req, res) => {
  try {
    // const bannedUsers = await Block.find().lean().exec()
    return res.status(200).render('main.hbs', {
      layout: 'admin.hbs',
      username: req.user.username,
      email: req.user.email.address,
      github_id: req.user.github_id.id,
      //  bannedUsers: bannedUsers
    });
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const bannedUsers = async (req, res) => {
  try {
    const bannedUsers = await Block.find().lean().exec();
    return res.status(200).render('main.hbs', {
      layout: 'banned users.hbs',
      bannedUsers: bannedUsers
    });
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

module.exports = { loader, deleter, userlist, usermod, viewer, detailsBan, bannedUsers };