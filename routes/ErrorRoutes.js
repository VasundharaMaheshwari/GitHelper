const express =  require('express')
const ErrorRouter = express.Router()
const { error } = require('../controllers/ErrorController')
const { ErrorCheck } = require('../validators/ErrorValidators')

ErrorRouter.get('/',ErrorCheck,error)

module.exports = ErrorRouter