const { query } = require('express-validator')

const checkchat = query('username').trim().notEmpty().matches(/^[a-zA-Z0-9_]+$/)

module.exports = { checkchat }