const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = Schema({
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
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
        required: true
    },
    email:{
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

module.exports = mongoose.model('Admin', adminSchema)