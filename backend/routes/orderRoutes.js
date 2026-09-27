const Controller = require('../controllers/order');
const express = require('express');
const verifyToken = require('../middlewares/auth');
const router = express.Router();

router.get('/', Controller.getAllOrders);
router.get('/provider', verifyToken, Controller.getProviderOrders);
router.get('/customer/', verifyToken, Controller.getOrdersByUserId);
router.get('/:id', Controller.getOrderById);
router.put('/:orderId/status', verifyToken, Controller.updateOrderStatus);
router.put('/:orderId/trip', verifyToken, Controller.updateTripStatus);
router.get('/:orderId/pin', verifyToken, Controller.getTripPin);
router.get('/:orderId/payment', verifyToken, Controller.getPayment);
router.put('/:orderId/payment', verifyToken, Controller.requestPayment);
router.put('/:orderId/payment/paid', verifyToken, Controller.markPaidByCustomer);
router.post('/', verifyToken, Controller.createInstantOrder);

module.exports = router;