const express = require("express");

const academicSemesterController =
    require("../controllers/academicSemester.controller");

const router = express.Router();


// GET all academic semesters
router.get(
    "/",
    academicSemesterController.getAllAcademicSemesters
);


// GET academic semester by ID
router.get(
    "/:id",
    academicSemesterController.getAcademicSemesterById
);


// CREATE academic semester
router.post(
    "/",
    academicSemesterController.createAcademicSemester
);


// UPDATE academic semester
router.put(
    "/:id",
    academicSemesterController.updateAcademicSemester
);


// DELETE academic semester
router.delete(
    "/:id",
    academicSemesterController.deleteAcademicSemester
);


module.exports = router;