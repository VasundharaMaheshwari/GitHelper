const express = require('express')
const { chatload,chatlist, chatting } = require('../controllers/ChatController')
const { checkchat, checkchat2 } = require('../validators/ChatValidators')
const { convo_limit } = require('../middlewares/rate_limiter')

const ChatRouter = express.Router()

ChatRouter.post('/start',checkchat2,convo_limit,chatload)

ChatRouter.get('/list',chatlist)

ChatRouter.get('/chats',checkchat,chatting)

ChatRouter.post('/chats',(req,res) => {
    return res.status(200).send("Developing... Update deleting convos and messages when deleting issues now... Implement middleware to see if first approval or not then redirect to chats... See ongoing responses and closing responses == delete convo and messages from either side and vice versa if initiator... Pre load history etc.")
})

module.exports = ChatRouter