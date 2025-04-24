const { validationResult } = require('express-validator');
const { Contact } = require('../models/Contact');
const { transporter, emessage } = require('../services/mail');
const { GHUser } = require('../models/GHUser');
const { Response } = require('../models/Response');
const { Issue } = require('../models/Issue');
const { startOfMonth, endOfMonth } = require('date-fns');

const error = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { error_details } = req.query;
    return res.status(200).render('main.hbs', {
      layout: 'error.hbs',
      error_message: error_details
    });
  }
  return res.send('Oops! Error Occurred...');
};

const contactus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { name, email, message } = req.body;
      const contact = new Contact({
        name: name,
        email: email,
        message: message
      });

      await contact.save();

      const mailer = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Query Received!',
        html: emessage
      };

      await transporter.sendMail(mailer);
      return res.status(200).redirect('/home');
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const leaderboard = async (req, res) => {
  try {
    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());

    const topTenAll = await GHUser.find({ role: 'User' }).sort({ total_points: -1 }).limit(10).lean();
    const topTenIds = topTenAll.map(user => user._id);

    const topTenUpcoming = await GHUser.find({ createdAt: { $gte: startDate, $lte: endDate }, _id: { $nin: topTenIds }, role: 'User' }).sort({ total_points: -1 }).limit(10).lean();

    return res.status(200).render('main.hbs', {
      layout: 'leaderboard.hbs',
      topTenAll: topTenAll,
      topTenUpcoming: topTenUpcoming
    });
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const profileLoad = async (req, res) => {
  try {
    const error = validationResult(req);
    if (error.isEmpty()) {
      const { username } = req.params;
      if (!username) return res.status(400).redirect('/error?error_details=Invalid_URL');

      const user = await GHUser.findOne({ username });
      if (!user) return res.status(404).redirect('/error?error_details=User_Not_Found');

      const responses = await Response.find({ 'responder.uid': user._id, status: 'Accepted' });

      let projects = [];

      for (const response of responses) {
        const issue = await Issue.findOne({ _id: response.issue });
        let project = {};
        if (!issue) {
          project = {
            name: response.extra.username,
            description: response.extra.description,
            repoLink: response.extra.repo_link
          };
        } else {
          project = {
            name: issue.username,
            description: issue.description,
            repoLink: issue.repo_link
          };
        }
        projects.push(project);
      }
      return res.status(200).render('main.hbs', {
        layout: 'pfp.hbs',
        projects,
        username,
        emailAddress: user.email.address,
        githubId: user.github_id.id
      });
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

module.exports = { error, contactus, leaderboard, profileLoad };