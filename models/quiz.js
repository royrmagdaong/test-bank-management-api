const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quizSchema = Schema({
    prof_id: {
        type: Schema.Types.ObjectId, 
        ref: 'Professor'
    },
    quizName:{
        type: String,
        required: true
    },
    questions:[{
        type: Object,
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

module.exports = mongoose.model('Quiz', quizSchema)