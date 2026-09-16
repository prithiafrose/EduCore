import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  ChevronRight,
  LogOut,
  Menu,
} from "lucide-react";

function TopBar({
  portal = "Portal",
  pageTitle = "Dashboard",
  crumb,
  role = "User",
  initial = "U",
  email = "",
  avatar = "",
  onMenuClick,
  notifications = [],
  unread = 0,
  onMarkAllRead,
}) {
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (barRef.current && !barRef.current.contains(event.target)) {
        setBellOpen(false);
        setUserOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (value) => {
    if (!value) return "";

    return new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-30 bg-slate-950/70 backdrop-blur border-b border-white/5"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="lg:hidden w-10 h-10 shrink-0 rounded-lg bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center hover:bg-white/10 transition"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0">
            {crumb && (
              <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 mb-0.5">
                <span className="truncate">{portal}</span>

                <ChevronRight size={12} className="shrink-0" />

                <span className="truncate">{crumb}</span>

                <ChevronRight size={12} className="shrink-0" />

                <span className="truncate text-slate-300 font-medium">
                  {pageTitle}
                </span>
              </div>
            )}

            <h2 className="text-xl font-bold tracking-tight text-white truncate">
              {pageTitle}
            </h2>
          </div>
        </div>

        <div ref={barRef} className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setUserOpen(false);
                setBellOpen((open) => !open);
              }}
              aria-label={`Notifications (${unread} unread)`}
              className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center hover:bg-white/10 transition"
            >
              <Bell size={18} />

              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-600 text-white text-[10px] font-semibold flex items-center justify-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            <AnimatePresence>
              {bellOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-xl bg-slate-900/95 border border-white/10 shadow-2xl shadow-black/40 backdrop-blur z-40"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-semibold text-white">
                      Notifications
                    </p>

                    {unread > 0 && (
                      <button
                        type="button"
                        onClick={onMarkAllRead}
                        className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                      >
                        <CheckCheck size={14} />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto ai-scroll">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-slate-400">
                          No notifications yet.
                        </p>
                      </div>
                    ) : (
                      notifications
                        .slice(0, 6)
                        .map((notification) => (
                          <div
                            key={notification.id}
                            className="px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm font-medium text-slate-100">
                                {notification.title}
                              </p>

                              {!notification.isRead && (
                                <span className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                              )}
                            </div>

                            {notification.message && (
                              <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">
                                {notification.message}
                              </p>
                            )}

                            <p className="mt-1 text-[11px] text-slate-500">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                        ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setBellOpen(false);
                setUserOpen((open) => !open);
              }}
              aria-label="Open user menu"
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 pl-1 pr-2 py-1 hover:bg-white/10 transition"
            >
              {avatar ? (
                <span className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0">
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </span>
              ) : (
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-sm font-semibold">
                  {initial}
                </span>
              )}

              <span className="hidden md:block text-left">
                <span className="block text-xs font-semibold text-slate-100 max-w-[140px] truncate">
                  {email}
                </span>

                <span className="block text-[11px] text-slate-500">
                  {role}
                </span>
              </span>
            </button>

            <AnimatePresence>
              {userOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-60 rounded-xl bg-slate-900/95 border border-white/10 shadow-2xl shadow-black/40 backdrop-blur z-40"
                >
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-medium text-white truncate">
                      {email || "Signed in user"}
                    </p>

                    <p className="text-xs text-slate-500 mt-0.5">
                      {role} · EduCore
                    </p>
                  </div>

                  <div className="p-1.5">
                    <Link
                      to="/logout"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                    >
                      <LogOut size={16} />
                      Logout
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default TopBar;