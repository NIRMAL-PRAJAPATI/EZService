const Controller = require('../controllers/customerInfo');
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const passport = require("passport");
const querystring = require("querystring");

// Route to get customer information
router.get('/profile', verifyToken, Controller.getCustomerInfo);
router.post('/login', Controller.loginCustomer);
router.post('/existancecheck', Controller.existanceCheck);
router.post('/register', Controller.registerCustomer);
router.post('/varifyemailmobile', Controller.varifyEmailMobile);
router.put('/profile/update', verifyToken, Controller.updateCustomer);
router.delete('/delete', Controller.deleteCustomer);
router.put('/password', verifyToken, Controller.updatePassword);

// 1. Trigger Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 2. Handle Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const { name, email } = req.user;

    // Redirect to frontend with user info in query string (encoded)
    const query = querystring.stringify({ name, email });
    res.redirect(`http://localhost:5173/authtransfer?${query}`);
  }
);

module.exports = router;