const express = require('express')
const router = express.Router()
const QuizController = require('../controllers/QuizController')
const authenticate = require('../middlewares/authenticate')
const authRole = require('../middlewares/authRole')

// create Quiz
router.post('/create', 
    authenticate, 
    authRole(['professor']), 
    QuizController.createQuiz
)
// get quizzes by prof
router.post('/', 
    authenticate, 
    authRole(['professor']), 
    QuizController.getProfQuizzes
)
// get quiz by id
router.post('/get/:id', 
    authenticate, 
    authRole(['professor']), 
    QuizController.getQuizById
)
// update quiz
router.post('/update', 
    authenticate, 
    authRole(['professor']), 
    QuizController.updateQuiz
)
// delete quiz
router.post('/delete/:id', 
    authenticate, 
    authRole(['professor']), 
    QuizController.deleteQuiz
)
// get quiz count by prof
router.post('/count', 
    authenticate, 
    authRole(['professor']), 
    QuizController.getQuizCount
)
// assign class
router.post('/assign-quiz', 
    authenticate, 
    authRole(['professor']), 
    QuizController.assignQuizToClass
)
// get all class assign to quiz
router.post('/assigned-quiz', 
    authenticate, 
    authRole(['professor']), 
    QuizController.getAllClass
)
// unassign class
router.post('/unassign-quiz', 
    authenticate, 
    authRole(['professor']), 
    QuizController.unAssignClass
)

module.exports = router