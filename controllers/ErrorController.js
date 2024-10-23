const { validationResult } = require('express-validator');
const { Contact } = require('../models/Contact');

const error = (req,res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()){
    const {error_details} = req.query;
    return res.status(200).render('main.hbs',{layout: 'error.hbs',
      error_message: error_details
    });}
  return res.send('Oops! Error Occurred...');
};

const contactus = async (req,res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()){
    const {name,email,message} = req.body;
    const contact = new Contact({
      name: name,
      email: email,
      message: message
    });

    await contact.save();
    return res.status(200).redirect('/home');}
  return res.send('Oops! Error Occurred...');
};

module.exports = { error,contactus };