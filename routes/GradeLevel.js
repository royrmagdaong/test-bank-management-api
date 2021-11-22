const express = require('express')
const router = express.Router()
const GradeLevelController = require('../controllers/GradeLevelController')
const authenticate = require('../middlewares/authenticate')
const authRole = require('../middlewares/authRole')

// get grade levels
router.post('/', 
    authenticate, 
    authRole(['admin']), 
    GradeLevelController.getGradeLevels
)
// create grade level
router.post('/create', 
    authenticate, 
    authRole(['admin']), 
    GradeLevelController.createGradeLevel
)

module.exports = router