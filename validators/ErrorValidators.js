const { query } = require('express-validator');

const ErrorCheck = query('error_details')
  .trim()
  .notEmpty()
  .matches(/^[A-Za-z_]+$/)
  .withMessage('Invalid Input: Only alphabets and underscores are allowed.');

module.exports = { ErrorCheck };