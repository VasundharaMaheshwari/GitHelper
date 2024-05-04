const { loader,deleter } = require('../controllers/AdminController')
const express = require('express')
const AdminRouter = express.Router()

AdminRouter.get('/', (req,res) => {
        return res.render('admin.hbs')})

AdminRouter.get('/home', loader)

AdminRouter.get('/delete', deleter)

module.exports = AdminRouter