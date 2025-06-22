require('dotenv').config();
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendOtp(phone) {
  console.log("Sending OTP to: " + phone);
  return client.verify.v2
    .services(process.env.VERIFY_SERVICE_SID)
    .verifications.create({ to: phone, channel: 'sms' });
}

async function verifyOtp(phone, code) {
  return client.verify.v2
    .services(process.env.VERIFY_SERVICE_SID)
    .verificationChecks.create({ to: phone, code });
}

module.exports = { sendOtp, verifyOtp };
