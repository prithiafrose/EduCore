import AnimatedCard from "./AnimatedCard";
import AnimatedCounter from "../animations/AnimatedCounter";

const iconStyles = {
  indigo: "bg-indigo-500/15 text-indigo-300",
  emerald: "bg-emerald-500/15 text-emerald-300",
  amber: "bg-amber-500/15 text-amber-300",
  purple: "bg-purple-500/15 text-purple-300",
  rose: "bg-rose-500/15 text-rose-300",
  sky: "bg-sky-500/15 text-sky-300",
  green: "bg-emerald-500/15 text-emerald-300",
};

function StatCard({
  icon,
  label,
  value = 0,
  hint,
  accent = "indigo",
  loading = false,
  prefix = "",
  suffix = "",
}) {
  const iconClass = iconStyles[accent] || iconStyles.indigo;

  return (
    <AnimatedCard className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>

          {loading ? (
            <div className="h-9 w-16 bg-white/10 rounded mt-2 animate-pulse" />
          ) : (
            <h3 className="text-3xl font-bold text-white mt-2">
              {typeof value === "number" ? (
                <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
              ) : (
                `${prefix}${value}${suffix}`
              )}
            </h3>
          )}

          {hint && (
            <p className="text-xs text-slate-500 mt-2">{hint}</p>
          )}
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </AnimatedCard>
  );
}

export default StatCard;