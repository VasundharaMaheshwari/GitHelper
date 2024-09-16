const { ObjectId } = require('mongodb')
const { Response } = require('../models/Response')
const { validationResult } = require('express-validator')
const { Convo } = require('../models/Convo')
const { GHUser } = require('../models/GHUser')

const chatload = async (req,res) => {
    try{
        const error = validationResult(req)
        const checker2 = ObjectId.isValid(req.user._id)
        if(checker2 && error.isEmpty()){
            const checker = await Response.findOneAndUpdate({"responder.username": req.query.username, "issue": req.query.queryId, "creator": req.user._id},{"approved": true})
        if(checker && ObjectId.isValid(req.query.queryId)) {
          return res.status(400).redirect(`/chat/chats?username=${req.query.username}&queryId=${req.query.queryId}`)
} else {
    return res.status(400).redirect('/error?error_details=Invalid_URL')
}
        } else {
            return res.send("Oops! Error Occurred...")
        }
    } catch (err) {
        return res.status(500).redirect('/error?error_details=Error_Occurred')
    }
}


const chatlist = async (req, res) => {
    try {
        const checker2 = ObjectId.isValid(req.user._id)
        if(checker2){
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
          ? { username: convo.receiver.username, userId: convo.receiver._id, issue: convo.issue }
          : { username: convo.initiator.username, userId: convo.initiator._id, issue: convo.issue }
      })
  
      return res.status(200).render('main.hbs', {
        layout: 'chats_list.hbs',
        users: users
      })
    } else {
        return res.status(400).redirect('/error?error_details=Invalid_URL')
    }
    } catch (error) {
        return res.status(500).redirect('/error?error_details=Error_Occurred')
    }
  }

const chatting = async (req,res) => {
  try{
    if(ObjectId.isValid(req.user._id)){
    const receiver = await GHUser.findOne({ "username": req.query.username });
            if (!receiver) {
              return res.status(404).redirect('/error?error_details=Receiver_Not_Found');
            }
            const convo_check = await Convo.findOne({"initiator": req.user._id, "issue" : req.query.queryId, "receiver": receiver._id})
    if(convo_check == null){
    const convo_ = new Convo({
      initiator: req.user._id,
      issue: req.query.queryId,
      receiver: receiver._id
    })
    await convo_.save()
}
    return res.status(200).render('main.hbs',{layout: "chat.hbs",
        receiverUsername: req.query.username,
        userId: req.user._id
      }
    )
  }
  else {
    return res.status(400).redirect('/error?error_details=Invalid_URL')
  }
  } catch (err) {
    return res.status(500).redirect('/error?error_details=Error_Occurred')
  }
}

module.exports = { chatload,chatlist,chatting }