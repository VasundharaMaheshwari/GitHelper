const { query } = require('express-validator');

const idcheck = query('_id').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/);

module.exports = { idcheck };