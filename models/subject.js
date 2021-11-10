const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subjectSchema = Schema({
    code:{
        type: String,
        default: null
    },
    description:{
        type: String,
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

module.exports = mongoose.model('Subject', subjectSchema)