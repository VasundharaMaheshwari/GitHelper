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

UserRouter.get('/user',(req,res) => {
    const {username,email} = req.query
    res.render('main.hbs',{layout: "user.hbs",
    username: username,
    email: email
    })
})

module.exports = UserRouter