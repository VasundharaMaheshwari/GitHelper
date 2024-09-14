const express = require('express')
const { chatload } = require('../controllers/ChatController')
const { checkchat } = require('../validators/ChatValidators')

const ChatRouter = express.Router()

ChatRouter.get('/start',checkchat,chatload)

module.exports = ChatRouter