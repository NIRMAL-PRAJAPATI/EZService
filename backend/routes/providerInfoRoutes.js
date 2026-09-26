const express = require('express');
const router = express.Router();
const Controller = require('../controllers/providerInfo');
const verifyToken = require('../middlewares/auth');

router.get('/profile', verifyToken, Controller.getProviderProfile);
router.get('/bank', verifyToken, Controller.getProviderBank);
router.put('/bank', verifyToken, Controller.updateProviderBank);
router.put('/info', verifyToken, Controller.updateProviderInfo);
router.put('/info/password', verifyToken, Controller.updateProviderPassword);
router.get('/orders', verifyToken, Controller.getProviderOrders);
router.get('/services', verifyToken,  Controller.getProviderServices);
router.get('/view/profile',  Controller.getProviderWithServices);
router.get('/stats', verifyToken, Controller.getDashboardStats);
router.get('/basic-stats', verifyToken, Controller.getProviderStats);
router.get('/online-status', verifyToken, Controller.getOnlineStatus);
router.patch('/online-status', verifyToken, Controller.updateOnlineStatus);
router.get('/search', Controller.searchProviders);
router.post('/register', Controller.registerProvider);
router.post('/login', Controller.loginProvider);

module.exports = router;