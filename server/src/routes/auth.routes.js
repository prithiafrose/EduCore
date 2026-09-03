const express = require("express");

const router = express.Router();

const authController =
    require("../controllers/auth.controller");


// LOGIN
router.post(
    "/login",
    authController.login
);
router.post(
    "/register",
    authController.register
);
router.post(
    "/reset-teacher-password",
    authController.resetTeacherPassword
);

module.exports = router;