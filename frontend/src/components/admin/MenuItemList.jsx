function MenuItemList({ items, onEdit, onDelete, onToggleAvailability, pendingItemId }) {
  return (
    <section className="admin-panel">
      <header className="admin-panel-header">
        <h2>Menu Inventory</h2>
        <p>Review and manage all items for the selected restaurant.</p>
      </header>

      {items.length === 0 ? (
        <p className="empty-state">No menu items yet. Create your first one from the form.</p>
      ) : (
        <div className="menu-item-list">
          {items.map((item) => {
            const isPending = pendingItemId === item._id;

            return (
              <article key={item._id} className="menu-item-card">
                <div className="menu-item-top">
                  <h3>{item.name}</h3>
                  <span className={item.isAvailable ? 'status-chip online' : 'status-chip offline'}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <p className="muted-text">
                  {item.category} | Rs. {Number(item.price || 0).toFixed(2)}
                </p>

                {item.description ? <p className="menu-item-description">{item.description}</p> : null}

                {Array.isArray(item.dietaryTags) && item.dietaryTags.length > 0 ? (
                  <p className="muted-text">Tags: {item.dietaryTags.join(', ')}</p>
                ) : null}

                <div className="menu-actions">
                  <button className="btn btn-soft" onClick={() => onEdit(item)} disabled={isPending}>
                    Edit
                  </button>
                  <button
                    className="btn btn-soft"
                    onClick={() => onToggleAvailability(item)}
                    disabled={isPending}
                  >
                    {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => onDelete(item)}
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

export default MenuItemList;
