const courseOfferingService =
    require("../services/courseOffering.service");

const prisma = require("../config/prisma");


// GET all course offerings
const getAllCourseOfferings = async (req, res) => {
    try {
        const offerings =
            await courseOfferingService.getAllCourseOfferings();

        res.status(200).json(offerings);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch course offerings"
        });
    }
};


// GET course offering by ID
const getCourseOfferingById = async (req, res) => {
    try {
        const { id } = req.params;

        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid course offering ID"
            });
        }

        const offering =
            await courseOfferingService.getCourseOfferingById(id);

        if (!offering) {
            return res.status(404).json({
                message: "Course offering not found"
            });
        }

        res.status(200).json(offering);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch course offering"
        });
    }
};


// CREATE course offering
const createCourseOffering = async (req, res) => {
    try {
        const {
            courseId,
            academicSemesterId
        } = req.body;


        // 1. Required fields
        if (
            courseId === undefined ||
            academicSemesterId === undefined
        ) {
            return res.status(400).json({
                message:
                    "courseId and academicSemesterId are required"
            });
        }


        // 2. Validate Course ID
        if (
            !Number.isInteger(Number(courseId)) ||
            Number(courseId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }


        // 3. Validate Academic Semester ID
        if (
            !Number.isInteger(Number(academicSemesterId)) ||
            Number(academicSemesterId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid academic semester ID"
            });
        }


        // 4. Check course exists
        const course =
            await prisma.course.findUnique({
                where: {
                    id: Number(courseId)
                }
            });

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }


        // 5. Check academic semester exists
        const semester =
            await prisma.academicSemester.findUnique({
                where: {
                    id: Number(academicSemesterId)
                },
                include: {
                    program: true
                }
            });

        if (!semester) {
            return res.status(404).json({
                message: "Academic semester not found"
            });
        }


        // 6. Check whether course already exists
        // in another semester of the SAME program
        const existingOffering =
            await prisma.courseOffering.findFirst({
                where: {
                    courseId: Number(courseId),
                    academicSemester: {
                        programId: semester.programId
                    }
                }
            });


        if (existingOffering) {
            return res.status(409).json({
                message:
                    "This course is already offered in another semester of this program"
            });
        }


        // 7. Create course offering
        const offering =
            await courseOfferingService.createCourseOffering(
                courseId,
                academicSemesterId
            );


        res.status(201).json(offering);

    } catch (error) {
        console.error(error);


        // Duplicate course + semester
        if (error.code === "P2002") {
            return res.status(409).json({
                message:
                    "This course is already offered in this semester"
            });
        }


        res.status(500).json({
            message: "Failed to create course offering"
        });
    }
};


// UPDATE course offering
const updateCourseOffering = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            courseId,
            academicSemesterId
        } = req.body;


        // 1. Validate ID
        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid course offering ID"
            });
        }


        // 2. Required fields
        if (
            courseId === undefined ||
            academicSemesterId === undefined
        ) {
            return res.status(400).json({
                message:
                    "courseId and academicSemesterId are required"
            });
        }


        // 3. Validate Course ID
        if (
            !Number.isInteger(Number(courseId)) ||
            Number(courseId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }


        // 4. Validate Semester ID
        if (
            !Number.isInteger(Number(academicSemesterId)) ||
            Number(academicSemesterId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid academic semester ID"
            });
        }


        // 5. Check offering exists
        const existingOffering =
            await courseOfferingService.getCourseOfferingById(id);

        if (!existingOffering) {
            return res.status(404).json({
                message: "Course offering not found"
            });
        }


        // 6. Check course exists
        const course =
            await prisma.course.findUnique({
                where: {
                    id: Number(courseId)
                }
            });

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }


        // 7. Check semester exists
        const semester =
            await prisma.academicSemester.findUnique({
                where: {
                    id: Number(academicSemesterId)
                },
                include: {
                    program: true
                }
            });

        if (!semester) {
            return res.status(404).json({
                message: "Academic semester not found"
            });
        }


        // 8. Check course repetition
        const duplicateOffering =
            await prisma.courseOffering.findFirst({
                where: {
                    courseId: Number(courseId),
                    academicSemester: {
                        programId: semester.programId
                    },
                    NOT: {
                        id: Number(id)
                    }
                }
            });


        if (duplicateOffering) {
            return res.status(409).json({
                message:
                    "This course is already offered in another semester of this program"
            });
        }


        // 9. Update
        const offering =
            await courseOfferingService.updateCourseOffering(
                id,
                courseId,
                academicSemesterId
            );


        res.status(200).json(offering);

    } catch (error) {
        console.error(error);


        if (error.code === "P2002") {
            return res.status(409).json({
                message:
                    "This course is already offered in this semester"
            });
        }


        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Course offering not found"
            });
        }


        res.status(500).json({
            message: "Failed to update course offering"
        });
    }
};


// DELETE course offering
const deleteCourseOffering = async (req, res) => {
    try {
        const { id } = req.params;


        // 1. Validate ID
        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid course offering ID"
            });
        }


        // 2. Check offering exists
        const existingOffering =
            await courseOfferingService.getCourseOfferingById(id);

        if (!existingOffering) {
            return res.status(404).json({
                message: "Course offering not found"
            });
        }


        // 3. Delete
        await courseOfferingService.deleteCourseOffering(id);


        res.status(200).json({
            message: "Course offering deleted successfully"
        });

    } catch (error) {
        console.error(error);


        // Related records exist
       if (error.code === "P2039") {
    return res.status(409).json({
        message:
            "Cannot delete course offering because it has related records"
    });
}

        res.status(500).json({
            message: "Failed to delete course offering"
        });
    }
};


module.exports = {
    getAllCourseOfferings,
    getCourseOfferingById,
    createCourseOffering,
    updateCourseOffering,
    deleteCourseOffering
};