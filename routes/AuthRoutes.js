const express = require('express');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const { GHUser } = require('../models/GHUser');
const axios = require('axios');
const { gitCheck, mailCheck } = require('../middlewares/middleware');
const { generate } = require('otp-generator');
const { mailGen, transporter } = require('../services/mail');
const { VerifyOTP } = require('../models/VerifyOTP');

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
            const incompleteId = req.signedCookies.verify;
            const incomplete = new mongoose.Types.ObjectId(incompleteId);

            const foundUser = await GHUser.findById(incomplete);
            if (foundUser) {
              await GHUser.findByIdAndDelete(incomplete);
            }

            res.clearCookie('verify');
          }

          if (info && info.message === 'GitHub ID already taken.') {
            return res.status(500).redirect('/error?error_details=GitHub_ID_Is_Already_In_Use');
          }
          if (info && (info.message === 'Incomplete user not found.' || info.message === 'Session not found for user.')) {
            return res.status(404).redirect('/error?error_details=User_Not_Found');
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

        return res.status(201).redirect('/auth/email-verify');

      } catch {
        res.status(500).redirect('/error?error_details=Unexpected_Error');
      }
    })(req, res, next);
  }
);

AuthRouter.get('/email-verify', mailCheck, async (req, res) => {
  try {
    const check_mail = await GHUser.findById(new mongoose.Types.ObjectId(req.signedCookies.verify));
    if (check_mail) {
      const otp = generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
      const forgot = {
        body: {
          name: 'User',
          intro: `Here is the OTP for verifying your email - ${otp}.`
        }
      };
      const forgotMsg = mailGen.generate(forgot);
      const mailer = {
        from: process.env.EMAIL,
        to: check_mail.email.address,
        subject: 'OTP for Verification.',
        html: forgotMsg
      };

      await transporter.sendMail(mailer);

      const otp_check = await VerifyOTP.findOne({ email: check_mail.email.address });

      if (!otp_check) {
        const OTP_save = new VerifyOTP({
          email: check_mail.email.address,
          otp: otp
        });

        await OTP_save.save();
      } else {
        await VerifyOTP.updateOne({ email: check_mail.email.address }, { otp: otp });
      }

      return res.status(200).render('main.hbs', {
        layout: 'verify.hbs'
      });
    } else {
      return res.status(404).redirect('/error?error_details=User_Not_Found');
    }
  } catch {
    res.status(500).redirect('/error?error_details=Unexpected_Error');
  }
});

AuthRouter.post('/email-verification', mailCheck, async (req, res) => {
  res.send('WIP');
});

module.exports = AuthRouter;