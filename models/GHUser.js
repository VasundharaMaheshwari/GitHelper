const { Schema, default: mongoose } = require('mongoose');

const GHUser_Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    address: {
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
    id: {
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
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  repos: {
    type: [String],
    default: []
  },
  total_points: {
    type: Number,
    required: true,
    default: 0
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  }
},
{ timestamps: true });

const GHUser = mongoose.model('GHUser', GHUser_Schema);
module.exports = { GHUser };