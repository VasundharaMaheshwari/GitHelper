const express = require('express')
const UserRouter = express.Router()
const { login,register,load } = require('../controllers/UserController')
const { restrict,loggedIn } = require('../middlewares/middleware')

UserRouter.post('/login',loggedIn,login)

UserRouter.post('/register',loggedIn,register)

UserRouter.get('/login',loggedIn,(req,res) => {
    return res.render('login.hbs')
})

UserRouter.get('/register',loggedIn,(req,res) => {
    return res.render('register.hbs')
})

UserRouter.get('/user',restrict,load)

module.exports = UserRouter