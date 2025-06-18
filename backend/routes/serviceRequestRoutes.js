const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const controllers = require('../controllers/serviceRequest');

// Create a new service request
router.post('/', verifyToken, controllers.createServiceRequest);

// Get service requests for a customer
router.get('/customer', verifyToken, controllers.getCustomerServiceRequests);

// Get active service requests for providers
router.get('/active', verifyToken, controllers.getActiveServiceRequests);

// Update service request status
router.put('/:id/status', verifyToken, controllers.updateServiceRequestStatus);

module.exports = router;