const { query, body } = require('express-validator');

const ErrorCheck = query('error_details')
  .trim()
  .notEmpty()
  .matches(/^[A-Za-z_/,:%0-9 ]+$/);

const msgCheck = [body('name').trim().notEmpty().matches(/^[A-Za-z]+(?: [A-Za-z]+){0,2}$/),
  body('email').trim().notEmpty().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  body('message').trim().notEmpty().matches(/^[A-Za-z0-9\s.,!?']*$/)
];

module.exports = { ErrorCheck, msgCheck };