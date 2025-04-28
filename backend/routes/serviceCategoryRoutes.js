const Controller = require("../controllers/serviceCategory")
const express = require("express")
const router = express.Router()

router.get("/names", Controller.getServiceCategoryNames)
router.get("/", Controller.getCategories)

module.exports = router;