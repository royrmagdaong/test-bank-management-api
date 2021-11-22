const express = require('express')
const router = express.Router()
const SubjectController = require('../controllers/SubjectController')
const authenticate = require('../middlewares/authenticate')
const authRole = require('../middlewares/authRole')

// get all subjects
router.post('/', 
    authenticate, 
    authRole(['admin']), 
    SubjectController.getSubjects
)
// create subject
router.post('/create', 
    authenticate, 
    authRole(['admin']), 
    SubjectController.createSubject
)


module.exports = router