const express =  require('express')
const ErrorRouter = express.Router()
const { error } = require('../controllers/ErrorController')

ErrorRouter.get('/',error)

module.exports = ErrorRouter