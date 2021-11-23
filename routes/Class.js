const express = require('express')
const router = express.Router()
const ClassController = require('../controllers/ClassController')
const authenticate = require('../middlewares/authenticate')
const authRole = require('../middlewares/authRole')

// create class
router.post('/create', 
    authenticate, 
    authRole(['admin']), 
    ClassController.createClass
)


module.exports = router