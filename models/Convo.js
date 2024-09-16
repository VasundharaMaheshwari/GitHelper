const { Schema, default: mongoose } = require('mongoose')

const Convo_Schema = new Schema({
    "issue": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Issue'
    },
    "initiator": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'GHUser'
    },
    "receiver": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'GHUser'
    },
    "response": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Response'
    }
},
{timestamps: true})

const Convo = mongoose.model('Convo',Convo_Schema)

module.exports = { Convo }