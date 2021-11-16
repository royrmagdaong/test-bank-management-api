const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
    role: { type: String, required: true },
    account_name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    verificationCode: { type: String, required: false },
    is_verified: { type: Boolean, default: true },
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

module.exports = mongoose.model('User', userSchema)