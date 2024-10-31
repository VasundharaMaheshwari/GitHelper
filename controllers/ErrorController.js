const { validationResult } = require('express-validator');
const { Contact } = require('../models/Contact');
const { transporter, emessage } = require('../services/mail');

const error = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { error_details } = req.query;
    return res.status(200).render('main.hbs', {
      layout: 'error.hbs',
      error_message: error_details
    });
  }
  return res.send('Oops! Error Occurred...');
};

const contactus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { name, email, message } = req.body;
      const contact = new Contact({
        name: name,
        email: email,
        message: message
      });

      await contact.save();

      const mailer = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Query Received!',
        html: emessage
      };

      await transporter.sendMail(mailer);
      return res.status(200).redirect('/home');
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

module.exports = { error, contactus };