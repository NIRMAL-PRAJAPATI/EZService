const controllers = require('../controllers/service');
const express = require('express');
const router = express.Router();

router.get('/', controllers.getServices);
router.get('/verified', controllers.getVerifiedServices)
router.get('/:id/category', controllers.getServicesByCategoryId)

module.exports = router;