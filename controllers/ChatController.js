const { ObjectId } = require('mongodb');
const { Response } = require('../models/Response');
const { validationResult } = require('express-validator');
const { Convo } = require('../models/Convo');
const { GHUser } = require('../models/GHUser');
const { Msg } = require('../models/Msg');

const chatload = async (req, res) => {
  try {
    const error = validationResult(req);
    const checker2 = ObjectId.isValid(req.user._id);
    if (checker2 && error.isEmpty()) {
      const { username, response, deadline } = req.body;
      const checker = await Response.findOneAndUpdate({ '_id': response, approved: false, status: 'Not Approved' }, { 'approved': true, 'status': 'To Do', 'deadline': deadline });
      if (checker) {
        return res.status(200).redirect(`/chat/chats?username=${username}`);
      } else {
        return res.status(400).redirect('/error?error_details=Invalid_URL');
      }
    } else {
      return res.send('Oops! Error Occurred...');
    }
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};


const chatlist = async (req, res) => {
  try {
    const checker2 = ObjectId.isValid(req.user._id);
    if (checker2) {
      const userId = req.user._id;

      const conversations = await Convo.find({
        $or: [
          { initiator: userId },
          { receiver: userId }
        ]
      })
        .populate('initiator', 'username _id')
        .populate('receiver', 'username _id');

      const users = conversations.map(convo => {
        return convo.initiator._id.equals(userId)
          ? { username: convo.receiver.username, userId: convo.receiver._id, response: convo.response }
          : { username: convo.initiator.username, userId: convo.initiator._id, response: convo.response };
      });

      return res.status(200).render('main.hbs', {
        layout: 'chats_list.hbs',
        users: users
      });
    } else {
      return res.status(400).redirect('/error?error_details=Invalid_URL');
    }
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const chatting = async (req, res) => {
  try {
    if (ObjectId.isValid(req.user._id)) {
      const { username } = req.query;
      const receiver = await GHUser.findOne({ 'username': username });
      if (!receiver || receiver._id.toString() === req.user._id.toString()) {
        return res.status(404).redirect('/error?error_details=Receiver_Not_Found');
      }
      const response_check = await Response.findOne({ $or: [{ 'responder.uid': receiver._id }, { 'creator': receiver._id }] });
      if (!response_check) {
        return res.status(404).redirect('/error?error_details=Response_Not_Found');
      }
      const convo_check = await Convo.findOne({ $or: [{ 'initiator': receiver._id }, { 'receiver': receiver._id }] });
      if (convo_check === null) {
        const convo_ = new Convo({
          initiator: req.user._id,
          receiver: receiver._id
        });
        await convo_.save();
      }

      const convo = await Convo.findOne({ $or: [{ 'initiator': receiver._id }, { 'receiver': receiver._id }] });

      const msg = await Msg.find({ convoId: convo._id }).sort({ createdAt: 1 });

      const xForwardedFor = req.headers['x-forwarded-for'];
      let ip;
      if (xForwardedFor) {
        ip = xForwardedFor.split(',')[0].trim();
      } else {
        ip = req.ip;
      }

      return res.status(200).render('main.hbs', {
        layout: 'chat.hbs',
        receiverUsername: username,
        receiverUserId: receiver._id,
        senderUserId: req.user._id,
        convoId: convo._id,
        messages: msg,
        ip: ip
      }
      );
    }
    else {
      return res.status(400).redirect('/error?error_details=Invalid_URL');
    }
  } catch {
    return res.status(500).redirect('/error?error_details=Error_Occurred');
  }
};

const checkUsername = async (req, res) => {
  try {
    const error = validationResult(req);
    if (error.isEmpty()) {
      const { username } = req.query;

      if (username === req.user.username) return res.status(400).json({ valid: false });

      const createdAgainst = await GHUser.findOne({ username });

      if (!createdAgainst) return res.status(400).json({ valid: false });

      if (createdAgainst.role !== 'User') return res.status(400).json({ valid: false });

      return res.status(201).json({ valid: true });
    }
    return res.status(400).json({ valid: false, message: 'Validation Check Failed' });
  } catch {
    return res.status(500).json({ valid: false, message: 'Internal Server Error' });
  }
};

module.exports = { chatload, chatlist, chatting, checkUsername };