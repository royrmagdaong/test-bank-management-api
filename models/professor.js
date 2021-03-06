const mongoose = require('mongoose')
const Schema = mongoose.Schema

const professorSchema = Schema({
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        default: null
    },
    id_number: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    department: {
        type: String,
        default: null
    },
    email:{
        type: String,
        required: true
    },
    first_name:{
        type: String,
        default: null
    },
    middle_name:{
        type: String,
        default: null
    },
    last_name:{
        type: String,
        default: null
    },
    birth_day:{
        type: Date,
        default: null
    },
    gender:{
        type: String,
        default: null
    },
    address:{
        type: String,
        default: null
    },
    civil_status:{
        type: String,
        default: null
    },
    specialization:{
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

module.exports = mongoose.model('Professor', professorSchema)