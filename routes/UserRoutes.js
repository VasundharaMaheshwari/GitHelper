const express = require('express');
const UserRouter = express.Router();
const { login, register, load } = require('../controllers/UserController');
const { otpGen, reset, passChange } = require('../controllers/UserController2');
const { restrict, loggedIn } = require('../middlewares/middleware');
const { register_limit, login_limit, login_limit_ip, reset_limit_ip, reset_limit } = require('../middlewares/rate_limiter');
const { registerCheck, loginCheck, forgotCheck, userCheck, resetCheck } = require('../validators/UserValidators');
const { GHUser } = require('../models/GHUser');
const mongoose = require('mongoose');

UserRouter.post('/login', loginCheck, login_limit_ip, login_limit, loggedIn, login);

UserRouter.post('/register', registerCheck, register_limit, loggedIn, register);

UserRouter.get('/login', loggedIn, (req, res) => {
  return res.status(302).render('login.hbs');
});

UserRouter.get('/register', loggedIn, async (req, res) => {
  if (req.signedCookies.session) {
    const incomplete = new mongoose.Types.ObjectId(req.signedCookies.session);
    if (await GHUser.findById(incomplete)) {
      await GHUser.findByIdAndDelete(incomplete);
    }
    res.clearCookie('session');
  }
  return res.status(302).render('register.hbs');
});

UserRouter.get('/user', restrict, load);

UserRouter.get('/forgot-password', loggedIn, (req, res) => {
  return res.status(302).render('forgot.hbs');
});

UserRouter.get('/reset-password/:id', userCheck, reset_limit_ip, reset_limit, loggedIn, reset);

UserRouter.post('/reset-password/:id', resetCheck, loggedIn, passChange);

UserRouter.post('/forgot-password', forgotCheck, loggedIn, otpGen);

module.exports = UserRouter;