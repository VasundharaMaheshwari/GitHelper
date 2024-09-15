const express = require('express')
const { chatload,chatlist } = require('../controllers/ChatController')
const { checkchat } = require('../validators/ChatValidators')
const { Convo } = require('../models/Convo')

const ChatRouter = express.Router()

ChatRouter.get('/start',checkchat,chatload)

ChatRouter.get('/list',chatlist)


module.exports = ChatRouter