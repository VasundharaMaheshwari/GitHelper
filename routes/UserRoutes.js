const express = require('express')
const UserRouter = express.Router()
const { login,register,load } = require('../controllers/UserController')
const { restrict,loggedIn } = require('../middlewares/middleware')
const { register_limit,login_limit } = require('../middlewares/rate_limiter')

UserRouter.post('/login',loggedIn,login_limit,login)

UserRouter.post('/register',loggedIn,register_limit,register)

UserRouter.get('/login',loggedIn,(req,res) => {
    return res.status(302).render('login.hbs')
})

UserRouter.get('/register',loggedIn,(req,res) => {
    return res.status(302).render('register.hbs')
})

UserRouter.get('/user',restrict,load)

module.exports = UserRouter