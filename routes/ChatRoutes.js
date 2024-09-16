const express = require('express')
const { chatload,chatlist } = require('../controllers/ChatController')
const { checkchat } = require('../validators/ChatValidators')
const { convo_limit } = require('../middlewares/rate_limiter')

const ChatRouter = express.Router()

ChatRouter.post('/start',checkchat,convo_limit,chatload)

ChatRouter.get('/list',chatlist)

ChatRouter.get('/chats',(req,res) => {
    return res.status(200).send("Developing... Need to delete convos and messages when deleting issues now... Implement middleware to see if first approval or not then redirect to chats... See ongoing responses and closing responses == delete convo and messages from either side and vice versa if initiator... Pre load history etc.")
})

module.exports = ChatRouter