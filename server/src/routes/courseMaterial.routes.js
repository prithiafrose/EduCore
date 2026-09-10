const express = require("express");

const router = express.Router();

const courseMaterialController =
    require("../controllers/courseMaterial.controller");

const {
    authorize
} = require("../middleware/role.middleware");

const { upload } = require("../utils/upload");

// GET all course materials
router.get(
    "/",
    courseMaterialController.getAllCourseMaterials
);

// GET materials by course offering
router.get(
    "/course-offering/:courseOfferingId",
    courseMaterialController.getMaterialsByCourseOffering
);

// CREATE course material (file field: "file")
router.post(
    "/",
    authorize("TEACHER", "ADMIN"),
    upload.single("file"),
    courseMaterialController.createCourseMaterial
);

// DOWNLOAD course material
router.get(
    "/:id/download",
    courseMaterialController.downloadCourseMaterial
);

// DELETE course material
router.delete(
    "/:id",
    authorize("TEACHER", "ADMIN"),
    courseMaterialController.deleteCourseMaterial
);

module.exports = router;