import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 32,
  duration = 0.6,
  once = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "0px 0px -60px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;