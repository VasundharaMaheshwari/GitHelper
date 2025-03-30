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
  return res.status(200).send('Dynamic loading for much content... Add input size validation everywhere...');
});

ChatRouter.get('/editProfile', (req, res) => {
  try {
    return res.status(200).render('main.hbs', {
      layout: 'profile_edit.hbs',
      username: req.user.username,
      githubId: req.user.github_id.id,
      emailAddress: req.user.email.address
    });
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
});

module.exports = ChatRouter;