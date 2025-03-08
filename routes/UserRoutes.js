const express = require('express');
const UserRouter = express.Router();
const { login, register, load } = require('../controllers/UserController');
const { otpGen, reset, passChange } = require('../controllers/UserController2');
const { restrict, loggedIn, loggedInPass, gitRefreshCheck } = require('../middlewares/middleware');
const { register_limit, login_limit, login_limit_ip, reset_limit_ip, reset_limit } = require('../middlewares/rate_limiter');
const { registerCheck, loginCheck, forgotCheck, userCheck, resetCheck } = require('../validators/UserValidators');
const { forget_limit_ip } = require('../middlewares/rate_limiter2');
const passport = require('passport');
const { default: mongoose } = require('mongoose');
const { GHUser } = require('../models/GHUser');
const { default: axios } = require('axios');

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

UserRouter.get('/refresh', gitRefreshCheck,
  passport.authenticate('github-refresh', { scope: ['public_repo'], session: false }));

UserRouter.get('/refresh/callback', gitRefreshCheck,
  (req, res, next) => {
    passport.authenticate('github-refresh', { session: false }, async (err, user, info) => {
      try {
        if (err || !user) {

          if (info && info.message === 'GitHub ID received not linked with account.') {
            return res.status(500).redirect('/error?error_details=Incorrect_GitHub_ID_Accessed');
          }
          if (info && info.message === 'Session not found for user.') {
            return res.status(404).redirect('/error?error_details=User_Not_Found');
          }

          return res.status(403).redirect('/api/user');
        }

        const repos_url = user._json.repos_url;
        const accessToken = user.accessToken;

        const response = await axios.get(repos_url, {
          headers: { Authorization: `token ${accessToken}` },
          params: { visibility: 'public', sort: 'updated', per_page: 100 },
        });

        const repoUrls = response.data.map((repo) => repo.html_url);

        const incompleteId = req.signedCookies.refresh;
        const incomplete = new mongoose.Types.ObjectId(incompleteId);

        await GHUser.findByIdAndUpdate(incomplete, { repos: repoUrls });

        res.clearCookie('refresh');

        return res.status(201).redirect('/query/create');
      } catch {
        res.status(500).redirect('/error?error_details=Unexpected_Error');
      }
    })(req, res, next);
  });

//temporary

UserRouter.get('/redeem', (req, res) => {
  return res.render('redeem.hbs');
});

module.exports = UserRouter;