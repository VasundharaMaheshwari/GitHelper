const { Schema, default: mongoose } = require('mongoose');

const Msg_Schema = new Schema({
  'convoId': {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Convo'
  },
  'receiver': {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'GHUser'
  },
  'msg': {
    type: String,
    required: true
  },
  'sender': {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'GHUser'
  }
},
{ timestamps: true });

const Msg = mongoose.model('Msg', Msg_Schema);

module.exports = { Msg };