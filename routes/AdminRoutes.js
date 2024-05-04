const { loader } = require('../controllers/AdminController')
const express = require('express')
const AdminRouter = express.Router()

AdminRouter.get('/', (req,res) => {
        return res.render('admin.hbs')})

AdminRouter.get('/home', loader)

module.exports = AdminRouter