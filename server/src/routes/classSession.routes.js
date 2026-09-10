const express = require("express");

const router = express.Router();

const classSessionController =
    require("../controllers/classSession.controller");

const {
    authorize
} = require("../middleware/role.middleware");


// GET all class sessions
router.get(
    "/",
    classSessionController.getAllClassSessions
);


// GET class session by ID
router.get(
    "/:id",
    classSessionController.getClassSessionById
);


// CREATE class session
router.post(
    "/",
    authorize("ADMIN"),
    classSessionController.createClassSession
);


// UPDATE class session
router.put(
    "/:id",
    authorize("ADMIN"),
    classSessionController.updateClassSession
);


// CANCEL class session
router.patch(
    "/:id/cancel",
    authorize("ADMIN", "TEACHER"),
    classSessionController.cancelClassSession
);


// RESCHEDULE class session
router.post(
    "/:id/reschedule",
    authorize("ADMIN", "TEACHER"),
    classSessionController.rescheduleClassSession
);


module.exports = router;