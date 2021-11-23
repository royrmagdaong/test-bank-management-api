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


module.exports = router