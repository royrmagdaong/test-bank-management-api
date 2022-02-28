const express = require('express')
const router = express.Router()
const ModuleController = require('../controllers/ModuleController')
const authenticate = require('../middlewares/authenticate')
const authRole = require('../middlewares/authRole')

// for file uploads
const multer  = require('multer')
const upload = multer({ dest: 'uploads/modules' })

// get prof modules
router.get('/', 
    authenticate, 
    authRole(['professor']), 
    ModuleController.getModules
)

// get prof modules
router.get('/count', 
    authenticate, 
    authRole(['professor']), 
    ModuleController.getModuleCount
)

// upload module
router.post('/upload', 
    authenticate, 
    authRole(['professor']), 
    upload.single('module_'),
    ModuleController.uploadModule
)


module.exports = router