const express = require("express");

const router = express.Router();

const {
    create,
    update,
    getById,
     getAll,
     remove,
     getByEnrollment,
     getByActivity

} = require("../controllers/studentMark.controller");

const {
    authorize
} = require("../middleware/role.middleware");


// Create student mark
router.post("/", authorize("ADMIN", "TEACHER"), create);


// Update student mark
router.put("/:id", authorize("ADMIN", "TEACHER"), update);
router.get("/", getAll);
router.get("/enrollment/:enrollmentId", getByEnrollment);
router.get(
    "/activity/:assessmentActivityId",
    getByActivity
);
router.get("/:id", getById);


router.delete("/:id", authorize("ADMIN", "TEACHER"), remove);


module.exports = router;