const express = require("express");

const router = express.Router();

const authController =
    require("../controllers/auth.controller");

const {
    authenticate
} = require("../middleware/auth.middleware");
const {
    authorize
} = require("../middleware/role.middleware");


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
    "/change-password",
    authenticate,
    authController.changePassword
);
router.get(
    "/profile",
    authenticate,
    authController.getProfile
);
router.put(
    "/profile",
    authenticate,
    authController.updateProfile
);
router.post(
    "/logout",
    authenticate,
    authController.logoutUser
);

// RESET TEACHER PASSWORD (admin only)
router.post(
    "/reset-teacher-password",
    authenticate,
    authorize("ADMIN"),
    authController.resetTeacherPassword
);

module.exports = router;