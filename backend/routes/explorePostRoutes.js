const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middlewares/auth');
const Controller = require('../controllers/explorePost');

const uploadDir = path.join(__dirname, '../uploads/explore');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${req.userId}_${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

router.get('/', Controller.getPosts);
router.post('/', verifyToken, upload.single('image'), Controller.createPost);

module.exports = router;
