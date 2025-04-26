const { Schema, default: mongoose } = require('mongoose');

const Wallet_Schema = new Schema({
  'walletAddress': {
    type: String,
    required: true,
    unique: true
  },
  'userID': {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'GHUser'
  }
},
{ timestamps: true });

const Wallet = mongoose.model('Wallet', Wallet_Schema);

module.exports = { Wallet };