const express =  require('express')
const ErrorRouter = express.Router()
const { error } = require('../controllers/ErrorController')
const { ErrorCheck } = require('../validators/ErrorValidators')

ErrorRouter.get('/',ErrorCheck,error)

ErrorRouter.get('/faq',(req,res) => {
    return res.status(200).render('main.hbs', {
        layout: 'faq.hbs'
      })
})

module.exports = ErrorRouter