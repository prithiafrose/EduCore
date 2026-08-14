const express = require("express");

const sectionController =
    require("../controllers/section.controller");

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
    sectionController.createSection
);


// UPDATE section
router.put(
    "/:id",
    sectionController.updateSection
);


// DELETE section
router.delete(
    "/:id",
    sectionController.deleteSection
);


module.exports = router;