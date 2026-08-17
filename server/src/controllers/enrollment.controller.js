const enrollmentService =
    require("../services/enrollment.service");


// GET all enrollments
const getAllEnrollments = async (req, res) => {
    try {

        const enrollments =
            await enrollmentService.getAllEnrollments();

        res.status(200).json(enrollments);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch enrollments"
        });
    }
};


// GET enrollment by ID
const getEnrollmentById = async (req, res) => {
    try {

        const { id } = req.params;

        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid enrollment ID"
            });
        }

        const enrollment =
            await enrollmentService.getEnrollmentById(id);

        if (!enrollment) {
            return res.status(404).json({
                message: "Enrollment not found"
            });
        }

        res.status(200).json(enrollment);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch enrollment"
        });
    }
};


// CREATE enrollment
const createEnrollment = async (req, res) => {
    try {

        const {
            studentId,
            courseOfferingId,
            sectionId
        } = req.body;


        // Required fields
        if (
            studentId === undefined ||
            courseOfferingId === undefined
        ) {
            return res.status(400).json({
                message:
                    "studentId and courseOfferingId are required"
            });
        }


        // Validate IDs
        if (
            !Number.isInteger(Number(studentId)) ||
            Number(studentId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid studentId"
            });
        }


        if (
            !Number.isInteger(Number(courseOfferingId)) ||
            Number(courseOfferingId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid courseOfferingId"
            });
        }


        if (
            sectionId !== undefined &&
            sectionId !== null &&
            (
                !Number.isInteger(Number(sectionId)) ||
                Number(sectionId) <= 0
            )
        ) {
            return res.status(400).json({
                message: "Invalid sectionId"
            });
        }


        const enrollment =
            await enrollmentService.createEnrollment(
                studentId,
                courseOfferingId,
                sectionId
            );


        res.status(201).json(enrollment);

    } catch (error) {

        console.error(error);

        if (error.message === "Student not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        if (
            error.message ===
            "Course offering not found"
        ) {
            return res.status(404).json({
                message: error.message
            });
        }

        if (error.message === "Section not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        if (
            error.message ===
            "Section does not belong to this course offering"
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        if (
            error.message ===
            "Student is already enrolled in this course offering"
        ) {
            return res.status(409).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Failed to create enrollment"
        });
    }
};


// UPDATE enrollment
const updateEnrollment = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            studentId,
            courseOfferingId,
            sectionId
        } = req.body;


        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid enrollment ID"
            });
        }


        if (
            studentId === undefined ||
            courseOfferingId === undefined
        ) {
            return res.status(400).json({
                message:
                    "studentId and courseOfferingId are required"
            });
        }


        if (
            !Number.isInteger(Number(studentId)) ||
            Number(studentId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid studentId"
            });
        }


        if (
            !Number.isInteger(Number(courseOfferingId)) ||
            Number(courseOfferingId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid courseOfferingId"
            });
        }


        if (
            sectionId !== undefined &&
            sectionId !== null &&
            (
                !Number.isInteger(Number(sectionId)) ||
                Number(sectionId) <= 0
            )
        ) {
            return res.status(400).json({
                message: "Invalid sectionId"
            });
        }


        const enrollment =
            await enrollmentService.updateEnrollment(
                id,
                studentId,
                courseOfferingId,
                sectionId
            );


        res.status(200).json(enrollment);

    } catch (error) {

        console.error(error);

        if (
            error.message ===
            "Enrollment not found"
        ) {
            return res.status(404).json({
                message: error.message
            });
        }

        if (error.message === "Student not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        if (
            error.message ===
            "Course offering not found"
        ) {
            return res.status(404).json({
                message: error.message
            });
        }

        if (error.message === "Section not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        if (
            error.message ===
            "Section does not belong to this course offering"
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        if (
            error.message ===
            "Student is already enrolled in this course offering"
        ) {
            return res.status(409).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Failed to update enrollment"
        });
    }
};


// DELETE enrollment
const deleteEnrollment = async (req, res) => {
    try {

        const { id } = req.params;

        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid enrollment ID"
            });
        }


        await enrollmentService.deleteEnrollment(id);

        res.status(200).json({
            message: "Enrollment deleted successfully"
        });

    } catch (error) {

        console.error(error);

        if (
            error.message ===
            "Enrollment not found"
        ) {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Failed to delete enrollment"
        });
    }
};


module.exports = {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
};