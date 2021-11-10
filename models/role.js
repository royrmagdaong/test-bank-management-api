const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roleSchema = Schema({
    ADMIN: {type: String, required: true, default: 'admin'},
    PROFESSOR: {type: String, required: true, default: 'professor'},
    STUDENT: {type: String, required: true, default: 'student'}
})

module.exports = mongoose.model('Role', roleSchema)