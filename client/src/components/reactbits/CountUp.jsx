import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

const formatNumber = (value, separator = "") => {
  const parts = Math.abs(value).toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return parts.join(".");
};

function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  separator = "",
}) {
  const ref = useRef(null);
  const endRef = useRef(null);
  const start = direction === "up" ? from : to;
  const end = direction === "up" ? to : from;
  const inView = useInView(ref, {
    once: true,
    margin: "0px 0px -40px 0px",
  });

  useEffect(() => {
    if (!inView) return;

    const controls = animate(start, end, {
      duration,
      delay,
      ease: "easeOut",
      onUpdate(value) {
        endRef.current.value = value;
        const rounded = Math.round(value);
        const text = formatNumber(rounded, separator);
        if (ref.current && ref.current.textContent !== text) {
          ref.current.textContent = text;
        }
      },
    });

    return () => controls.stop();
  }, [inView, start, end, duration, delay, separator]);

  return (
    <span
      ref={(node) => {
        ref.current = node;
        endRef.current = { value: start };
        if (node) node.textContent = formatNumber(start, separator);
      }}
      className={className}
    >
      {formatNumber(start, separator)}
    </span>
  );
}

export default CountUp;