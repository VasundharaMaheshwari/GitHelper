const express = require('express')
const UserRouter = express.Router()
const { login,register,load } = require('../controllers/UserController')
const { admin } = require('../middlewares/auth')

UserRouter.post('/login', login)

UserRouter.post('/register', register)

UserRouter.get('/login',(req,res) => {
    res.render('login.hbs')
})

UserRouter.get('/register',(req,res) => {
    res.render('register.hbs')
})

UserRouter.get('/user',admin,load)

module.exports = UserRouter