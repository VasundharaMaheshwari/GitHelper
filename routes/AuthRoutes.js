const express = require('express');
const passport = require('passport');
const AuthRouter = express.Router();

AuthRouter.get('/github',
  passport.authenticate('github', { scope: ['user:email', 'public_repo'], session: false }));

AuthRouter.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/api/register', session: false }),
  function (req, res) {
    res.clearCookie('session');
    res.redirect('/auth/email-verify');
  });

AuthRouter.get('/email-verify', (req, res) => {
  return res.send('WIP');
});

module.exports = AuthRouter;