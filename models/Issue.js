const { Schema, default: mongoose } = require('mongoose')

const Issue_Schema = new Schema({
    username: {
        type: String
    },
    contact_info: {
        type: Number
    },
    skillset: {
        type: String
    },
    github_id: {
        type: String
    },
    repo_link: {
        type: String
    },
    description: {
        type: String
    }
})

const Issue = mongoose.model('Issue',Issue_Schema)

module.exports = { Issue }