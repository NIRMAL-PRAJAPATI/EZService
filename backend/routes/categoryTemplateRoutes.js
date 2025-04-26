const Controller = require("../controllers/categoryTemplate")
const express = require("express")
const router = express.Router()
const pagination = require("../middlewares/pagination")

router.get("/", Controller.getAllTemplates)

module.exports = router;