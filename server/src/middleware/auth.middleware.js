const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const {
    isTokenBlacklisted
} = require("../utils/tokenBlacklist");


const authenticate = async (req, res, next) => {
    try {

        // Get Authorization header
        const authHeader = req.headers.authorization;


        // Check header exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required"
            });
        }


        // Check Bearer format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }


        // Extract token
        const token =
            authHeader.split(" ")[1];


        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required"
            });
        }


        // Verify token
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Check token was not invalidated on logout
        if (isTokenBlacklisted(token)) {
            return res.status(401).json({
                success: false,
                message: "Token has been invalidated"
            });
        }


        // Verify the user still exists and is active
        const dbUser = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                id: true,
                isActive: true
            }
        });


        if (!dbUser) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });
        }


        if (!dbUser.isActive) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account has been deactivated. Contact administration."
            });
        }


        // Store authenticated user
        req.user = decoded;

        req.user.isActive = dbUser.isActive;

        // Store the raw token (used by logout)
        req.token = token;


        // Continue
        next();

    } catch (error) {

        console.error(error);


        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired"
            });
        }


        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }


        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};


module.exports = {
    authenticate
};