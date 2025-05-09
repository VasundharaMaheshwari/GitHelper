const { query, body, param } = require('express-validator');

const ErrorCheck = query('error_details')
  .trim()
  .notEmpty()
  .matches(/^[A-Za-z_/,:%0-9 ]+$/);

const msgCheck = [body('name').trim().notEmpty().matches(/^[A-Za-z]+(?: [A-Za-z]+){0,2}$/),
  body('email').trim().notEmpty().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  body('message').trim().notEmpty().matches(/^[A-Za-z0-9\s.,!?']*$/)
];

const profileCheck = param('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/);

module.exports = { ErrorCheck, msgCheck, profileCheck };