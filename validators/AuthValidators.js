const { body } = require('express-validator');

const verifyCheck = [body('otp').trim().notEmpty().matches(/^\d{4}$/)];

module.exports = { verifyCheck };