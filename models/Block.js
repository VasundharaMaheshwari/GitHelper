const { Schema, default: mongoose } = require('mongoose');

const Block_Schema = new Schema({
  'email': {
    type: String,
    required: true,
    unique: true
  },
  'github_id': {
    type: String,
    required: true,
    unique: true
  }
},
{ timestamps: true });

const Block = mongoose.model('Block', Block_Schema);

module.exports = { Block };