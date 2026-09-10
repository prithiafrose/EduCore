const express = require("express");

const adminController = require("../controllers/admin.controller");

const {
  authorize
} = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", authorize("ADMIN"), adminController.getAdminStats);

router.get("/revenue", authorize("ADMIN"), adminController.getRevenueOverview);

module.exports = router;