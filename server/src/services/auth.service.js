const prisma = require("../config/prisma");

// FIND user by email
const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email }
    });
};

// FIND user by ID
const findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id: Number(id) }
    });
};

// FIND student profile by student ID
const findStudentByStudentId = async (studentId) => {
    return await prisma.student.findUnique({
        where: { studentId }
    });
};

// CREATE user + student profile together (student registration)
const createUserWithStudent = async ({
    email,
    passwordHash,
    name,
    studentId,
    programId
}) => {
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email,
                passwordHash,
                role: "STUDENT"
            }
        });

        const student = await tx.student.create({
            data: {
                name,
                studentId,
                email,
                programId: Number(programId),
                userId: user.id
            }
        });

        return { user, student };
    });
};

// UPDATE user password
const updateUserPassword = async (userId, passwordHash) => {
    return await prisma.user.update({
        where: { id: Number(userId) },
        data: { passwordHash }
    });
};

// UPDATE user profile (name / email / avatarUrl)
const updateUserProfile = async (userId, data) => {
    return await prisma.user.update({
        where: { id: Number(userId) },
        data
    });
};

// FIND user email by ID (for profile update duplicate check)
const findUserEmailById = async (userId) => {
    return await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { email: true }
    });
};

// DELETE all password reset tokens for a user
const deletePasswordResetTokensByUser = async (userId) => {
    return await prisma.passwordResetToken.deleteMany({
        where: { userId: Number(userId) }
    });
};

// CREATE a password reset token record
const createPasswordResetToken = async ({
    token,
    userId,
    expiresAt
}) => {
    return await prisma.passwordResetToken.create({
        data: {
            token,
            userId: Number(userId),
            expiresAt
        }
    });
};

// FIND a password reset record by hashed token (with user)
const findPasswordResetRecordByToken = async (tokenHash) => {
    return await prisma.passwordResetToken.findUnique({
        where: { token: tokenHash },
        include: { user: true }
    });
};

// Apply a password reset: update password + mark token used (atomic)
const applyPasswordReset = async ({ userId, passwordHash, tokenId }) => {
    return await prisma.$transaction([
        prisma.user.update({
            where: { id: Number(userId) },
            data: { passwordHash }
        }),
        prisma.passwordResetToken.update({
            where: { id: Number(tokenId) },
            data: { usedAt: new Date() }
        })
    ]);
};

module.exports = {
    findUserByEmail,
    findUserById,
    findStudentByStudentId,
    createUserWithStudent,
    updateUserPassword,
    updateUserProfile,
    findUserEmailById,
    deletePasswordResetTokensByUser,
    createPasswordResetToken,
    findPasswordResetRecordByToken,
    applyPasswordReset
};