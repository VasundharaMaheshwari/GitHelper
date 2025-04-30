const { Schema, default: mongoose } = require('mongoose');

const Response_Schema = new Schema({
  responder: {
    username: {
      type: String,
      required: true
    },
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'GHUsers'
    },
    github_id: {
      type: String,
      required: true
    }
  },
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Issues'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'GHUsers'
  },
  approved: {
    type: Boolean,
    required: true,
    default: false
  },
  status: {
    type: String,
    enum: ['Not Approved', 'To Do', 'Working', 'Completed', 'Accepted'],
    default: 'Not Approved'
  },
  extra: {
    type: Object
  },
  deadline: {
    type: Date,
    required: function () {
      return this.approved;
    }
  },
  statusUpdateTime: {
    type: Date,
    required: function () {
      return this.approved;
    }
  },
  assignedTime: {
    type: Date,
    required: function () {
      return this.approved;
    }
  }
}, { timestamps: true });

const Response = mongoose.model('Response', Response_Schema);

module.exports = { Response };