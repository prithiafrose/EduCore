import AnimatedCard from "./AnimatedCard";
import AnimatedCounter from "../animations/AnimatedCounter";

const iconStyles = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  purple: "bg-purple-50 text-purple-600",
  rose: "bg-rose-50 text-rose-600",
  sky: "bg-sky-50 text-sky-600",
  green: "bg-green-50 text-green-600",
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
          <p className="text-sm font-medium text-slate-500">{label}</p>

          {loading ? (
            <div className="h-9 w-16 bg-slate-200 rounded mt-2 animate-pulse" />
          ) : (
            <h3 className="text-3xl font-bold text-slate-900 mt-2">
              {typeof value === "number" ? (
                <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
              ) : (
                `${prefix}${value}${suffix}`
              )}
            </h3>
          )}

          {hint && (
            <p className="text-xs text-slate-400 mt-2">{hint}</p>
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