const { Schema, default: mongoose } = require('mongoose');
const { GHUser } = require('./GHUser');

const Verify_Schema = new Schema({
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

const VerifyOTP = mongoose.model('VerifyOTP', Verify_Schema);

module.exports = { VerifyOTP };