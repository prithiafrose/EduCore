const prisma = require("../config/prisma");
const { comparePassword } = require("../utils/hash");
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


module.exports = {
    login
};