function TableList({ tables, onEdit, onDelete, onToggleActive, pendingTableId }) {
  return (
    <section className="admin-panel">
      <header className="admin-panel-header">
        <h2>Tables</h2>
        <p>Each row represents one physical table and its QR identity.</p>
      </header>

      {tables.length === 0 ? (
        <p className="empty-state">No tables added yet.</p>
      ) : (
        <div className="menu-item-list">
          {tables.map((table) => {
            const isPending = pendingTableId === table._id;

            return (
              <article key={table._id} className="table-card">
                <div className="menu-item-top">
                  <h3>Table {table.tableNumber}</h3>
                  <span className={table.isActive ? 'status-chip online' : 'status-chip offline'}>
                    {table.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="muted-text">Capacity: {table.capacity}</p>
                <p className="table-token">QR Token: {table.qrToken}</p>

                <div className="menu-actions">
                  <button className="btn btn-soft" onClick={() => onEdit(table)} disabled={isPending}>
                    Edit
                  </button>
                  <button
                    className="btn btn-soft"
                    onClick={() => onToggleActive(table)}
                    disabled={isPending}
                  >
                    {table.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => onDelete(table)}
                    disabled={isPending}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default TableList;
