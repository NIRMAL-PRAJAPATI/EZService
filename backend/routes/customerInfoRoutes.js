const Controller = require('../controllers/customerInfo');
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');

// Route to get customer information
router.get('/profile', verifyToken, Controller.getCustomerInfo);
router.post('/login', Controller.loginCustomer);
router.post('/register', Controller.registerCustomer);
router.post('/varifyemailmobile', Controller.varifyEmailMobile);
router.put('/profile/update', verifyToken, Controller.updateCustomer);
router.put('/password', verifyToken, Controller.updatePassword);

module.exports = router;