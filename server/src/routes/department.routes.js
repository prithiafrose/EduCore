const express = require("express");

const departmentController =
    require("../controllers/department.controller");

const {
    authorize
} = require("../middleware/role.middleware");

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
    authorize("ADMIN"),
    departmentController.createDepartment
);


// UPDATE department
router.put(
    "/:id",
    authorize("ADMIN"),
    departmentController.updateDepartment
);


// DELETE department
router.delete(
    "/:id",
    authorize("ADMIN"),
    departmentController.deleteDepartment
);


module.exports = router;