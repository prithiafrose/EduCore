const authService = require("../services/auth.service");
const {
    comparePassword,
    hashPassword
} = require("../utils/hash");
const jwt = require("jsonwebtoken");
const {
    blacklistToken
} = require("../utils/tokenBlacklist");
const {
    sendMail
} = require("../utils/mailer");
const {
    generateResetToken,
    hashResetToken
} = require("../utils/resetToken");
const {
    validateEmail
} = require("../utils/email");

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes


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
        const user = await authService.findUserByEmail(email);


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

        // Validate email format (rejects invalid / disposable addresses)
        const emailError = validateEmail(email);

        if (emailError) {
            return res.status(400).json({
                success: false,
                message: emailError
            });
        }

        // Check if email already exists
        const existingUser =
            await authService.findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Check if student ID already exists
        const existingStudent =
            await authService.findStudentByStudentId(studentId);

        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "Student ID already exists"
            });
        }

        // Hash password
        const passwordHash =
            await hashPassword(password);

        // Create User + Student together
        const result = await authService.createUserWithStudent({
            email,
            passwordHash,
            name,
            studentId,
            programId
        });

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

        const user = await authService.findUserByEmail(email);

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

        await authService.updateUserPassword(user.id, passwordHash);

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
        const user = await authService.findUserById(userId);

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

        await authService.updateUserPassword(user.id, newPasswordHash);

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
        const user = await authService.findUserById(req.user.userId);

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

            const emailError = validateEmail(email);

            if (emailError) {
                return res.status(400).json({
                    success: false,
                    message: emailError
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
            const normalizedEmail =
                email.trim().toLowerCase();

            const existingUser =
                await authService.findUserEmailById(userId);

            // Skip the write when the email is unchanged,
            // so the unique constraint is never re-checked
            // against the user's own (case-normalized) address.
            if (
                !existingUser ||
                existingUser.email.toLowerCase() !==
                    normalizedEmail
            ) {
                data.email = normalizedEmail;
            }
        }

        if (avatarUrl !== undefined) {
            data.avatarUrl = avatarUrl || null;
        }

        const updatedUser = await authService.updateUserProfile(userId, data);

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

// FORGOT PASSWORD (request password reset link by email)
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "email is required"
            });
        }

        const emailError = validateEmail(email);

        if (emailError) {
            return res.status(400).json({
                success: false,
                message: emailError
            });
        }

        const user = await authService.findUserByEmail(email.trim().toLowerCase());

        // Always return the same response whether or not the user exists,
        // to avoid leaking which emails are registered.
        if (user) {
            // Invalidate any previous reset tokens for this user
            await authService.deletePasswordResetTokensByUser(user.id);

            const rawToken = generateResetToken();
            const tokenHash = hashResetToken(rawToken);

            await authService.createPasswordResetToken({
                token: tokenHash,
                userId: user.id,
                expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS)
            });

            const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5176"}/reset-password/${rawToken}`;

            const html =
                `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px">` +
                `<h2 style="color:#1e293b;margin:0 0 8px">EduCore — Password Reset</h2>` +
                `<p style="color:#475569;line-height:1.6">We received a request to reset the password for ` +
                `<strong>${user.email}</strong>. Click the button below to choose a new password. ` +
                `This link expires in <strong>30 minutes</strong>.</p>` +
                `<p style="margin:24px 0"><a href="${resetLink}" ` +
                `style="display:inline-block;background:#6366f1;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold">` +
                `Reset my password</a></p>` +
                `<p style="color:#94a3b8;font-size:13px">If you didn't request this, you can safely ignore this email.</p>` +
                `</div>`;

            await sendMail({
                to: user.email,
                subject: "EduCore — Reset your password",
                html
            });
        }

        res.status(200).json({
            success: true,
            message: "If an account exists for that email, a password reset link has been sent."
        });

    } catch (error) {
        console.error("Forgot password error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send password reset email"
        });
    }
};

// RESET PASSWORD (using token from the reset email)
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "token and newPassword are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        const resetRecord = await authService.findPasswordResetRecordByToken(hashResetToken(token));

        if (
            !resetRecord ||
            resetRecord.usedAt ||
            resetRecord.expiresAt < new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        const passwordHash = await hashPassword(newPassword);

        await authService.applyPasswordReset({
            userId: resetRecord.userId,
            passwordHash,
            tokenId: resetRecord.id
        });

        res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now sign in."
        });

    } catch (error) {
        console.error("Reset password error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to reset password"
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
         logoutUser,
         forgotPassword,
         resetPassword

};