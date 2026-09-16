function DonutChart({
  data = [],
  size = 160,
  strokeWidth = 22,
  centerLabel = "",
}) {
  const total = data.reduce(
    (sum, item) => sum + (Number(item.value) || 0),
    0
  );

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = data.map((item, index) => {
    const previousTotal = data
      .slice(0, index)
      .reduce((sum, prev) => sum + (Number(prev.value) || 0), 0);

    const dash = total
      ? ((Number(item.value) || 0) / total) * circumference
      : 0;

    return {
      color: item.color,
      dash,
      gap: circumference - dash,
      offset: -(previousTotal / (total || 1)) * circumference,
    };
  });

  return (
    <div className="flex items-center gap-6">
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90">
          {total === 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
            />
          )}

          {segments.map((segment, index) => (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segment.dash} ${segment.gap}`}
              strokeDashoffset={segment.offset}
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-center text-lg font-bold text-white">
            {centerLabel}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2"
          >
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ background: item.color }}
            />

            <span className="text-sm text-slate-300">
              {item.label}
            </span>

            <span className="text-sm font-semibold text-white">
              {Number(item.value || 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonutChart;