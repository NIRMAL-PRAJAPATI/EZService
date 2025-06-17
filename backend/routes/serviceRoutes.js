const controllers = require('../controllers/service');
const express = require('express');
const verifyToken = require('../middlewares/auth');
const router = express.Router();
const multer = require("multer")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads/service')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

router.get('/', controllers.getServices);
router.get('/verified', controllers.getVerifiedServices)
router.get('/:id/category', controllers.getServicesByCategoryId)
router.get('/:id', controllers.getServiceById)
router.put("/:id", verifyToken, upload.fields([{name: 'cover_image', maxCount: 1}, {name: 'working_images', maxCount: 20}]), controllers.updateService)

module.exports = router;