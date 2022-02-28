const mongoose = require('mongoose')
const Schema = mongoose.Schema

const moduleSchema = Schema({
    prof_id: {
        type: Schema.Types.ObjectId, 
        ref: 'Professor'
    },
    subj_id: {
        type: Schema.Types.ObjectId, 
        ref: 'Subject'
    },
    moduleName:{
        type: String,
        required: true
    },
    originalFileName:{
        type: String,
        default: null
    },
    mimetype:{
        type: String,
        default: null
    },
    filename:{
        type: String,
        default: null
    },
    path:{
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

module.exports = mongoose.model('Module', moduleSchema)