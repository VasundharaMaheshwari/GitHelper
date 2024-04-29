const {Schema, default: mongoose} = require('mongoose')

const Response_Schema = new Schema({
    r_username: {
        type: String,
        required: true
    },
    r_contact_info: {
        type: Number,
        required: true
    },
    r_description: {
        type: String
    },
    r_github_id: {
        type: String
    }
},{timestamps: true})

const Response = mongoose.model('Response',Response_Schema)

module.exports = { Response }