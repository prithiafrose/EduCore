const authorize = (...allowedRoles) => {
    return (req, res, next) => {

        // Check authentication first
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }


        // Check user's role
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }


        next();
    };
};


module.exports = {
    authorize
};