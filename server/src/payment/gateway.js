const sessions = new Map();

// Create a payment session for a payment
const createSession = ({
    paymentId,
    studentId,
    amount,
    description
}) => {
    const reference =
        "PAY_" +
        Date.now().toString(36).toUpperCase() +
        "_" +
        Math.random().toString(36).slice(2, 8).toUpperCase();

    sessions.set(reference, {
        paymentId,
        studentId,
        amount: Number(amount),
        currency: "BDT",
        description: description || "University fee",
        status: "PENDING",
        createdAt: Date.now()
    });

    return { reference };
};

// Get a session by reference
const getSession = (reference) => {
    return sessions.get(reference);
};

// Complete a pending session (gateway confirms payment)
const completeSession = (reference) => {
    const session = sessions.get(reference);

    if (session) {
        session.status = "PAID";
        session.paidAt = new Date().toISOString();
    }

    return session;
};

// Configured provider (swappable in .env)
const getProviderName = () => {
    return (
        process.env.PAYMENT_PROVIDER || "sandbox"
    ).toLowerCase();
};

// Checkout URL for the sandbox provider
const getCheckoutUrl = (reference, req) => {
    const base =
        req.protocol + "://" + req.get("host");

    return (
        base +
        "/api/payments/sandbox/checkout/" +
        encodeURIComponent(reference)
    );
};

// Fair-use expiration for sessions (24 hours)
const cleanupSessions = () => {
    const limit =
        Date.now() - 24 * 60 * 60 * 1000;

    for (const [reference, session] of sessions) {
        if (session.createdAt < limit) {
            sessions.delete(reference);
        }
    }
};

module.exports = {
    createSession,
    getSession,
    completeSession,
    getProviderName,
    getCheckoutUrl,
    cleanupSessions
};