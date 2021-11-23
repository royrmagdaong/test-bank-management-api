const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomSchema = Schema({
    index: {
        type: Number,
        required: true
    },
    room:{
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at:{
        type: Date,
        default: null
    },
    deleted_at:{
        type: Date,
        default: null
    }
})

module.exports = mongoose.model('Room', roomSchema)