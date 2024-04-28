const { Schema, default: mongoose } = require('mongoose')

const KeySchema = new Schema({
    identifier: {
        type: String
    },
    key: {
        type: String
    }
})

const Key = mongoose.model('Key',KeySchema)

module.exports = { Key }