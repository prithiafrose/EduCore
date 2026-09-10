// EduCore AI — chat controller
// Authentication (JWT + role) is enforced by the global `authenticate`
// middleware; the user identity always comes from the verified JWT.

const aiService = require("../services/ai.service");
const atRiskService = require("../services/atRisk.service");

const chat = async (req, res) => {
    const { message } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({
            success: false,
            message: "Message is required."
        });
    }

    try {
        const data = await aiService.handleChat({
            userId: req.user.userId,
            role: req.user.role,
            message: message.trim()
        });

        return res.json({ success: true, data });
    } catch (error) {
        // Never leak stack traces, DB errors, or API keys to the client.
        console.error("EduCore AI chat error:", error?.message || error);

        return res.json({
            success: true,
            data: {
                reply:
                    "Sorry, I couldn't process that request right now. Please try again.",
                intent: "GENERAL"
            }
        });
    }
};

const checkAtRisk = async (req, res) => {
    try {
        const data = await atRiskService.runAtRiskCheck({
            userId: req.user.userId,
            role: req.user.role
        });

        return res.json({ success: true, data });
    } catch (error) {
        console.error("EduCore at-risk check error:", error?.message || error);

        return res.status(500).json({
            success: false,
            message: "Failed to run at-risk check."
        });
    }
};

module.exports = {
    chat,
    checkAtRisk
};