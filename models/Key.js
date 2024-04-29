const { Schema, default: mongoose } = require('mongoose')

const KeySchema = new Schema({
    identifier: {
        type: String,
        required: true,
        unique: true
    },
    key: {
        type: String,
        required: true,
        unique: true
    }
})

const Key = mongoose.model('Key',KeySchema)

module.exports = { Key }