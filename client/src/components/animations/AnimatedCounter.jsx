import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

function AnimatedCounter({ value, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    duration: 1.4,
    bounce: 0,
  });

  const display = useTransform(spring, (current) =>
    `${prefix}${Math.round(current).toLocaleString()}${suffix}`
  );

  useEffect(() => {
    if (inView) {
      motionValue.set(Number(value) || 0);
    }
  }, [inView, value, motionValue]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}

export default AnimatedCounter;