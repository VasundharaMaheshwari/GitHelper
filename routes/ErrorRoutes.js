const express = require('express');
const ErrorRouter = express.Router();
const { error, contactus } = require('../controllers/ErrorController');
const { ErrorCheck, msgCheck } = require('../validators/ErrorValidators');
const { contact_limit } = require('../middlewares/rate_limiter');
const { GHUser } = require('../models/GHUser');
const { startOfMonth, endOfMonth } = require('date-fns');

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

ErrorRouter.get('/leaderboard', async (req, res) => {
  try {
    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());

    const topTenAll = await GHUser.find().sort({ total_points: -1 }).limit(10).lean();
    const topTenIds = topTenAll.map(user => user._id);

    const topTenUpcoming = await GHUser.find({ createdAt: { $gte: startDate, $lte: endDate }, _id: { $nin: topTenIds } }).sort({ total_points: -1 }).limit(10).lean();

    return res.status(200).render('main.hbs', {
      layout: 'leaderboard.hbs',
      topTenAll: topTenAll,
      topTenUpcoming: topTenUpcoming
    });
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
});

ErrorRouter.post('/send', msgCheck, contact_limit, contactus);

module.exports = ErrorRouter;