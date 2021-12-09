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
// get activitiy by id
router.post('/get/:id', 
    authenticate, 
    authRole(['professor']), 
    ActivityController.getActivityById
)
// update activitiy
router.post('/update', 
    authenticate, 
    authRole(['professor']), 
    ActivityController.updateActivity
)
// delete activitiy
router.post('/delete/:id', 
    authenticate, 
    authRole(['professor']), 
    ActivityController.deleteActivity
)
// get activitiy count by prof
router.post('/count', 
    authenticate, 
    authRole(['professor']), 
    ActivityController.getActivityCount
)

// get activitiy count by prof
router.post('/assign-activity', 
    authenticate, 
    authRole(['professor']), 
    ActivityController.assignActivityToClass
)

// get activitiy count by prof
router.post('/class-prof-activity', 
    authenticate, 
    authRole(['professor']), 
    ActivityController.getClassByProfActivity
)

// get all class by activitiy
router.post('/class-by-activity', 
    authenticate, 
    authRole(['professor']), 
    ActivityController.getAllClassByActivity
)

module.exports = router