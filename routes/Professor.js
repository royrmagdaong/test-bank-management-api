const express = require('express')
const router = express.Router()
const ProfessorController = require('../controllers/ProfessorController')
const authenticate = require('../middlewares/authenticate')
const authRole = require('../middlewares/authRole')

// get professors
router.post('/', 
    authenticate, 
    authRole(['admin']), 
    ProfessorController.getProfessors
)

// create professor
router.post('/create', 
    authenticate, 
    authRole(['admin']), 
    ProfessorController.createProfessor
)

// create professor
router.post('/prof-info', 
    authenticate, 
    authRole(['admin', 'professor']), 
    ProfessorController.getProfessorInfo
)

// get all professors without user_id
router.post('/professors-no-user', 
    authenticate, 
    authRole(['admin']), 
    ProfessorController.getProfessorsWithoutUser
)

module.exports = router