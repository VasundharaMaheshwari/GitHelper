const { Schema, default: mongoose } = require('mongoose')

const Issue_Schema = new Schema({
    username: {
        type: String,
        required: true
    },
    contact_info: {
        type: Number,
        required: true
    },
    skillset: {
        type: String
    },
    github_id: {
        type: String
    },
    repo_link: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GHUsers',
        required: true
    }
}, {timestamps: true})

const Issue = mongoose.model('Issue',Issue_Schema)

module.exports = { Issue }