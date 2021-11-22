const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studentSchema = Schema({
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    index: {
        type: Number,
        required: true
    },
    student_id: {
        type: String,
        required: true
    },
    first_name:{
        type: String,
        required: true
    },
    middle_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    birth_day:{
        type: Date,
        default: null
    },
    gender:{
        type: String,
        default: null
    },
    email:{
        type: String,
        default: null
    },
    course:{
        type: String,
        default: null
    },
    section:{
        type: String,
        required: true
    },
    year_level:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    academic_year:{
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

module.exports = mongoose.model('Student', studentSchema)