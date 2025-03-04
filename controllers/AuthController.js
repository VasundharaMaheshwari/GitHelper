const { default: mongoose } = require('mongoose');
const { GHUser } = require('../models/GHUser');
const { generate } = require('otp-generator');
const { mailGen, transporter } = require('../services/mail');
const { VerifyOTP } = require('../models/VerifyOTP');

const otpSend = async (req, res) => {
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

      return res.status(201).redirect('/auth/email-otp');

    } else {
      return res.status(404).redirect('/error?error_details=User_Not_Found');
    }
  } catch {
    res.status(500).redirect('/error?error_details=Unexpected_Error');
  }
};

const otpVerified = async (req, res) => {
  try {
    const user = await GHUser.findById(new mongoose.Types.ObjectId(req.signedCookies.verify));
    if (user) {
      const otpc = await VerifyOTP.findOne({ email: user.email.address });
      if (otpc) {
        const { otp } = req.body;
        if (otpc.otp === Number(otp)) {
          const verified = await GHUser.findByIdAndUpdate(new mongoose.Types.ObjectId(req.signedCookies.verify), { 'email.verified': true });
          const otpDel = await VerifyOTP.deleteOne({ email: user.email.address, otp: otpc.otp });
          if (verified && otpDel && user.github_id.verified) {
            await GHUser.findByIdAndUpdate(new mongoose.Types.ObjectId(req.signedCookies.verify), { 'verified': true });
          }
          return res.status(201).redirect('/auth/github');
        } else {
          return res.status(400).redirect('/error?error_details=Invalid_OTP');
        }
      } else {
        return res.status(403).redirect('/api/login');
      }
    } else {
      return res.status(404).redirect('/error?error_details=User_Not_Found');
    }
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

module.exports = { otpSend, otpVerified };