const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp } = require('../utilities/OTPProcess');

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  try {
    const response = await sendOtp(phone);
    console.log(phone);
    res.send({ status: 'OTP Sent', sid: response.sid });
  } catch (err) {
    console.log(err)
    res.status(500).send({ errorMessage: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phone, code } = req.body;
  try {
    const response = await verifyOtp(phone, code);
    console.log(phone + " and code is " + code)
    if (response.status === 'approved') {
      res.send({ status: 'OTP Verified' });
    } else {
      res.status(400).send({ status: 'Invalid Code' });
    }
  } catch (err) {
    res.status(500).send({ errorMessage: err.message });
  }
});

module.exports = router;
