import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getRestaurantBySlug } from '../services/restaurant.service';
import { listMenuItems } from '../services/menuItem.service';
import { usePageTitle } from '../hooks/usePageTitle';

function RestaurantPage() {
  const { slug } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadSeed, setReloadSeed] = useState(0);

  usePageTitle(restaurant ? `${restaurant.name} | TableFlow` : 'Restaurant | TableFlow');

  useEffect(() => {
    let ignore = false;

    async function loadRestaurantAndMenu() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const restaurantData = await getRestaurantBySlug(slug);
        const menuData = await listMenuItems(restaurantData._id, { includeUnavailable: false });

        if (ignore) return;

        setRestaurant(restaurantData);
        setMenuItems(menuData.items || []);
      } catch (error) {
        if (ignore) return;
        setErrorMessage(error?.response?.data?.message || 'Failed to load restaurant menu.');
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadRestaurantAndMenu();

    return () => {
      ignore = true;
    };
  }, [slug, reloadSeed]);

  const categorizedMenu = useMemo(() => {
    return menuItems.reduce((groups, item) => {
      const category = item.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(item);
      return groups;
    }, {});
  }, [menuItems]);

  if (isLoading) {
    return (
      <section className="container page-shell">
        <p className="eyebrow">Restaurant Route</p>
        <h1>Loading menu...</h1>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="container page-shell">
        <p className="eyebrow">Restaurant Route</p>
        <h1>Unable to load restaurant</h1>
        <p className="error-text">{errorMessage}</p>
        <button className="btn btn-soft" onClick={() => setReloadSeed((seed) => seed + 1)}>
          Retry
        </button>
      </section>
    );
  }

  return (
    <div className="restaurant-page page-shell">
      <section className="container restaurant-hero">
        <p className="eyebrow">Restaurant Route</p>
        <h1>{restaurant.name}</h1>
        <p className="hero-copy">
          Browse the live menu for this restaurant. Availability and pricing are managed from the
          admin dashboard.
        </p>
        <div className="hero-meta-row">
          <span className="pill">Slug: {restaurant.slug}</span>
          <span className="pill">Currency: {restaurant.currency || 'INR'}</span>
          <span className="pill">{restaurant.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      </section>

      <section className="container menu-category-wrap">
        {Object.keys(categorizedMenu).length === 0 ? (
          <p className="empty-state">No available menu items right now.</p>
        ) : (
          Object.entries(categorizedMenu).map(([category, items]) => (
            <article key={category} className="menu-category-block">
              <h2>{category}</h2>
              <div className="public-menu-grid">
                {items.map((item) => (
                  <div key={item._id} className="public-menu-card">
                    <div className="menu-item-top">
                      <h3>{item.name}</h3>
                      <strong className="price-pill">
                        {restaurant.currency || 'INR'} {Number(item.price || 0).toFixed(2)}
                      </strong>
                    </div>
                    {item.description ? <p>{item.description}</p> : null}
                    {Array.isArray(item.dietaryTags) && item.dietaryTags.length > 0 ? (
                      <p className="muted-text">Tags: {item.dietaryTags.join(', ')}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

export default RestaurantPage;
