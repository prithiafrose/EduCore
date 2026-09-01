


const express = require("express");
const {
    authenticate
} = require("../middleware/auth.middleware");
const {
    authorize
} = require("../middleware/role.middleware");

const userController =
    require("../controllers/user.controller");

const router = express.Router();


// GET all users
router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    userController.getAllUsers
);


// GET user by ID
router.get(
    "/:id",
    authenticate,
    userController.getUserById
);


// CREATE user
router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    userController.createUser
);


// UPDATE user
router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    userController.updateUser
);


// DELETE user
router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    userController.deleteUser
);


module.exports = router;