// EduCore AI — orchestrates intent detection, authorized data retrieval,
// and LLM (or deterministic fallback) reply generation.
//
// The OpenAI key is read ONLY from the server environment.

const { detectIntent } = require("./ai.intent.service");
const {
    getData,
    describeData
} = require("./ai.data.service");
const {
    buildSystemPrompt,
    buildContext
} = require("./ai.prompt.service");

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const hasApiKey = () => Boolean(process.env.OPENAI_API_KEY);

// When the model is unavailable (no key / API error) or the intent has no
// EduCore data, produce a safe, grounded answer so the assistant never
// fabricates database information.
const NO_DATA_REPLIES = {
    GENERAL:
        "I can help with your schedule, attendance, exams, results, payments, courses, notices, and general academic questions. I couldn't find EduCore data for that question, but if you ask a general academic question (for example \"explain normalization\"), I'll explain it for you.",
    GENERATE_NOTICE:
        "I can draft that notice for you once the server's OPENAI_API_KEY is configured. Ask me again after the API key is set up.",
    GENERATE_QUIZ:
        "I can generate MCQs, quizzes and practice questions once the server's OPENAI_API_KEY is configured.",
    TEACHER_ASSESSMENT:
        "I couldn't find assessment mark data for your courses in EduCore.",
    TEACHER_PERFORMANCE:
        "I couldn't find performance data for your courses in EduCore."
};

const buildFallbackReply = ({ intent, role, data, message }) => {
    const described = describeData({ role, intent, data });

    if (described) {
        return described;
    }

    return (
        NO_DATA_REPLIES[intent] ||
        "I couldn't find that in EduCore. Try asking about your schedule, attendance, exams, results, payments, courses, or notices."
    );
};

const askOpenAI = async ({
    role,
    description,
    intent,
    message,
    data
}) => {
    // Lazy require so the module can be loaded before the SDK exists.
    const OpenAI = require("openai");
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const system = buildSystemPrompt({
        role,
        description
    });
    const context = buildContext(intent, data);
    const user =
        (context ? context + "\n\n" : "") +
        `User question: "${message}"`;

    const completion = await client.chat.completions.create({
        model: MODEL,
        temperature: 0.4,
        max_tokens: 800,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user }
        ]
    });

    return (
        completion.choices?.[0]?.message?.content ||
        ""
    );
};

const handleChat = async ({ userId, role, message }) => {
    const intent = detectIntent(message, role);

    // Only query the database when the intent actually needs EduCore data.
    const { data, description } = await getData({
        role,
        userId,
        intent,
        message
    });

    let reply = null;

    if (hasApiKey()) {
        try {
            reply = await askOpenAI({
                role,
                description,
                intent,
                message,
                data
            });
        } catch (err) {
            console.error(
                "EduCore AI — OpenAI request failed:",
                err?.message || err
            );
            reply = null;
        }
    }

    if (!reply || !reply.trim()) {
        reply = buildFallbackReply({
            intent,
            role,
            data,
            message
        });
    }

    return { reply, intent };
};

module.exports = {
    handleChat
};