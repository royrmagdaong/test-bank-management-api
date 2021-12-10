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
    is_done:{
        type: Boolean,
        default: false
    },
    start_time:{
        type: Date,
        default: null
    },
    time_duration:{
        type: Date,
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

module.exports = mongoose.model('Quiz', quizSchema)