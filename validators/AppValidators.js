const { body } = require('express-validator')

const saveIssue = [body('contact_info').trim().notEmpty().matches()]