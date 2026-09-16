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
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45)",
            }
          : undefined
      }
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`bg-white/[0.03] rounded-2xl shadow-lg shadow-black/20 border border-white/10 backdrop-blur ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedCard;