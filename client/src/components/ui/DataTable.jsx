function DataTable({ columns = [], children, empty }) {
  return (
    <div className="ec-table-wrap">
      <table className="ec-table">
        {columns.length > 0 && (
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
        )}

        <tbody>{children}</tbody>
      </table>

      {empty}
    </div>
  );
}

export default DataTable;