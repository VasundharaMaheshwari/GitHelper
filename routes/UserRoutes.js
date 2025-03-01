const express = require('express');
const UserRouter = express.Router();
const { login, register, load } = require('../controllers/UserController');
const { otpGen, reset, passChange } = require('../controllers/UserController2');
const { restrict, loggedIn, loggedInPass } = require('../middlewares/middleware');
const { register_limit, login_limit, login_limit_ip, reset_limit_ip, reset_limit } = require('../middlewares/rate_limiter');
const { registerCheck, loginCheck, forgotCheck, userCheck, resetCheck } = require('../validators/UserValidators');
const { forget_limit_ip } = require('../middlewares/rate_limiter2');

UserRouter.post('/login', loginCheck, login_limit_ip, login_limit, loggedIn, login);

UserRouter.post('/register', registerCheck, register_limit, loggedIn, register);

UserRouter.get('/login', loggedIn, (req, res) => {
  return res.status(302).render('login.hbs');
});

UserRouter.get('/register', loggedIn, async (req, res) => {
  if (req.signedCookies?.verify) {
    res.clearCookie('verify');
  }
  return res.status(302).render('register.hbs');
});

UserRouter.get('/user', restrict, load);

UserRouter.get('/forgot-password', loggedIn, (req, res) => {
  return res.status(302).render('forgot.hbs');
});

UserRouter.get('/reset-password/:id', userCheck, reset_limit_ip, reset_limit, loggedInPass, reset);

UserRouter.post('/reset-password/:id', resetCheck, reset_limit_ip, reset_limit, loggedInPass, passChange);

UserRouter.post('/forgot-password', forgotCheck, forget_limit_ip, loggedIn, otpGen);

module.exports = UserRouter;