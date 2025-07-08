const express = require('express');
const router = express.Router();
const Controller = require('../controllers/providerInfo');
const verifyToken = require('../middlewares/auth');

router.get('/profile', verifyToken, Controller.getProviderProfile);
router.get('/bank', verifyToken, Controller.getProviderBank);
router.get('/orders', verifyToken, Controller.getProviderOrders);
router.get('/services', verifyToken,  Controller.getProviderServices);
router.get('/view/profile',  Controller.getProviderWithServices);
router.get('/stats', verifyToken ,Controller.getProviderStats);
router.post('/register', Controller.registerProvider);
router.post('/login', Controller.loginProvider);

module.exports = router;