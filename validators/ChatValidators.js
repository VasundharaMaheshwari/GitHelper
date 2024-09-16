const { query } = require('express-validator')

const checkchat = [query('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/),
    query('queryId').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/),
    query('resId').trim().notEmpty().matches(/^[a-fA-F0-9]{24}$/)
]

module.exports = { checkchat }