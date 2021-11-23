const express = require('express')
const router = express.Router()
const RoomController = require('../controllers/RoomController')
const authenticate = require('../middlewares/authenticate')
const authRole = require('../middlewares/authRole')

// get rooms
router.post('/', 
    authenticate, 
    authRole(['admin']), 
    RoomController.getRooms
)
// create rooms
router.post('/create', 
    authenticate, 
    authRole(['admin']), 
    RoomController.createRoom
)

module.exports = router