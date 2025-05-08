const express = require('express');
const router = express.Router();
const Controller = require('../controllers/providerInfo');
const verifyToken = require('../middlewares/auth');

router.get('/profile/:id', Controller.getProviderProfile);
router.get('/services/:id', Controller.getProviderWithServices);
router.get('/stats/:id',  Controller.getProviderStats);
router.post('/register', Controller.registerProvider);
router.post('/login', Controller.loginProvider);

module.exports = router;