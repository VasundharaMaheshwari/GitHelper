const express = require('express')
const HomeRouter = express.Router()
const { refresh,details,logout } = require('../controllers/HomeController')

HomeRouter.get('/',refresh)

HomeRouter.get('/view',details)

HomeRouter.get('/logout',logout)

module.exports = HomeRouter