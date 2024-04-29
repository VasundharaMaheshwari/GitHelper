const express = require('express')
const HomeRouter = express.Router()
const { refresh } = require('../controllers/HomeController')

HomeRouter.get('/',refresh)

HomeRouter.get('/view',(req,res) => {
    return res.send('Success')
})

module.exports = HomeRouter