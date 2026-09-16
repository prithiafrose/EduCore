function EmptyState({ icon: Icon, title = "No data", description, action }) {
  return (
    <div className="ec-empty">
      {Icon && (
        <div className="ec-empty-icon">
          <Icon size={22} />
        </div>
      )}

      <p className="ec-empty-title">{title}</p>

      {description && (
        <p className="ec-empty-desc">{description}</p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;