import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease },
  },
};

function PageHeader({ title, subtitle, actions }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
      className="ec-page-header"
    >
      <div className="min-w-0">
        <motion.h1 variants={item} className="ec-page-header-title">
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p variants={item} className="ec-page-header-subtitle">
            {subtitle}
          </motion.p>
        )}
      </div>

      {actions && (
        <motion.div variants={item} className="ec-page-header-actions">
          {actions}
        </motion.div>
      )}
    </motion.div>
  );
}

export default PageHeader;