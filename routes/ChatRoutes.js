const express = require('express')
const { chatload,chatlist, chatting } = require('../controllers/ChatController')
const { checkchat, checkchat2 } = require('../validators/ChatValidators')
const { convo_limit } = require('../middlewares/rate_limiter')
const { chat_check } = require('../middlewares/middleware')

const ChatRouter = express.Router()

ChatRouter.post('/start',checkchat2,convo_limit,chatload)

ChatRouter.get('/list',chatlist)

ChatRouter.get('/chats',checkchat,chat_check,chatting)

ChatRouter.post('/chats',(req,res) => {
    return res.status(200).send("Forgot password... Response deleted Register Inbuilt... Chat Input Santiation + Rate Limit... Task Tracking... Admin delete when browsing bug... Check if socket mapping + error handling... See ongoing responses and closing responses == delete convo and messages from either side and vice versa if initiator...")
})

module.exports = ChatRouter