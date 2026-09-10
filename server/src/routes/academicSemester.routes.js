const express = require("express");

const academicSemesterController =
    require("../controllers/academicSemester.controller");

const {
    authorize
} = require("../middleware/role.middleware");

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
    authorize("ADMIN"),
    academicSemesterController.createAcademicSemester
);


// UPDATE academic semester
router.put(
    "/:id",
    authorize("ADMIN"),
    academicSemesterController.updateAcademicSemester
);


// DELETE academic semester
router.delete(
    "/:id",
    authorize("ADMIN"),
    academicSemesterController.deleteAcademicSemester
);


module.exports = router;