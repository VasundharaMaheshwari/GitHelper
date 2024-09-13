const express = require('express')
const { chatload } = require('../controllers/ChatController')

const ChatRouter = express.Router()

ChatRouter.get('/', chatload)

module.exports = ChatRouter