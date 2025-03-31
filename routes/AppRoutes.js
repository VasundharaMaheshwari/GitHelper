const express = require('express');
const APIRouter = express.Router();
const { create, save, list, save_response, tracker, taskStatusUpdate, reviewer, responseUpdate } = require('../controllers/AppController');
const { issue_limit, response_limit } = require('../middlewares/rate_limiter');
const { saveIssue, saveRes } = require('../validators/AppValidators');
const { GHUser } = require('../models/GHUser');

APIRouter.get('/create', create);

APIRouter.get('/list', list);

APIRouter.post('/save', saveIssue, issue_limit, save);

APIRouter.post('/respond', saveRes, response_limit, save_response);

APIRouter.get('/track', tracker);

APIRouter.get('/review', reviewer);

APIRouter.get('/links', (req, res) => {
  res.cookie('refresh', req.session.userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    sameSite: 'Lax'
  });

  return res.status(201).redirect('/api/refresh');
});

APIRouter.get('/update/:id', taskStatusUpdate);

APIRouter.get('/finish/:id/:action', responseUpdate);

APIRouter.get('/editProfile', (req, res) => {
  try {
    return res.status(200).render('main.hbs', {
      layout: 'profile_edit.hbs',
      username: req.user.username,
      githubId: req.user.github_id.id,
      emailAddress: req.user.email.address
    });
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
});

APIRouter.get('/check-username', async (req, res) => {
  try {
    const { username } = req.query;
    if (username === req.user.username) return res.status(400).redirect('/error?error_details=Username_Already_Yours');

    const user = await GHUser.findOne({ username });

    if (user) return res.status(403).send({ available: false });
    else return res.status(201).send({ available: true });
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
});

module.exports = APIRouter;