const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const getUser = require('../middlewares/getUser')
const checkEmail = require('../middlewares/checkEmail')
const authenticate = require('../middlewares/authenticate')
const authRole = require('../middlewares/authRole')

// get all users
router.post('/', 
    authenticate, 
    authRole(['admin']), 
    UserController.getAllUser
)
// sign in user
router.post('/signin', 
    UserController.signInUser
)
// create user
router.post('/create', 
    checkEmail,
    UserController.createUser
)

module.exports = router