const express = require("express");

const router = express.Router();

const classSessionController =
    require("../controllers/classSession.controller");


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
    classSessionController.createClassSession
);


// UPDATE class session
router.put(
    "/:id",
    classSessionController.updateClassSession
);


// CANCEL class session
router.patch(
    "/:id/cancel",
    classSessionController.cancelClassSession
);


// RESCHEDULE class session
router.post(
    "/:id/reschedule",
    classSessionController.rescheduleClassSession
);


module.exports = router;