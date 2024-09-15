const express = require('express')
const { chatload,chatlist } = require('../controllers/ChatController')
const { checkchat } = require('../validators/ChatValidators')

const ChatRouter = express.Router()

ChatRouter.get('/start',checkchat,chatload)

ChatRouter.get('/list',chatlist)

ChatRouter.get('/chats',(req,res) => {
    return res.status(200).send("Developing...")
})

module.exports = ChatRouter