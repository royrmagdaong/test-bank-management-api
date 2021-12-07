const express = require('express')
const router = express.Router()
const ActivityController = require('../controllers/ActivityController')
const authenticate = require('../middlewares/authenticate')
const authRole = require('../middlewares/authRole')

// create activity
router.post('/create', 
    authenticate, 
    authRole(['professor']), 
    ActivityController.createActivity
)
// get activities by prof
router.post('/', 
    authenticate, 
    authRole(['professor']), 
    ActivityController.getProfActivities
)

module.exports = router