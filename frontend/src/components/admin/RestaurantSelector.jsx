function RestaurantSelector({
  restaurants,
  selectedRestaurantId,
  onRestaurantChange,
  createForm,
  onCreateFormChange,
  onCreateRestaurant,
  creatingRestaurant
}) {
  return (
    <section className="admin-panel">
      <header className="admin-panel-header">
        <h2>Restaurant Context</h2>
        <p>Select an existing restaurant or create one for testing the menu APIs.</p>
      </header>

      <label className="form-label" htmlFor="restaurantSelect">
        Active restaurant
      </label>
      <select
        id="restaurantSelect"
        className="field"
        value={selectedRestaurantId}
        onChange={(event) => onRestaurantChange(event.target.value)}
      >
        <option value="">Select restaurant</option>
        {restaurants.map((restaurant) => (
          <option key={restaurant._id} value={restaurant._id}>
            {restaurant.name} ({restaurant.slug})
          </option>
        ))}
      </select>

      <form className="inline-form" onSubmit={onCreateRestaurant}>
        <input
          className="field"
          name="name"
          placeholder="New restaurant name"
          value={createForm.name}
          onChange={onCreateFormChange}
          required
        />
        <input
          className="field"
          name="slug"
          placeholder="Slug (optional)"
          value={createForm.slug}
          onChange={onCreateFormChange}
        />
        <button className="btn btn-accent" disabled={creatingRestaurant} type="submit">
          {creatingRestaurant ? 'Creating...' : 'Create'}
        </button>
      </form>
    </section>
  );
}

export default RestaurantSelector;
