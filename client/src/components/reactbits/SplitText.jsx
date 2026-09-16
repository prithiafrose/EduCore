import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function SplitText({
  text = "",
  delay = 40,
  stagger = 0.03,
  className = "",
  by = "char",
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const elements = by === "char" ? text.split("") : text.split(" ");

  return (
    <span ref={ref} className={className}>
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          className="inline-block will-change-[transform,filter,opacity]"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 18, filter: "blur(6px)" }
          }
          transition={{
            duration: 0.5,
            delay: delay / 1000 + index * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {segment === " " ? "\u00A0" : segment}
        </motion.span>
      ))}
    </span>
  );
}

export default SplitText;