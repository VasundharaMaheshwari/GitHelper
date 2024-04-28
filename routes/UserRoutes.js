const express = require('express')
const UserRouter = express.Router()
const { login,register } = require('../controllers/UserController')

UserRouter.post('/login', login)

UserRouter.post('/register', register)

UserRouter.get('/login',(req,res) => {
    res.render('login.hbs')
})

UserRouter.get('/register',(req,res) => {
    res.render('register.hbs')
})

module.exports = UserRouter