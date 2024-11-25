const express = require('express');
const UserRouter = express.Router();
const { login, register, load } = require('../controllers/UserController');
const { otpGen } = require('../controllers/UserController2');
const { restrict, loggedIn } = require('../middlewares/middleware');
const { register_limit, login_limit, login_limit_ip } = require('../middlewares/rate_limiter');
const { registerCheck, loginCheck, forgotCheck } = require('../validators/UserValidators');

UserRouter.post('/login', loginCheck, login_limit_ip, login_limit, loggedIn, login);

UserRouter.post('/register', registerCheck, register_limit, loggedIn, register);

UserRouter.get('/login', loggedIn, (req, res) => {
  return res.status(302).render('login.hbs');
});

UserRouter.get('/register', loggedIn, (req, res) => {
  return res.status(302).render('register.hbs');
});

UserRouter.get('/user', restrict, load);

UserRouter.get('/forgot-password', loggedIn, (req, res) => {
  return res.status(302).render('forgot.hbs');
});

UserRouter.get('/reset-password/:username', loggedIn, (req, res) => {
  const { username } = req.params;
  return res.status(302).render('main.hbs', {
    layout: 'reset.hbs',
    username: username
  });
});

UserRouter.post('/forgot-password', forgotCheck, loggedIn, otpGen);

module.exports = UserRouter;