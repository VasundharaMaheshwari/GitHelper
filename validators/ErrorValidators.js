const { query } = require('express-validator')

const ErrorCheck = query('error_details')
  .trim()
  .notEmpty()
  .matches(/^[A-Za-z_]+$/)

module.exports = { ErrorCheck }