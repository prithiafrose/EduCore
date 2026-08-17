const express = require("express");

const userController =
    require("../controllers/user.controller");

const router = express.Router();


// GET all users
router.get(
    "/",
    userController.getAllUsers
);


// GET user by ID
router.get(
    "/:id",
    userController.getUserById
);


// CREATE user
router.post(
    "/",
    userController.createUser
);


// UPDATE user
router.put(
    "/:id",
    userController.updateUser
);


// DELETE user
router.delete(
    "/:id",
    userController.deleteUser
);


module.exports = router;