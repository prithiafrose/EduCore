const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    return transporter;
};

// Send an email. Returns true when sent, false when SMTP is not configured
// (in which case the mail is logged to the console for development).
const sendMail = async ({ to, subject, html }) => {
    const smtpConfigured = Boolean(process.env.SMTP_HOST);

    if (!smtpConfigured) {
        console.log(
            "SMTP not configured — email not sent.\n" +
            `  To: ${to}\n` +
            `  Subject: ${subject}\n` +
            `  ---\n${html}\n  ---`
        );

        return false;
    }

    await getTransporter().sendMail({
        from: process.env.SMTP_FROM ||
            `"EduCore" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html
    });

    return true;
};

module.exports = {
    sendMail
};