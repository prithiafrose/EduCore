const express = require("express");

const departmentController =
    require("../controllers/department.controller");

const router = express.Router();


// GET all departments
router.get(
    "/",
    departmentController.getAllDepartments
);


// GET department by ID
router.get(
    "/:id",
    departmentController.getDepartmentById
);


// CREATE department
router.post(
    "/",
    departmentController.createDepartment
);


// UPDATE department
router.put(
    "/:id",
    departmentController.updateDepartment
);


// DELETE department
router.delete(
    "/:id",
    departmentController.deleteDepartment
);


module.exports = router;