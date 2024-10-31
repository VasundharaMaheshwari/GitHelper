const { Schema, default: mongoose } = require('mongoose');

const Contact_Schema = new Schema({
  'name': {
    type: String,
    required: true,
  },
  'email': {
    type: String,
    required: true,
  },
  'message': {
    type: String,
    required: true,
  }
},
{ timestamps: true });

const Contact = mongoose.model('Contact', Contact_Schema);

module.exports = { Contact };