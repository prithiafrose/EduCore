const express = require("express");

const programController =
    require("../controllers/program.controller");

const {
    authorize
} = require("../middleware/role.middleware");

const router = express.Router();


// GET all programs
router.get(
    "/",
    programController.getAllPrograms
);


// GET program by ID
router.get(
    "/:id",
    programController.getProgramById
);


// CREATE program
router.post(
    "/",
    authorize("ADMIN"),
    programController.createProgram
);


// UPDATE program
router.put(
    "/:id",
    authorize("ADMIN"),
    programController.updateProgram
);


// DELETE program
router.delete(
    "/:id",
    authorize("ADMIN"),
    programController.deleteProgram
);


module.exports = router;