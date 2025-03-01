const { GHUser } = require('../models/GHUser');
const { Block } = require('../models/Block');
const CryptoJS = require('crypto-js');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');

require('dotenv').config();

// const { v4: uuidv4 } = require('uuid');
// const { setUser } = require('../services/auth');

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { username, email, encryptedpassword, github_id } = req.body;

      const user = await GHUser.findOne({ $or: [{ username: username }, { 'email.address': email }, { 'github_id.id': github_id }] });
      const emailcheck2 = await Block.findOne({ $or: [{ 'email.address': email }, { 'github_id.id': github_id }] });

      if (emailcheck2 === null) {

        if (user === null) {
          const encrypted = CryptoJS.AES.encrypt(encryptedpassword, process.env.SECRET_KEY).toString();

          const trial2 = new GHUser({
            username: username,
            'email.address': email,
            'email.verified': false,
            password: encrypted,
            'github_id.id': github_id,
            'github_id.verified': false,
            role: 'User',
            verified: false
          });

          await trial2.save();

          const cookie = await GHUser.findOne({
            username: username,
            'email.address': email,
            'email.verified': false,
            password: encrypted,
            'github_id.id': github_id,
            'github_id.verified': false,
            role: 'User',
            verified: false
          });

          res.cookie('session', cookie._id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            sameSite: 'Lax'
          });

          return res.status(201).redirect('/auth/github');
        } else {
          return res.status(403).redirect('/error?error_details=Username_or_Email_or_GitHub_ID_Already_Taken');
        }
      } else {
        return res.status(403).redirect('/error?error_details=Blocked_Email_or_GitHub_ID');
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const login = async (req, res) => {
  try {
    const error = validationResult(req);
    if (error.isEmpty()) {
      const { username, encryptedpassword, remember } = req.body;

      const user = await GHUser.findOne({ username: username });

      if (user === null) {
        return res.status(404).redirect('/error?error_details=Please_Register');
      } else {
        const decrypted = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);

        if (encryptedpassword !== decrypted) {
          return res.status(401).redirect('/error?error_details=Incorrect_Password');
        } else {

          if (user.verified) {
            req.session.userId = user._id;

            if (remember) {
              req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
            }

            return res.status(200).redirect('/api/user');
          }
          if (!user.github_id.verified) {
            res.cookie('session', user._id, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              signed: true,
              sameSite: 'Lax'
            });

            return res.status(201).redirect('/auth/github');
          }
        }
      }
    }
    return res.send('Oops! Error Occurred...');
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const load = async (req, res) => {
  try {
    if (ObjectId.isValid(req.user._id)) {
      const user = await GHUser.findOne({ '_id': req.user._id });
      if (user && user.role === 'User') {
        res.status(200).render('main.hbs', {
          layout: 'user.hbs',
          username: user.username,
          email: user.email.address,
          github_id: user.github_id.id
        });
      } else {
        if (user && user.role === 'Admin') {
          return res.status(403).redirect('/admin/home');
        } else {
          return res.status(403).redirect('/home/logout');
        }
      }
    } else {
      return res.status(400).redirect('/error?error_details=Invalid_URL');
    }
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

module.exports = { login, register, load };