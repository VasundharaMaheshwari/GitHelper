const express = require('express');
const { chatload, chatlist, chatting, checkUsername, genUrls } = require('../controllers/ChatController');
const { checkchat, checkchat2 } = require('../validators/ChatValidators');
const { convo_limit } = require('../middlewares/rate_limiter');
const { chat_check } = require('../middlewares/middleware');
const { GHUser } = require('../models/GHUser');
const { Report } = require('../models/Report');
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

ChatRouter.post('/send', gen_url_ip, async (req, res) => {
  const { username, violation, description, secure_url } = req.body;

  if (!secure_url) {
    return res.status(400).redirect('/error?error_details=Secure_URL_Not_Found');
  }

  if (username === req.user.username) return res.status(400).redirect('/error?error_details=Cannot_Register_Report_Against_Self');


  const createdAgainst = await GHUser.findOne({ username });

  if (!createdAgainst) return res.status(400).redirect('/error?error_details=Offender_Not_Found');

  const report = new Report({
    createdAgainst: createdAgainst._id,
    createdBy: req.user._id,
    type: violation,
    description,
    proofUrl: secure_url
  });

  await report.save();

  res.status(201).json({ success: true, message: 'Report submitted successfully!' });
});

ChatRouter.get('/reports', (req, res) => {
  return res.status(200).render('main.hbs', {
    layout: 'reporting.hbs'
  });
});

ChatRouter.get('/check-username', checkchat, checkUsername);

module.exports = ChatRouter;