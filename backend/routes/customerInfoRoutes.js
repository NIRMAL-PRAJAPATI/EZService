const Controller = require('../controllers/customerInfo');
const express = require('express');
const router = express.Router();

// Route to get customer information
router.get('/:id', Controller.getCustomerInfo);
router.post('/register', Controller.registerCustomer);
router.post('/varifyemailmobile', Controller.varifyEmailMobile);

module.exports = router;