const express = require('express');
const APIRouter = express.Router();
const { create, save, list, save_response, tracker, taskStatusUpdate } = require('../controllers/AppController');
const { issue_limit, response_limit } = require('../middlewares/rate_limiter');
const { saveIssue, saveRes } = require('../validators/AppValidators');

APIRouter.get('/create', create);

APIRouter.get('/list', list);

APIRouter.post('/save', saveIssue, issue_limit, save);

APIRouter.post('/respond', saveRes, response_limit, save_response);

APIRouter.get('/track', tracker);

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

module.exports = APIRouter;