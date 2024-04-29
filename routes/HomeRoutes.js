const express = require('express')
const HomeRouter = express.Router()
const { refresh,details } = require('../controllers/HomeController')

HomeRouter.get('/',refresh)

HomeRouter.get('/view',details)

module.exports = HomeRouter