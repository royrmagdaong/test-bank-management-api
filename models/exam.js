const mongoose = require('mongoose')
const Schema = mongoose.Schema

const examSchema = Schema({
    prof_id: {
        type: Schema.Types.ObjectId, 
        ref: 'Professor'
    },
    examName:{
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
    in_progress:{
        type: Boolean,
        default: false
    },
    time_duration:{
        type: Object,
        of: String
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

module.exports = mongoose.model('Exam', examSchema)