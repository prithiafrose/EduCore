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


// Create student mark
router.post("/", create);


// Update student mark
router.put("/:id", update);
router.get("/", getAll);
router.get("/enrollment/:enrollmentId", getByEnrollment);
router.get(
    "/activity/:assessmentActivityId",
    getByActivity
);
router.get("/:id", getById);


router.delete("/:id", remove);


module.exports = router;