const { query, body } = require('express-validator');

const checkchat = [query('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/)];

const checkchat2 = [body('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/),
  body('response').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/),
  body('deadline')
    .trim()
    .notEmpty()
    .matches(/^\d{4}-\d{2}-\d{2}$/)];

const checkReports = [body('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/),
  body('violation').trim().notEmpty().isIn([
    'impersonation',
    'spam',
    'self-harm',
    'illegal',
    'adult',
    'hate',
    'harassment',
    'violence',
    'scam',
    'misinformation',
    'privacy'
  ]), body('description').trim().notEmpty().matches(/^[a-zA-Z0-9.,!?;:\s]+$/),
  body('secure_url').trim().notEmpty().matches(/^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9_-]+\/image\/upload\/v[0-9]+\/[a-zA-Z0-9]+\/?[a-zA-Z0-9_-]*\.(jpg|jpeg|png|webp|gif|avif)$/)
];

module.exports = { checkchat, checkchat2, checkReports };