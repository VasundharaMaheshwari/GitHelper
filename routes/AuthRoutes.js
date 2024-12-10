const express = require('express');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const { GHUser } = require('../models/GHUser');
const AuthRouter = express.Router();

AuthRouter.get('/github',
  passport.authenticate('github', { scope: ['public_repo'], session: false }));

AuthRouter.get(
  '/github/callback',
  (req, res, next) => {
    passport.authenticate('github', { session: false }, async (err, user, info) => {
      try {
        if (err || !user) {
          if (req.signedCookies.session) {
            const incompleteId = req.signedCookies.session;
            const incomplete = new mongoose.Types.ObjectId(incompleteId);

            const foundUser = await GHUser.findById(incomplete);
            if (foundUser) {
              await GHUser.findByIdAndDelete(incomplete);
            }

            res.clearCookie('session');
          }

          if (info && info.message === 'GitHub ID already taken.') {
            return res.redirect('/error?error_details=GitHub_ID_Is_Already_In_Use');
          }
          if (info && (info.message === 'Incomplete user not found.' || info.message === 'Session not found for user.')) {
            return res.redirect('/error?error_details=Error_Occurred_During_Registration_Please_Retry');
          }

          return res.redirect('/api/register');
        }
        if (req.signedCookies.session) {
          res.clearCookie('session');
        }

        return res.redirect('/auth/email-verify');
      } catch {
        res.redirect('/error?error_details=Unexpected_Error');
      }
    })(req, res, next);
  }
);

AuthRouter.get('/email-verify', (req, res) => {
  return res.send('WIP');
});

module.exports = AuthRouter;