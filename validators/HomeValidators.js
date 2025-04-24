const { query, body } = require('express-validator');

const homecheck = query('_id').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/);

const searchcheck = body('searchTerm').trim().notEmpty().matches(/^[a-zA-Z0-9,.\s]+$/);

module.exports = { homecheck, searchcheck };