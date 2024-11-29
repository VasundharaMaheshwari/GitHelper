const { Schema, default: mongoose } = require('mongoose');

const GHUser_Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['User', 'Admin'],
    default: 'User'
  },
  github_id: {
    type: String,
    required: true,
    unique: true
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  }
},
{ timestamps: true });

const GHUser = mongoose.model('GHUser', GHUser_Schema);
module.exports = { GHUser };