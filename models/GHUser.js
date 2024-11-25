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
    enum: ['User', 'Admin']
  },
  github_id: {
    type: String,
    required: true,
    unique: true
  }
},
{ timestamps: true });

const GHUser = mongoose.model('GHUser', GHUser_Schema);
module.exports = { GHUser };