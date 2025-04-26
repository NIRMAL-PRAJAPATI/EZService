const Controller = require("../controllers/categoryTemplate")
const express = require("express")
const router = express.Router()

router.get("/", Controller.getAllTemplates)

module.exports = router;