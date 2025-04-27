const express = require('express');
const { chatload, chatlist, chatting, checkUsername, genUrls, reportSave } = require('../controllers/ChatController');
const { checkchat, checkchat2, checkReports } = require('../validators/ChatValidators');
const { convo_limit } = require('../middlewares/rate_limiter');
const { chat_check } = require('../middlewares/middleware');
const { gen_url_ip } = require('../middlewares/rate_limiter2');

require('dotenv').config();

const ChatRouter = express.Router();

ChatRouter.post('/start', checkchat2, convo_limit, chatload);

ChatRouter.get('/list', chatlist);

ChatRouter.get('/chats', checkchat, chat_check, chatting);

ChatRouter.post('/chats', (req, res) => {
  return res.status(200).send('Dynamic loading for much content... Add input size validation everywhere... Allow cancellation of work till 3 times then ban');
});

ChatRouter.get('/generate-signed-url', gen_url_ip, genUrls);

ChatRouter.post('/send', checkReports, gen_url_ip, reportSave);

ChatRouter.get('/reports', (req, res) => {
  return res.status(200).render('main.hbs', {
    layout: 'reporting.hbs'
  });
});

ChatRouter.get('/check-username', checkchat, checkUsername);

module.exports = ChatRouter;