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

// get exam count by prof
router.post('/assign-exam', 
    authenticate, 
    authRole(['professor']), 
    ExamController.assignExamToClass
)

// get exam count by prof
router.post('/class-prof-exam', 
    authenticate, 
    authRole(['professor']), 
    ExamController.getClassByProfExam
)

// get all class by exam
router.post('/class-by-exam', 
    authenticate, 
    authRole(['professor']), 
    ExamController.getAllClassByExam
)

// get all class by exam
router.post('/unassign-exam-to-class', 
    authenticate, 
    authRole(['professor']), 
    ExamController.unAssignExamToClass
)
module.exports = router