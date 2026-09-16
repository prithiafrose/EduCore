function StatusBadge({ tone = "slate", dot = true, children }) {
  return (
    <span className={`ec-badge ec-badge-${tone}`}>
      {dot && <span className="ec-badge-dot" />}
      {children}
    </span>
  );
}

export default StatusBadge;