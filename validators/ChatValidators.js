const { query, body } = require('express-validator');

const checkchat = [query('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/)
];

const checkchat2 = [body('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/),
  body('response').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/)
];

module.exports = { checkchat, checkchat2 };