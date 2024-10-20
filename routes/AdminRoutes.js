const { loader,deleter,userlist,usermod,viewer,detailsBan } = require('../controllers/AdminController')
const express = require('express')
const { idcheck } = require('../validators/AdminValidators')

const AdminRouter = express.Router()

AdminRouter.get('/', detailsBan)

AdminRouter.get('/home', loader)

AdminRouter.get('/delete', idcheck, deleter)

AdminRouter.get('/userlist', userlist)

AdminRouter.get('/delete-user', idcheck, usermod)

AdminRouter.get('/view',idcheck, viewer)

module.exports = AdminRouter