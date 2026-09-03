const prisma = require("../config/prisma");
const {
    comparePassword,
    hashPassword
} = require("../utils/hash");
const jwt = require("jsonwebtoken");


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
                    role: user.role
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
// TEMPORARY - RESET TEACHER PASSWORD
const resetTeacherPassword = async (req, res) => {
    try {
        const email = "rahim@university.edu";
        const newPassword = "Teacher@123";

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

module.exports = {
    login,
     register,
         resetTeacherPassword

};