const mongoose = require('mongoose')
const Schema = mongoose.Schema

const classSchema = Schema({
    index: {
        type: Number,
        required: true
    },
    class_code:{
        type: String,
        required: true
    },
    instructor:{
        type: String,
        required: true
    },
    days_and_time:{
        type: String,
        required: true
    },
    room:{
        type: String,
        required: true
    },
    section:{
        type: String,
        required: true
    },
    students:{
        type: Array,
        default: null
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

module.exports = mongoose.model('Class', classSchema)