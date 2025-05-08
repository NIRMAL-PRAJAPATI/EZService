const express = require('express');
const router = express.Router();
const Controller = require('../controllers/providerInfo');

router.get('/profile/:id', Controller.getProviderProfile);
router.get('/services/:id', Controller.getProviderWithServices);
router.get('/stats/:id', Controller.getProviderStats);

module.exports = router;