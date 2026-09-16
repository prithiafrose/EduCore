import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { sendAIMessage } from "../services/aiApi";

const PUBLIC_PATHS = ["/", "/home", "/login", "/register", "/logout"];

const WELCOME = {
  role: "ai",
  content:
    "Hi! I'm EduCore AI \uD83D\uDC4B\nI can help you with your schedule, attendance, exams, results, payments, courses, and academic questions. Just ask!",
};

const QUICK_PROMPTS = {
  STUDENT: [
    "\uD83D\uDCC5 What's my next class?",
    "\uD83D\uDCCA What's my attendance?",
    "\uD83D\uDCDD What's my current result?",
    "\uD83D\uDCB0 How much payment is due?",
    "\uD83D\uDCDA What courses am I taking?",
  ],
  TEACHER: [
    "\uD83D\uDCC5 What's my schedule?",
    "\uD83D\uDCCA Which students are below 75%?",
    "\uD83D\uDCC8 How did my students perform?",
    "\uD83D\uDCDD Show assessment marks",
  ],
  ADMIN: [
    "\uD83D\uDCCA How many students are enrolled?",
    "\uD83D\uDCB0 Show payment statistics",
    "\uD83D\uDCDD Give me an attendance summary",
    "\uD83D\uDDD2 How many courses are there?",
  ],
};

const getRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role || null;
  } catch {
    return null;
  }
};

const hasSession = () => Boolean(localStorage.getItem("token"));

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function AiAssistant() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const role = getRole();
  const loggedIn = hasSession();
  const isPublic =
    !loggedIn || PUBLIC_PATHS.includes(location.pathname);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking, open]);

  useEffect(() => {
    if (open && !thinking) {
      inputRef.current?.focus();
    }
  }, [open, thinking]);

  const handleOpen = () => {
    setMessages((prev) => (prev.length === 0 ? [WELCOME] : prev));
    setOpen(true);
  };

  const handleSend = async (raw) => {
    const text = String(raw ?? input).trim();
    if (!text || thinking) {
      return;
    }

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setThinking(true);

    try {
      const response = await sendAIMessage(text);
      const reply = response?.data?.reply;
      if (!reply) {
        throw new Error("Empty reply");
      }
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: reply },
      ]);
    } catch {
      setError(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Sorry, I couldn't process that request right now. Please try again.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleClear = () => {
    setError(null);
    setMessages([WELCOME]);
    setInput("");
  };

  if (isPublic) {
    return null;
  }

  const prompts = QUICK_PROMPTS[role] || [];

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-2xl text-white shadow-xl shadow-indigo-600/30 transition hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
          aria-label="Open EduCore AI"
          title="EduCore AI"
        >
          ✦
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[min(560px,calc(100vh-3rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/90 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-base">
                ✦
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">
                  EduCore AI
                </p>
                <p className="text-xs text-slate-400">
                  {role === "STUDENT"
                    ? "Your campus assistant"
                    : role === "TEACHER"
                      ? "Teaching assistant"
                      : "System assistant"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 1 && (
                <button
                  onClick={handleClear}
                  className="rounded-lg px-2 py-1 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                  title="Clear conversation"
                >
                  ↺ Clear
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="ai-scroll flex-1 space-y-3 overflow-y-auto bg-slate-950 px-4 py-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {msg.role === "user" ? (
                  <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-gradient-to-br from-indigo-500 to-violet-600 px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-md">
                    {msg.content}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm leading-relaxed text-slate-200 shadow-sm"
                  >
                    {msg.content}
                  </motion.div>
                )}
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-3.5 py-2 shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}

            {error && (
              <p className="text-center text-xs text-slate-400">
                Something went wrong — please try again.
              </p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 2 && prompts.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-white/5 bg-slate-900/50 px-3 py-2">
              {prompts.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  disabled={thinking}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 transition hover:border-indigo-400/40 hover:bg-indigo-500/15 hover:text-indigo-200 disabled:opacity-50"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-white/5 bg-slate-900/60 px-3 py-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask EduCore AI…"
              disabled={thinking}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={thinking || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default AiAssistant;