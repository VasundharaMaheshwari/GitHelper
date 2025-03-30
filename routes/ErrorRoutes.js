const express = require('express');
const ErrorRouter = express.Router();
const { error, contactus, leaderboard, profileLoad } = require('../controllers/ErrorController');
const { ErrorCheck, msgCheck } = require('../validators/ErrorValidators');
const { contact_limit } = require('../middlewares/rate_limiter');

ErrorRouter.get('/', ErrorCheck, error);

ErrorRouter.get('/faq', (req, res) => {
  return res.status(200).render('main.hbs', {
    layout: 'faq.hbs'
  });
});

ErrorRouter.get('/terms', (req, res) => {
  return res.status(200).render('main.hbs', {
    layout: 'tandc.hbs'
  });
});

ErrorRouter.get('/privacy', (req, res) => {
  return res.status(200).render('main.hbs', {
    layout: 'privacypolic.hbs'
  });
});

ErrorRouter.get('/contact', (req, res) => {
  return res.status(200).render('main.hbs', {
    layout: 'contactus.hbs'
  });
});

ErrorRouter.get('/leaderboard', leaderboard);

ErrorRouter.post('/send', msgCheck, contact_limit, contactus);

ErrorRouter.get('/profile/:username', profileLoad);

module.exports = ErrorRouter;