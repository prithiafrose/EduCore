function GradientText({
  children,
  className = "",
  colors = ["#6366f1", "#ec4899", "#22d3ee", "#6366f1"],
  animationSpeed = 6,
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <style>
        {`
          .ec-gradient-flow {
            background: linear-gradient(90deg, ${colors.join(", ")});
            background-size: 200% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: ec-gradient-flow ${animationSpeed}s linear infinite;
          }
          @keyframes ec-gradient-flow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}
      </style>
      <span className="ec-gradient-flow">{children}</span>
    </span>
  );
}

export default GradientText;