const express = require('express');
const { chatload, chatlist, chatting } = require('../controllers/ChatController');
const { checkchat, checkchat2 } = require('../validators/ChatValidators');
const { convo_limit } = require('../middlewares/rate_limiter');
const { chat_check } = require('../middlewares/middleware');

const ChatRouter = express.Router();

ChatRouter.post('/start', checkchat2, convo_limit, chatload);

ChatRouter.get('/list', chatlist);

ChatRouter.get('/chats', checkchat, chat_check, chatting);

ChatRouter.post('/chats', (req, res) => {
  return res.status(200).send('Rate limit for forgot password and not same as old pass... Dynamic loading for much content... Add input size validation everywhere... Task Tracking... See ongoing responses and closing responses == delete convo and messages from either side and vice versa if initiator...');
});

module.exports = ChatRouter;