const { query, body } = require('express-validator');

const idcheck = query('_id').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/);

const reportidcheck = body('reportId').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/);

module.exports = { idcheck, reportidcheck };