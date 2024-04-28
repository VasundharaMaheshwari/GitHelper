const { Schema, default: mongoose } = require('mongoose')

const GHUser_Schema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String
    }
})

const GHUser = mongoose.model('GHUser', GHUser_Schema)
module.exports = { GHUser }