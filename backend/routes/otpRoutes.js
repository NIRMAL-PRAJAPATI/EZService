const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp } = require('../utilities/OTPProcess');

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  try {
    const response = await sendOtp(phone);
    res.send({ status: 'OTP Sent', sid: response.sid });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phone, code } = req.body;
  try {
    const response = await verifyOtp(phone, code);
    if (response.status === 'approved') {
      res.send({ status: 'OTP Verified' });
    } else {
      res.status(400).send({ status: 'Invalid Code' });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
