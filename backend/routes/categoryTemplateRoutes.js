const Controller = require("../controllers/categoryTemplate")
const express = require("express")
const router = express.Router()
const pagination = require("../middlewares/pagination")

router.get("/", Controller.getAllTemplates)
router.get("/names", Controller.getMinimalTemplate)

module.exports = router;