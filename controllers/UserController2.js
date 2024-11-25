const { generate } = require('otp-generator');
const { GHUser } = require('../models/GHUser');
const { OTP } = require('../models/OTP');
const { validationResult } = require('express-validator');
const { mailGen, transporter } = require('../services/mail');

const otpGen = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { email } = req.body;
      const check_mail = await GHUser.findOne({ 'email': email });
      if (check_mail && check_mail.role !== 'Admin') {
        const otp = generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        const forgot = {
          body: {
            name: 'User',
            intro: `Here is the OTP for resetting your password - ${otp}.`
          }
        };
        const forgotMsg = mailGen.generate(forgot);
        const mailer = {
          from: process.env.EMAIL,
          to: email,
          subject: 'OTP for resetting password.',
          html: forgotMsg
        };

        await transporter.sendMail(mailer);

        const otp_check = await OTP.findOne({ email: email });

        if (!otp_check) {
          const OTP_save = new OTP({
            email: email,
            otp: otp
          });

          await OTP_save.save();
        } else {
          await OTP.updateOne({ email: email }, { otp: otp });
        }

        return res.status(200).redirect(`/api/reset-password/${check_mail.username}`);
      } else {
        return res.status(404).redirect('/error?error_details=User_Not_Found');
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

module.exports = { otpGen };