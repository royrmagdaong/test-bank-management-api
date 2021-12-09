const mongoose = require('mongoose')
const Schema = mongoose.Schema

const classSchema = Schema({
    index: {
        type: Number,
        required: true
    },
    class_code:{
        type: Schema.Types.ObjectId, 
        ref: 'Subject'
    },
    instructor:{
        type: Schema.Types.ObjectId, 
        ref: 'Professor'
    },
    days_and_time:{
        type: String,
        required: true
    },
    room:{
        type: Schema.Types.ObjectId, 
        ref: 'Room'
    },
    section:{
        type: Schema.Types.ObjectId, 
        ref: 'GradeLevel'
    },
    students:[{
        type: Schema.Types.ObjectId, 
        ref: 'Student'
    }],
    quiz:[{
        type: Schema.Types.ObjectId, 
        ref: 'Quiz'
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

module.exports = mongoose.model('Class', classSchema)