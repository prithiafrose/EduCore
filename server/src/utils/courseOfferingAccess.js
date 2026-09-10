const prisma = require("../config/prisma");

// Check whether a user is allowed to access a course offering
// (admin, teacher of the offering, or enrolled student)
const canAccessCourseOffering = async (
    user,
    courseOfferingId
) => {
    if (!user || !courseOfferingId) return false;

    const offeringId = Number(courseOfferingId);

    if (user.role === "ADMIN") return true;

    if (user.role === "TEACHER") {
        const assignment =
            await prisma.teacherAssignment.findFirst({
                where: {
                    courseOfferingId: offeringId,
                    teacher: {
                        userId: user.userId
                    }
                },
                select: {
                    id: true
                }
            });

        return !!assignment;
    }

    if (user.role === "STUDENT") {
        const enrollment =
            await prisma.enrollment.findFirst({
                where: {
                    courseOfferingId: offeringId,
                    student: {
                        userId: user.userId
                    }
                },
                select: {
                    id: true
                }
            });

        return !!enrollment;
    }

    return false;
};

module.exports = { canAccessCourseOffering };