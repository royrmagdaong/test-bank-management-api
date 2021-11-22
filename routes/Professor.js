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

module.exports = router