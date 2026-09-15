import { motion } from "framer-motion";

function ProgressRing({
  value = 0,
  size = 96,
  strokeWidth = 8,
  color = "#6366f1",
  label = "",
  hint = "",
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const dashOffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />

          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-xl font-bold"
            style={{ color }}
          >
            {clamped}%
          </span>
        </div>
      </div>

      {label && (
        <p className="mt-2 text-sm font-medium text-slate-700">
          {label}
        </p>
      )}

      {hint && (
        <p className="text-xs text-slate-400 mt-0.5">{hint}</p>
      )}
    </div>
  );
}

export default ProgressRing;