const { query } = require('express-validator')

const ErrorCheck = query(error_details).trim().notEmpty().escape().withMessage('Invalid Input')

module.exports = { ErrorCheck }