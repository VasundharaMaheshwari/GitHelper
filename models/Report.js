const { Schema, default: mongoose } = require('mongoose');

const Report_Schema = new Schema({
  'createdBy': {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'GHUser'
  },
  'createdAgainst': {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'GHUser'
  },
  'proofUrl': {
    type: String,
    required: true
  },
  'type': {
    type: String,
    required: true,
  },
  'description': {
    type: String,
    required: true
  },
  closed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GHUser'
  }

},
{ timestamps: true });

const Report = mongoose.model('Report', Report_Schema);

module.exports = { Report };