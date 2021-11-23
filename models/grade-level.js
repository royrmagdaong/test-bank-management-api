const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gradeSchema = Schema({
    index: {
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    grade_level:{
        type: String,
        required: true
    },
    section:{
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

module.exports = mongoose.model('GradeLevel', gradeSchema)