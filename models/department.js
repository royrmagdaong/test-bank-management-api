const mongoose = require('mongoose')
const Schema = mongoose.Schema

const departmentSchema = Schema({
    department_name:{
        type: String,
        default: null
    },
    officer_in_charge:{
        type: String,
        default: null
    },
    email:{
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

module.exports = mongoose.model('Department', departmentSchema)