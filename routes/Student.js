const express = require('express')
const router = express.Router()
const StudentController = require('../controllers/StudentController')
const getUser = require('../middlewares/getUser')
const checkEmail = require('../middlewares/checkEmail')
const authenticate = require('../middlewares/authenticate')
const authRole = require('../middlewares/authRole')

// get all students
router.post('/', 
    authenticate, 
    authRole(['admin']), 
    StudentController.getStudents
)

module.exports = router