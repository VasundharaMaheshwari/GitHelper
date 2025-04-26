const express = require('express');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const { GHUser } = require('../models/GHUser');
const axios = require('axios');
const { gitCheck, mailCheck } = require('../middlewares/middleware');
const { verifyCheck } = require('../validators/AuthValidators');
const { otpSend, otpVerified } = require('../controllers/AuthController');

const AuthRouter = express.Router();

AuthRouter.get('/github', gitCheck,
  passport.authenticate('github', { scope: ['public_repo'], session: false }));

AuthRouter.get(
  '/github/callback', gitCheck,
  (req, res, next) => {
    passport.authenticate('github', { session: false }, async (err, user, info) => {
      try {
        if (err || !user) {
          if (req.signedCookies.verify) {
            // const incompleteId = req.signedCookies.verify;
            // const incomplete = new mongoose.Types.ObjectId(incompleteId);

            // const foundUser = await GHUser.findById(incomplete);
            // if (foundUser) {
            //   await GHUser.findByIdAndDelete(incomplete);
            // }

            res.clearCookie('verify');
          }

          if (info && info.message === 'GitHub ID received not linked with account.') {
            return res.status(500).redirect('/error?error_details=GitHub_ID_Is_Incorrect_Please_Login_To_Complete_Verification');
          }
          if (info && (info.message === 'Incomplete user not found.' || info.message === 'Session not found for user.')) {
            return res.status(404).redirect('/error?error_details=User_Not_Found_Please_Login_To_Complete_Verification');
          }

          return res.status(403).redirect('/api/register');
        }

        const repos_url = user._json.repos_url;
        const accessToken = user.accessToken;

        const response = await axios.get(repos_url, {
          headers: { Authorization: `token ${accessToken}` },
          params: { visibility: 'public', sort: 'updated', per_page: 100 },
        });

        const repoUrls = response.data.map((repo) => repo.html_url);

        const incompleteId = req.signedCookies.verify;
        const incomplete = new mongoose.Types.ObjectId(incompleteId);

        await GHUser.findByIdAndUpdate(incomplete, { repos: repoUrls });

        const verified = await GHUser.findById(incomplete);
        if (verified.github_id.verified && verified.email.verified) {
          await GHUser.findByIdAndUpdate(incomplete, {
            'verified': true,
          });
        }

        return res.status(201).redirect('/auth/email-verify');

      } catch {
        res.status(500).redirect('/error?error_details=Unexpected_Error');
      }
    })(req, res, next);
  }
);

AuthRouter.get('/email-verify', mailCheck, otpSend);

AuthRouter.get('/email-otp', mailCheck, async (req, res) => {
  return res.status(200).render('main.hbs', {
    layout: 'verify.hbs'
  });
});

AuthRouter.post('/email-verification', mailCheck, verifyCheck, otpVerified);

module.exports = AuthRouter;