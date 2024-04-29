const express = require('express')
const HomeRouter = express.Router()
const { refresh } = require('../controllers/HomeController')

HomeRouter.get('/',refresh)

module.exports = HomeRouter