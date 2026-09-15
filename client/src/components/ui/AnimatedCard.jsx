import { motion } from "framer-motion";

function AnimatedCard({ children, className = "", hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
            }
          : undefined
      }
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedCard;