const express = require("express")
const router = express.Router()
const Controller = require("../controllers/serviceReview")
const verifyToken = require("../middlewares/auth")

router.get("/service/:id", Controller.getRatingsFromServiceId)
router.post("/", verifyToken, Controller.createReview)

module.exports = router;