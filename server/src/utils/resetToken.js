const crypto = require("crypto");

// Generate a raw random token to send to the user
const generateResetToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

// Hash a raw token so only the digest is stored in the database
const hashResetToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

module.exports = {
    generateResetToken,
    hashResetToken
};