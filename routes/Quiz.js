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
router.post('/assign-class', 
    authenticate, 
    authRole(['professor']), 
    QuizController.assignClass
)
// get all class assign to quiz
router.post('/assigned-class', 
    authenticate, 
    authRole(['professor']), 
    QuizController.getAllClass
)

module.exports = router