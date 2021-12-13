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

// get all class by activitiy
router.post('/unassign-activity-to-class', 
    authenticate, 
    authRole(['professor']), 
    ActivityController.unAssignActivityToClass
)

// set exam duration
router.post('/set-exam-duration', 
    authenticate, 
    authRole(['professor']), 
    ActivityController.setExamDuration
)

// get student activities
router.post('/student-activities', 
    authenticate, 
    authRole(['student']), 
    ActivityController.getStudentActivities
)

// get student activity
router.post('/student-activity', 
    authenticate, 
    authRole(['student']), 
    ActivityController.getActivity
)

module.exports = router