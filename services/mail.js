const nodemailer = require('nodemailer');
const mailgen = require('mailgen');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const mailGen = new mailgen({
  theme: 'default',
  product: {
    name: 'GitHelper',
    link: 'https://githelper-r4a0.onrender.com'
  }
});

const response = {
  body: {
    name: 'User',
    intro: 'Thank you for reaching out! We have received your query and will get back to you shortly.',
    outro: 'Best regards,\nGitHelper'
  }
};

const emessage = mailGen.generate(response);

module.exports = { transporter, emessage };