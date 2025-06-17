const controllers = require('../controllers/service');
const express = require('express');
const verifyToken = require('../middlewares/auth');
const router = express.Router();
const multer = require("multer")
const path = require("path")

const fs = require('fs')
const ul = path.join(__dirname, '../uploads/services')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use a flat structure without nested folders to avoid path issues
    if (!fs.existsSync(ul)) {
      fs.mkdirSync(ul, { recursive: true })
    }
    
    cb(null, ul)
  },
  filename: function (req, file, cb) {
    // Get file extension
    const ext = path.extname(file.originalname)
    // Include userId in filename for organization without using folders
    const uniqueSuffix = `${req.userId}_${Date.now()}-${Math.round(Math.random() * 1E9)}`
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

const upload = multer({ storage: storage })

router.get('/', controllers.getServices);
router.get('/verified', controllers.getVerifiedServices)
router.get('/:id/category', controllers.getServicesByCategoryId)
router.get('/:id', controllers.getServiceById)
router.post("/", verifyToken, upload.fields([{name: 'cover_image', maxCount: 1}, {name: 'working_images', maxCount: 20}]), controllers.createService)
router.put("/:id", verifyToken, upload.fields([{name: 'cover_image', maxCount: 1}, {name: 'working_images', maxCount: 20}]), controllers.updateService)
router.delete("/:id", verifyToken, controllers.deleteService)
router.delete("/:id", verifyToken, controllers.deleteService)

module.exports = router;