const { query, body } = require('express-validator');

const checkchat = [query('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/)];

const checkchat2 = [body('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/),
  body('response').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/),
  body('deadline')
    .trim()
    .notEmpty()
    .matches(/^\d{4}-\d{2}-\d{2}$/)];

module.exports = { checkchat, checkchat2 };