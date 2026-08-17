const prisma = require("../config/prisma");


// GET all enrollments
const getAllEnrollments = async () => {
    return await prisma.enrollment.findMany({
        include: {
            student: true,
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            section: true
        },
        orderBy: {
            id: "asc"
        }
    });
};


// GET enrollment by ID
const getEnrollmentById = async (id) => {
    return await prisma.enrollment.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            student: true,
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            section: true
        }
    });
};


// CREATE enrollment
const createEnrollment = async (
    studentId,
    courseOfferingId,
    sectionId
) => {

    // Check student
    const student = await prisma.student.findUnique({
        where: {
            id: Number(studentId)
        }
    });

    if (!student) {
        throw new Error("Student not found");
    }


    // Check course offering
    const courseOffering =
        await prisma.courseOffering.findUnique({
            where: {
                id: Number(courseOfferingId)
            }
        });

    if (!courseOffering) {
        throw new Error("Course offering not found");
    }


    // If section is provided
    if (sectionId !== null && sectionId !== undefined) {

        const section = await prisma.section.findUnique({
            where: {
                id: Number(sectionId)
            }
        });

        if (!section) {
            throw new Error("Section not found");
        }


        // IMPORTANT:
        // Section must belong to this CourseOffering
        if (
            section.courseOfferingId !==
            Number(courseOfferingId)
        ) {
            throw new Error(
                "Section does not belong to this course offering"
            );
        }
    }


    // Check duplicate enrollment
    const existingEnrollment =
        await prisma.enrollment.findUnique({
            where: {
                studentId_courseOfferingId: {
                    studentId: Number(studentId),
                    courseOfferingId: Number(courseOfferingId)
                }
            }
        });

    if (existingEnrollment) {
        throw new Error(
            "Student is already enrolled in this course offering"
        );
    }


    return await prisma.enrollment.create({
        data: {
            studentId: Number(studentId),
            courseOfferingId: Number(courseOfferingId),
            sectionId:
                sectionId === null ||
                sectionId === undefined
                    ? null
                    : Number(sectionId)
        },
        include: {
            student: true,
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            section: true
        }
    });
};


// UPDATE enrollment
const updateEnrollment = async (
    id,
    studentId,
    courseOfferingId,
    sectionId
) => {

    const existingEnrollment =
        await prisma.enrollment.findUnique({
            where: {
                id: Number(id)
            }
        });

    if (!existingEnrollment) {
        throw new Error("Enrollment not found");
    }


    // Check student
    const student = await prisma.student.findUnique({
        where: {
            id: Number(studentId)
        }
    });

    if (!student) {
        throw new Error("Student not found");
    }


    // Check course offering
    const courseOffering =
        await prisma.courseOffering.findUnique({
            where: {
                id: Number(courseOfferingId)
            }
        });

    if (!courseOffering) {
        throw new Error("Course offering not found");
    }


    // Check section
    if (sectionId !== null && sectionId !== undefined) {

        const section = await prisma.section.findUnique({
            where: {
                id: Number(sectionId)
            }
        });

        if (!section) {
            throw new Error("Section not found");
        }

        if (
            section.courseOfferingId !==
            Number(courseOfferingId)
        ) {
            throw new Error(
                "Section does not belong to this course offering"
            );
        }
    }


    // Check duplicate enrollment
    const duplicate =
        await prisma.enrollment.findFirst({
            where: {
                studentId: Number(studentId),
                courseOfferingId: Number(courseOfferingId),
                NOT: {
                    id: Number(id)
                }
            }
        });

    if (duplicate) {
        throw new Error(
            "Student is already enrolled in this course offering"
        );
    }


    return await prisma.enrollment.update({
        where: {
            id: Number(id)
        },
        data: {
            studentId: Number(studentId),
            courseOfferingId: Number(courseOfferingId),
            sectionId:
                sectionId === null ||
                sectionId === undefined
                    ? null
                    : Number(sectionId)
        },
        include: {
            student: true,
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            section: true
        }
    });
};


// DELETE enrollment
const deleteEnrollment = async (id) => {

    const existingEnrollment =
        await prisma.enrollment.findUnique({
            where: {
                id: Number(id)
            }
        });

    if (!existingEnrollment) {
        throw new Error("Enrollment not found");
    }

    return await prisma.enrollment.delete({
        where: {
            id: Number(id)
        }
    });
};


module.exports = {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
};