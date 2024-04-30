const express = require('express')
const AdminRouter = express.Router()

AdminRouter.get('/', (req,res) => {
        return res.render('admin.hbs')})

module.exports = AdminRouter