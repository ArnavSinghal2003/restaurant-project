function TableForm({
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
        <h2>{isEditing ? 'Edit Table' : 'Add Table'}</h2>
        <p>Create and manage physical table entries for the selected restaurant.</p>
      </header>

      <form className="table-form-grid" onSubmit={onSubmit}>
        <label className="form-field">
          <span>Table Number</span>
          <input
            className="field"
            name="tableNumber"
            value={form.tableNumber}
            onChange={onChange}
            disabled={disabled}
            placeholder="A1"
            required
          />
        </label>

        <label className="form-field">
          <span>Capacity</span>
          <input
            className="field"
            name="capacity"
            type="number"
            min="1"
            max="100"
            step="1"
            value={form.capacity}
            onChange={onChange}
            disabled={disabled}
            required
          />
        </label>

        <label className="form-field form-span-2">
          <span>QR Token (optional)</span>
          <input
            className="field"
            name="qrToken"
            value={form.qrToken}
            onChange={onChange}
            disabled={disabled}
            placeholder="Leave empty for auto-generated token"
          />
        </label>

        <label className="checkbox-row form-span-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={onChange}
            disabled={disabled}
          />
          <span>Table is active for new sessions</span>
        </label>

        <div className="form-actions form-span-2">
          <button className="btn btn-accent" type="submit" disabled={disabled || isSaving}>
            {isSaving ? 'Saving...' : isEditing ? 'Update Table' : 'Create Table'}
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

export default TableForm;
