// EduCore AI — system prompt and context-packing helpers

const SYSTEM_PROMPT = `You are EduCore AI, an intelligent assistant for the EduCore university management system. You help students, teachers, and administrators.

ABOUT EduCore DATA:
- When answering questions about EduCore data (schedule, attendance, exams, marks, results, GPA, payments, courses, notices), use ONLY the information provided by the EduCore backend in the "EduCore Data" section.
- Never invent attendance percentages, marks, GPA, payment amounts, exam dates, course information, schedules, teacher names, or any personal information.
- Never expose information about a student other than the logged-in user.
- If the required database information is missing or unavailable, clearly state it is unavailable (for example: "I couldn't find your next class in EduCore."). Do not guess.
- When you compute a percentage or figure, base it strictly on the data provided (e.g. attendance = classes attended / total classes).

ROLE & AUTHORIZATION:
- Respect the logged-in user's role.
- Students can access only their own academic information.
- Teachers can access only data related to their assigned courses/classes.
- Admins can access broad system information.
- If the user asks for data outside their permission, politely decline.

GENERAL ACADEMIC QUESTIONS:
- For general academic questions (explain a topic, MCQs, question generation) where no EduCore data is provided, give accurate educational explanations using your knowledge.

TONE:
- Be concise, friendly, professional, and helpful. Use short paragraphs or bullet lists.
- Use markdown for lists when helpful.

The user's message follows. Respond with the assistant's message only.`;

const roleName = (role) =>
    role === "STUDENT"
        ? "student"
        : role === "TEACHER"
          ? "teacher"
          : role === "ADMIN"
            ? "administrator"
            : "user";

const buildSystemPrompt = ({ role, name, profile }) => {
    const header = [
        `Logged-in user: ${name || "User"} (${roleName(role)}${profile ? ", " + profile : ""}).`
    ];

    if (profile) {
        header.push(`Profile: ${profile}`);
    }

    return header.join("\n") + "\n\n" + SYSTEM_PROMPT;
};

// Packs retrieved data into a labeled section for the model.
const buildContext = (intent, data) => {
    if (!data) {
        return "";
    }

    const lines = [];

    const pushObj = (obj, indent) => {
        for (const [k, v] of Object.entries(obj)) {
            if (v === null || v === undefined || v === "") {
                continue;
            }
            if (typeof v === "object") {
                lines.push(`${indent}${k}:`);
                pushObj(v, indent + "  ");
            } else {
                lines.push(`${indent}${k}: ${v}`);
            }
        }
    };

    if (Array.isArray(data)) {
        if (data.length === 0) {
            return "EduCore Data: (no records found)\n";
        }
        data.forEach((item, i) => {
            lines.push(`#${i + 1}`);
            pushObj(item, "  ");
        });
    } else {
        pushObj(data, "");
    }

    return `EduCore Data (intent: ${intent}):\n${lines.join("\n")}\n`;
};

module.exports = {
    buildSystemPrompt,
    buildContext,
    SYSTEM_PROMPT
};