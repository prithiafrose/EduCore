const express = require("express");

const programController =
    require("../controllers/program.controller");

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
    programController.createProgram
);


// UPDATE program
router.put(
    "/:id",
    programController.updateProgram
);


// DELETE program
router.delete(
    "/:id",
    programController.deleteProgram
);


module.exports = router;