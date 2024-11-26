const { body, param } = require('express-validator');

const registerCheck = [body('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/),
  body('email').trim().notEmpty().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  body('encryptedpassword').trim().notEmpty().matches(/^[a-fA-F0-9]{64}$/),
  body('github_id').trim().notEmpty().matches(/^[a-zA-Z0-9-]{1,39}$/)];

const loginCheck = [body('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/),
  body('encryptedpassword').trim().notEmpty().matches(/^[a-fA-F0-9]{64}$/)];

const forgotCheck = [body('email').trim().notEmpty().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)];

const userCheck = [param('id').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/)];

const resetCheck = [param('id').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/),
  body('encryptedpassword').trim().notEmpty().matches(/^[a-fA-F0-9]{64}$/),
  body('otp').trim().notEmpty().matches(/^\d{4}$/)
];

module.exports = { registerCheck, loginCheck, forgotCheck, userCheck, resetCheck };