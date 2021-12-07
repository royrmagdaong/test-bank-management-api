const mongoose = require('mongoose')
const Schema = mongoose.Schema

const examSchema = Schema({
    title:{
        type: String,
        required: true
    },
    class:[{
        type: Schema.Types.ObjectId, 
        ref: 'Class'
    }],
    questions:[{
        type: Map,
        of: String
    }],
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

module.exports = mongoose.model('Exam', examSchema)