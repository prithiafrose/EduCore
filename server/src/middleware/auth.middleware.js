const jwt = require("jsonwebtoken");


const authenticate = (req, res, next) => {
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


        // Store authenticated user
        req.user = decoded;


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