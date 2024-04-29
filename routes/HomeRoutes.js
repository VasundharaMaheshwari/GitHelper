const express = require('express')
const HomeRouter = express.Router()
const { refresh,details,response } = require('../controllers/HomeController')

HomeRouter.get('/',refresh)

HomeRouter.get('/view',details)

HomeRouter.get('/response',response)

module.exports = HomeRouter