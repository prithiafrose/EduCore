// EduCore AI — declarative intent classification
// Ordered pattern rules; first match wins. Role-gated rules are evaluated
// before generic ones so teacher/admin questions resolve to their specific
// capabilities instead of the student-oriented intents.

const DEFAULT_INTENT = "GENERAL";

// Rules with `roles` are only considered for those roles.
const RULES = [
    // ---------- Role-specific ----------
    {
        intent: "GENERATE_QUIZ",
        roles: ["TEACHER"],
        test: /(generate|create|make|write|prepare).{0,40}(mcq|multiple choice|quiz|short question|question paper|question)/i
    },
    {
        intent: "GENERATE_NOTICE",
        roles: ["TEACHER"],
        test: /(write|create|draft|generate|prepare).{0,40}(notice|announcement)/i
    },
    {
        intent: "TEACHER_ATTENDANCE",
        roles: ["TEACHER"],
        test: /(attendance|below 75|absent|present|who is missing)/i
    },
    {
        intent: "TEACHER_PERFORMANCE",
        roles: ["TEACHER"],
        test: /(performance|average|highest|struggling|top student|bottom student|how did (my|the|our) students)/i
    },
    {
        intent: "TEACHER_ASSESSMENT",
        roles: ["TEACHER"],
        test: /(assessment (marks|summary|results)|missing marks|lack(ing)? marks|marks (of|for|summary)|mark list|submitted)/i
    },
    {
        intent: "ADMIN_ANALYTICS",
        roles: ["ADMIN"],
        test: /(how many (students|teachers|courses|enrollments)|statistics|stats|unpaid|total students|enrolled (students|count)|attendance summary|course statistics|payment statistics|analytics|dashboard overview)/i
    },

    // ---------- Generic ----------
    {
        intent: "NEXT_CLASS",
        test: /(next (class|session|lecture)|where is (my|the) next|who teaches (my|the) next)/i
    },
    {
        intent: "SCHEDULE",
        test: /(routine|timetable|schedule|classes (today|tomorrow|this week)|today'?s class|class(es)? do i have|when is (my|the) .{0,40} class|what classes)/i
    },
    {
        intent: "ATTENDANCE",
        test: /(attendance|attend(ed|ing)?|miss(ed)?|absent|below 75|present class)/i
    },
    {
        intent: "PAYMENT",
        test: /(pay(ment)?s?|fees?|due|dues|owe|outstanding|unpaid|paid|receipt|afford)/i
    },
    {
        intent: "GRADE",
        test: /(need (in|for|to)|what (do|marks) .{0,20}need|can i still get|to get (an|a)|get an? (a\+?|a|b\+?|c)\b)/i
    },
    {
        intent: "MARKS",
        test: /(marks|scored|grades|what did i get|assessment (marks|results)|activity)/i
    },
    {
        intent: "GPA",
        test: /\b(gpa|cgpa|grade point)\b/i
    },
    {
        intent: "RESULT",
        test: /(results?|transcript|performance (summary|overview)|how (am|are) i (doing|performing)|current (result|status|total))/i
    },
    {
        intent: "EXAM",
        test: /\b(exam|examination|midterm|mid[- ]term|final)\b/i
    },
    {
        intent: "COURSE",
        test: /(enrolled in|registered courses|who teaches|how many credits|what courses|which courses|taking this semester|courses? list)/i
    },
    {
        intent: "NOTICE",
        test: /(notice|announcement|important (update|information)|deadline|news)/i
    }
];

/**
 * Classify a user question into one of the EduCore AI intents.
 * @param {string} message
 * @param {"STUDENT"|"TEACHER"|"ADMIN"} role
 * @returns {string} intent
 */
const detectIntent = (message, role) => {
    const text = String(message || "").trim();

    if (!text) {
        return DEFAULT_INTENT;
    }

    const roleSpecific = RULES.filter(
        (rule) => rule.roles && rule.roles.includes(role)
    );
    const generic = RULES.filter((rule) => !rule.roles);

    for (const rule of [...roleSpecific, ...generic]) {
        if (rule.test.test(text)) {
            return rule.intent;
        }
    }

    return DEFAULT_INTENT;
};

module.exports = {
    detectIntent,
    DEFAULT_INTENT
};