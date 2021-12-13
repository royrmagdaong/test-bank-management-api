const express = require('express')
const router = express.Router()
const ClassController = require('../controllers/ClassController')
const authenticate = require('../middlewares/authenticate')
const authRole = require('../middlewares/authRole')

// get classes
router.post('/', 
    authenticate, 
    authRole(['admin']), 
    ClassController.getClasses
)

// create class
router.post('/create', 
    authenticate, 
    authRole(['admin']), 
    ClassController.createClass
)

// add student
router.post('/add-student', 
    authenticate, 
    authRole(['admin']), 
    ClassController.addStudent
)

// get students
router.post('/students', 
    authenticate, 
    authRole(['admin']), 
    ClassController.getStudents
)

// get student subjects
router.post('/student-subjects', 
    authenticate, 
    authRole(['admin','student']), 
    ClassController.getStudentSubjects
)

// get professor subjects
router.post('/prof-subjects', 
    authenticate, 
    authRole(['admin','professor']), 
    ClassController.getProfessorSubjects
)

// get professor class and subjects
router.post('/prof-class-subjects', 
    authenticate, 
    authRole(['professor']), 
    ClassController.getProfessorClassAndSubjects
)

module.exports = router