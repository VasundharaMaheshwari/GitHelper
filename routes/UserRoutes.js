const express = require('express');
const UserRouter = express.Router();
const { login, register, load } = require('../controllers/UserController');
const { restrict, loggedIn } = require('../middlewares/middleware');
const { register_limit, login_limit, login_limit_ip } = require('../middlewares/rate_limiter');
const { registerCheck, loginCheck } = require('../validators/UserValidators');

UserRouter.post('/login', loginCheck, login_limit_ip, login_limit, loggedIn, login);

UserRouter.post('/register', registerCheck, register_limit, loggedIn, register);

UserRouter.get('/login', loggedIn, (req, res) => {
  return res.status(302).render('login.hbs');
});

UserRouter.get('/register', loggedIn, (req, res) => {
  return res.status(302).render('register.hbs');
});

UserRouter.get('/user', restrict, load);

module.exports = UserRouter;