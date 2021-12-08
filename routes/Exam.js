const express = require('express')
const router = express.Router()
const ExamController = require('../controllers/ExamController')
const authenticate = require('../middlewares/authenticate')
const authRole = require('../middlewares/authRole')

// create exam
router.post('/create', 
    authenticate, 
    authRole(['professor']), 
    ExamController.createExam
)
// get exams by prof
router.post('/', 
    authenticate, 
    authRole(['professor']), 
    ExamController.getProfExams
)
// get exam by id
router.post('/get/:id', 
    authenticate, 
    authRole(['professor']), 
    ExamController.getExamById
)
// update exam
router.post('/update', 
    authenticate, 
    authRole(['professor']), 
    ExamController.updateExam
)
// delete exam
router.post('/delete/:id', 
    authenticate, 
    authRole(['professor']), 
    ExamController.deleteExam
)
// get exam count by prof
router.post('/count', 
    authenticate, 
    authRole(['professor']), 
    ExamController.getExamCount
)

module.exports = router