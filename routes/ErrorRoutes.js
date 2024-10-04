const express =  require('express')
const ErrorRouter = express.Router()
const { error, contactus } = require('../controllers/ErrorController')
const { ErrorCheck } = require('../validators/ErrorValidators')

ErrorRouter.get('/',ErrorCheck,error)

ErrorRouter.get('/faq',(req,res) => {
    return res.status(200).render('main.hbs', {
        layout: 'faq.hbs'
      })
})

ErrorRouter.get('/terms',(req,res) => {
  return res.status(200).render('main.hbs', {
      layout: 'tandc.hbs'
    })
})

ErrorRouter.get('/privacy',(req,res) => {
  return res.status(200).render('main.hbs', {
      layout: 'privacypolic.hbs'
    })
})

ErrorRouter.get('/contact',(req,res) => {
  return res.status(200).render('main.hbs', {
      layout: 'contactus.hbs'
    })
})

ErrorRouter.post('/send',contactus)

module.exports = ErrorRouter