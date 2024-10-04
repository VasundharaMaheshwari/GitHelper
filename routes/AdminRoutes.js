const { loader,deleter,userlist,usermod,viewer } = require('../controllers/AdminController')
const express = require('express')
const { idcheck } = require('../validators/AdminValidators')

const AdminRouter = express.Router()

AdminRouter.get('/', (req,res) => {
        return res.status(200).render('main.hbs',{layout: "admin.hbs",
             username: req.user.username,
             email: req.user.email,
        })})

AdminRouter.get('/home', loader)

AdminRouter.get('/delete', idcheck, deleter)

AdminRouter.get('/userlist', userlist)

AdminRouter.get('/delete-user', idcheck, usermod)

AdminRouter.get('/view',idcheck, viewer)

module.exports = AdminRouter