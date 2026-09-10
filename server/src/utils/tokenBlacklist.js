const jwt = require("jsonwebtoken");

const blacklistedTokens = new Map();

const blacklistToken = (token) => {
    try {
        const decoded = jwt.decode(token);

        const exp = decoded && decoded.exp
            ? decoded.exp * 1000
            : Date.now() + 24 * 60 * 60 * 1000;

        blacklistedTokens.set(token, exp);
    } catch (error) {
        blacklistedTokens.set(token, Date.now());
    }
};

const isTokenBlacklisted = (token) => {
    if (!blacklistedTokens.has(token)) {
        return false;
    }

    const exp = blacklistedTokens.get(token);

    if (exp <= Date.now()) {
        blacklistedTokens.delete(token);

        return false;
    }

    return true;
};

const clearExpiredTokens = () => {
    const now = Date.now();

    for (const [token, exp] of blacklistedTokens) {
        if (exp <= now) {
            blacklistedTokens.delete(token);
        }
    }
};

module.exports = {
    blacklistToken,
    isTokenBlacklisted,
    clearExpiredTokens
};