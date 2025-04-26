const controllers = require('../controllers/service');
const express = require('express');
const router = express.Router();

router.get('/', controllers.getServices);

module.exports = router;