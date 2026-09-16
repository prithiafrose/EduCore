const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Common disposable / temporary email providers
const DISPOSABLE_DOMAINS = new Set([
    "mailinator.com",
    "guerrillamail.com",
    "guerrillamailblock.com",
    "grr.la",
    "pokemail.net",
    "spam4.me",
    "tempmail.com",
    "temp-mail.org",
    "temp-mail.io",
    "tempinbox.com",
    "tmpbox.net",
    "throwawaymail.com",
    "yopmail.com",
    "yopmail.fr",
    "ypmail.webarnak.fr.eu.org",
    "maildrop.cc",
    "getnada.com",
    "10minutemail.com",
    "10minutemail.net",
    "trashmail.com",
    "trashmail.io",
    "sharklasers.com",
    "mailnesia.com",
    "fakeinbox.com",
    "dispostable.com",
    "mytemp.email",
    "mailtemp.net",
    "emailondeck.com",
    "burnermail.io",
    "mintemail.com",
    "tempail.com",
    "1secmail.com",
    "maileater.com",
    "mailsac.com",
    "tmail.io",
    "okaymail.com",
    "mohmal.com",
    "mailprotech.com",
    "tmailor.com",
    "emailfake.com",
    "fakemail.net",
    "mailinator2.com",
    "emailtemporario.com.br",
    "tempr.email",
    "mailgolem.com",
    "dropmail.me",
    "mytempmail.com",
    "spambox.us",
    "gishpuppy.com",
    "chacuo.net",
    "moakt.com",
    "mytemp.email",
    "1stmail.com"
]);

const getEmailDomain = (email) => {
    const parts = String(email).trim().toLowerCase().split("@");

    return parts.length === 2 ? parts[1] : "";
};

const isValidEmailFormat = (email) => {
    return EMAIL_REGEX.test(String(email).trim());
};

const isDisposableEmail = (email) => {
    return DISPOSABLE_DOMAINS.has(getEmailDomain(email));
};

// Returns an error message when the email is invalid, otherwise null
const validateEmail = (email) => {
    if (!email || String(email).trim() === "") {
        return "Email is required";
    }

    if (!isValidEmailFormat(email)) {
        return "Please provide a valid email address";
    }

    if (isDisposableEmail(email)) {
        return "Temporary and disposable email addresses are not allowed";
    }

    return null;
};

module.exports = {
    EMAIL_REGEX,
    isValidEmailFormat,
    isDisposableEmail,
    validateEmail
};