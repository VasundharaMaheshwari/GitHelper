const { query } = require('express-validator')

const ErrorCheck = query('error_details')
  .trim()
  .notEmpty()
  .matches(/^[A-Za-z_\/,:%0-9 ]+$/)

module.exports = { ErrorCheck }