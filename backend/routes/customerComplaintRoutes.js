const Controller = require('../controllers/customerComplaint');
const express = require('express');
const verifyToken = require('../middlewares/auth');
const pagination = require('../middlewares/pagination');
const router = express.Router();

router.get('/provider', verifyToken, pagination, Controller.getProviderComplaints);
router.put('/:complaintId/status', verifyToken, Controller.updateComplaintStatus);
router.get('/customer', verifyToken, Controller.getCustomerComplaints);
router.post('/', verifyToken, Controller.createComplaint);

module.exports = router;