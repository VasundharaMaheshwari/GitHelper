const { Schema, default: mongoose } = require('mongoose')

const User_Schema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
})

const User = mongoose.model('User', User_Schema)
module.exports = { User }