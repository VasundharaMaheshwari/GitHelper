const { generate } = require('otp-generator');
const { GHUser } = require('../models/GHUser');
const { OTP } = require('../models/OTP');
const { validationResult } = require('express-validator');
const { mailGen, transporter } = require('../services/mail');
const { ObjectId } = require('mongodb');
const CryptoJS = require('crypto-js');

const otpGen = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { email } = req.body;
      const check_mail = await GHUser.findOne({ 'email.address': email });
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

        return res.status(200).redirect(`/api/reset-password/${check_mail._id}`);
      } else {
        return res.status(404).redirect('/error?error_details=User_Not_Found');
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const reset = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const { id } = req.params;

      if (ObjectId.isValid(id)) {
        const user = await GHUser.findById(id);
        const otp = await OTP.findOne({ email: user?.email.address });

        if (user && otp) {
          return res.status(302).render('main.hbs', {
            layout: 'reset.hbs',
            id: id
          });
        } else {
          return res.status(403).redirect('/api/login');
        }
      } else {
        return res.status(400).redirect('/error?error_details=Invalid_URL');
      }
    }

    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const passChange = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const { id } = req.params;

      if (ObjectId.isValid(id)) {
        const user = await GHUser.findById(id);
        if (user) {
          const otpc = await OTP.findOne({ email: user.email.address });
          if (otpc) {
            const { encryptedpassword, otp } = req.body;
            if (otpc.otp === Number(otp)) {
              const decrypted = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
              const otpDel = await OTP.deleteOne({ email: user.email.address, otp: otpc.otp });
              if (encryptedpassword !== decrypted) {
                const encrypted = CryptoJS.AES.encrypt(encryptedpassword, process.env.SECRET_KEY).toString();
                const passChange = await GHUser.findByIdAndUpdate(id, { password: encrypted });
                if (passChange && otpDel) {
                  return res.status(201).redirect('/api/login');
                } else {
                  return res.status(403).redirect('/error?error_details=Unable_To_Reset_Password');
                }
              } else {
                return res.status(400).redirect('/error?error_details=New_Password_Cannot_Be_Same_As_Old_Password');
              }
            } else {
              return res.status(400).redirect('/error?error_details=Invalid_OTP');
            }
          } else {
            return res.status(403).redirect('/api/login');
          }
        } else {
          return res.status(404).redirect('/error?error_details=User_Not_Found');
        }
      } else {
        return res.status(400).redirect('/error?error_details=Invalid_URL');
      }
    }

    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

module.exports = { otpGen, reset, passChange };