const prisma = require("../config/prisma");
const {
    comparePassword,
    hashPassword
} = require("../utils/hash");
const jwt = require("jsonwebtoken");
const {
    blacklistToken
} = require("../utils/tokenBlacklist");


// LOGIN
const login = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;


        // Required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required"
            });
        }


        // Find user
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });


        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }


        // Compare password
        const passwordMatch =
            await comparePassword(
                password,
                user.passwordHash
            );


        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }


        // Check user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account has been deactivated. Contact administration."
            });
        }


        // Generate JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        // Response
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatarUrl: user.avatarUrl,
                    role: user.role,
                    isActive: user.isActive
                }
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};
// REGISTER STUDENT
const register = async (req, res) => {
    try {
        const {
            name,
            studentId,
            email,
            programId,
            password
        } = req.body;

        // Required fields
        if (
            !name ||
            !studentId ||
            !email ||
            !programId ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, student ID, email, program and password are required"
            });
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Check if student ID already exists
        const existingStudent =
            await prisma.student.findUnique({
                where: {
                    studentId
                }
            });

        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "Student ID already exists"
            });
        }

        // Hash password
        const { hashPassword } = require("../utils/hash");

        const passwordHash =
            await hashPassword(password);

        // Create User + Student together
        const result = await prisma.$transaction(
            async (tx) => {

                const user = await tx.user.create({
                    data: {
                        email,
                        passwordHash,
                        role: "STUDENT"
                    }
                });

                const student =
                    await tx.student.create({
                        data: {
                            name,
                            studentId,
                            email,
                            programId: Number(programId),
                            userId: user.id
                        }
                    });

                return {
                    user,
                    student
                };
            }
        );

        res.status(201).json({
            success: true,
            message: "Student registration successful",
            data: {
                student: result.student
            }
        });

    } catch (error) {

        console.error(error);

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message:
                    "Email or student ID already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};
// RESET TEACHER PASSWORD (admin only)
const resetTeacherPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "email and newPassword are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Teacher user not found"
            });
        }

        if (user.role !== "TEACHER") {
            return res.status(400).json({
                success: false,
                message: "This user is not a teacher"
            });
        }

        const passwordHash =
            await hashPassword(newPassword);

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                passwordHash
            }
        });

        res.status(200).json({
            success: true,
            message: "Teacher password reset successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to reset teacher password"
        });
    }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;

        // Required fields
        if (!userId || !oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "userId, oldPassword and newPassword are required"
            });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify old password
        const passwordMatch =
            await comparePassword(
                oldPassword,
                user.passwordHash
            );

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        // Validate new password
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        if (newPassword === oldPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be different from the old password"
            });
        }

        // Hash new password
        const newPasswordHash =
            await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newPasswordHash }
        });

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to change password"
        });
    }
};


// GET CURRENT PROFILE
const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.user.userId)
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatarUrl: user.avatarUrl,
                    role: user.role,
                    isActive: user.isActive,
                    createdAt: user.createdAt
                }
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to load profile"
        });
    }
};

// UPDATE PROFILE (name / email / avatarUrl for the authenticated user)
const updateProfile = async (req, res) => {
    try {
        const userId = Number(req.user.userId);
        const { name, email, avatarUrl } = req.body;

        if (email !== undefined) {
            if (
                !email ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format"
                });
            }
        }

        if (
            name !== undefined &&
            typeof name !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Name must be a string"
            });
        }

        if (avatarUrl !== undefined && avatarUrl) {
            if (
                !/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(
                    avatarUrl
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid image format"
                });
            }

            if (avatarUrl.length > 5000000) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Image is too large. Please use a smaller picture."
                });
            }
        }

        const data = {};

        if (name !== undefined) {
            data.name = name.trim() || null;
        }

        if (email !== undefined) {
            data.email = email.trim().toLowerCase();
        }

        if (avatarUrl !== undefined) {
            data.avatarUrl = avatarUrl || null;
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data
        });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    name: updatedUser.name,
                    avatarUrl: updatedUser.avatarUrl,
                    role: updatedUser.role,
                    isActive: updatedUser.isActive
                }
            }
        });

    } catch (error) {
        console.error(error);

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};


// LOGOUT
const logoutUser = async (req, res) => {
    try {

        if (req.token) {
            blacklistToken(req.token);
        }

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};

module.exports = {
    login,
     register,
         resetTeacherPassword,
         changePassword,
         getProfile,
         updateProfile,
         logoutUser

};