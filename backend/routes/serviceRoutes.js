const controllers = require('../controllers/service');
const express = require('express');
const router = express.Router();

router.get('/', controllers.getServices);
router.get('/verified', controllers.getVerifiedServices)

module.exports = router;