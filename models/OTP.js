const { Schema, default: mongoose } = require('mongoose');
const { GHUser } = require('./GHUser');

const OTP_Schema = new Schema({
  'email': {
    type: String,
    required: true,
    ref: GHUser
  },
  'otp': {
    type: Number,
    required: true,
    max: 9999,
    min: 1000
  }
},
{ timestamps: true });

const OTP = mongoose.model('OTP', OTP_Schema);

module.exports = { OTP };