const express = require("express");

const sectionController =
    require("../controllers/section.controller");

const {
    authorize
} = require("../middleware/role.middleware");

const router = express.Router();


// GET all sections
router.get(
    "/",
    sectionController.getAllSections
);


// GET section by ID
router.get(
    "/:id",
    sectionController.getSectionById
);


// CREATE section
router.post(
    "/",
    authorize("ADMIN"),
    sectionController.createSection
);


// UPDATE section
router.put(
    "/:id",
    authorize("ADMIN"),
    sectionController.updateSection
);


// DELETE section
router.delete(
    "/:id",
    authorize("ADMIN"),
    sectionController.deleteSection
);


module.exports = router;