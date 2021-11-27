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

// create student
router.post('/create', 
    authenticate, 
    authRole(['admin']), 
    StudentController.createStudent
)

// get students by id
router.post('/students', 
    authenticate, 
    authRole(['admin']), 
    StudentController.getStudentByStudentID
),

// get student info
router.post('/student-info', 
    authenticate, 
    authRole(['admin','student']), 
    StudentController.getStudentInfo
),

// get all students without user_id
router.post('/students-no-user', 
    authenticate, 
    authRole(['admin']), 
    StudentController.getStudentsWithoutUser
)

module.exports = router