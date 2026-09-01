const bcrypt = require("bcrypt");


// Hash password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};


// Compare password with hash
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};


module.exports = {
    hashPassword,
    comparePassword
};