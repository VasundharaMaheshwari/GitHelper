const express = require('express')
const { chatload } = require('../controllers/ChatController')
const { checkchat } = require('../validators/ChatValidators')

const ChatRouter = express.Router()

ChatRouter.get('/',checkchat,chatload)

module.exports = ChatRouter