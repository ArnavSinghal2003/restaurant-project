function MenuItemForm({
  form,
  onChange,
  onSubmit,
  isSaving,
  isEditing,
  onCancelEdit,
  disabled
}) {
  return (
    <section className="admin-panel">
      <header className="admin-panel-header">
        <h2>{isEditing ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
        <p>Create category-wise items, prices, and availability for the selected restaurant.</p>
      </header>

      <form className="menu-form-grid" onSubmit={onSubmit}>
        <label className="form-field">
          <span>Name</span>
          <input
            className="field"
            name="name"
            value={form.name}
            onChange={onChange}
            disabled={disabled}
            required
          />
        </label>

        <label className="form-field">
          <span>Category</span>
          <input
            className="field"
            name="category"
            value={form.category}
            onChange={onChange}
            disabled={disabled}
            placeholder="Starters / Main Course"
            required
          />
        </label>

        <label className="form-field">
          <span>Price</span>
          <input
            className="field"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={onChange}
            disabled={disabled}
            required
          />
        </label>

        <label className="form-field">
          <span>Inventory (optional)</span>
          <input
            className="field"
            name="inventoryCount"
            type="number"
            min="0"
            step="1"
            value={form.inventoryCount}
            onChange={onChange}
            disabled={disabled}
          />
        </label>

        <label className="form-field form-span-2">
          <span>Description</span>
          <textarea
            className="field"
            name="description"
            rows="3"
            value={form.description}
            onChange={onChange}
            disabled={disabled}
          />
        </label>

        <label className="form-field form-span-2">
          <span>Dietary tags (comma separated)</span>
          <input
            className="field"
            name="dietaryTags"
            value={form.dietaryTags}
            onChange={onChange}
            disabled={disabled}
            placeholder="veg, gluten-free"
          />
        </label>

        <label className="checkbox-row form-span-2">
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={onChange}
            disabled={disabled}
          />
          <span>Item available for ordering</span>
        </label>

        <div className="form-actions form-span-2">
          <button className="btn btn-accent" type="submit" disabled={disabled || isSaving}>
            {isSaving ? 'Saving...' : isEditing ? 'Update Item' : 'Create Item'}
          </button>
          {isEditing ? (
            <button className="btn btn-soft" type="button" onClick={onCancelEdit}>
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default MenuItemForm;
