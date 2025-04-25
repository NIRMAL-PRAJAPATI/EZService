const Controller = require('../controllers/customerInfo');
const express = require('express');
const router = express.Router();

// Route to get customer information
router.get('/customer/:id', Controller.getCustomerInfo);

module.exports = router;