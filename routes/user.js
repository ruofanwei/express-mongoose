const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// user Model
const user = require('../models/User')

router.get("/client/staffs", userController.listStaff);

module.exports = router;