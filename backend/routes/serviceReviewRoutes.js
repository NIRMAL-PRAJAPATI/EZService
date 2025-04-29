const express = require("express")
const router = express.Router()
const Controller = require("../controllers/serviceReview")

router.get("/service/:id", Controller.getRatingsFromServiceId)

module.exports = router;