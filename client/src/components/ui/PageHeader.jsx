function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="ec-page-header">
      <div className="min-w-0">
        <h1 className="ec-page-header-title">{title}</h1>

        {subtitle && (
          <p className="ec-page-header-subtitle">{subtitle}</p>
        )}
      </div>

      {actions && (
        <div className="ec-page-header-actions">{actions}</div>
      )}
    </div>
  );
}

export default PageHeader;