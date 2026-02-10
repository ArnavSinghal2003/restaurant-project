import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { getRestaurantBySlug } from '../services/restaurant.service';
import { listMenuItems } from '../services/menuItem.service';
import { getSessionByToken, updateSessionMode } from '../services/session.service';
import {
  clearActiveSession,
  getActiveSession,
  saveActiveSession
} from '../services/sessionStorage.service';
import { usePageTitle } from '../hooks/usePageTitle';

function RestaurantPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionTokenFromQuery = searchParams.get('sessionToken');
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadSeed, setReloadSeed] = useState(0);
  const [sessionContext, setSessionContext] = useState(null);
  const [sessionMessage, setSessionMessage] = useState('');
  const [isUpdatingMode, setIsUpdatingMode] = useState(false);

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

        let resolvedSessionContext = null;
        let tokenToUse = sessionTokenFromQuery;

        if (!tokenToUse) {
          const savedSession = getActiveSession();
          if (savedSession?.sessionToken && savedSession?.restaurant?.slug === slug) {
            tokenToUse = savedSession.sessionToken;
          }
        }

        if (tokenToUse) {
          try {
            const sessionData = await getSessionByToken(tokenToUse);
            if (
              sessionData?.restaurant?.slug &&
              sessionData.restaurant.slug.toLowerCase() === restaurantData.slug.toLowerCase()
            ) {
              resolvedSessionContext = {
                sessionToken: sessionData.session.sessionToken,
                mode: sessionData.session.mode,
                table: sessionData.table,
                restaurant: sessionData.restaurant
              };

              saveActiveSession({
                sessionToken: sessionData.session.sessionToken,
                qrToken: sessionData.table?.qrToken || '',
                mode: sessionData.session.mode,
                restaurant: sessionData.restaurant,
                table: sessionData.table
              });

              if (!sessionTokenFromQuery) {
                setSearchParams({ sessionToken: sessionData.session.sessionToken }, { replace: true });
              }
            } else {
              clearActiveSession();
            }
          } catch {
            clearActiveSession();
          }
        }

        setRestaurant(restaurantData);
        setMenuItems(menuData.items || []);
        setSessionContext(resolvedSessionContext);
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
  }, [slug, reloadSeed, sessionTokenFromQuery, setSearchParams]);

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

  async function handleModeChange(nextMode) {
    if (!sessionContext || isUpdatingMode || sessionContext.mode === nextMode) return;

    setIsUpdatingMode(true);
    setSessionMessage('');
    setErrorMessage('');

    try {
      const response = await updateSessionMode(sessionContext.sessionToken, nextMode);
      const updatedContext = {
        ...sessionContext,
        mode: response.mode
      };
      setSessionContext(updatedContext);
      saveActiveSession({
        sessionToken: updatedContext.sessionToken,
        qrToken: sessionContext.table?.qrToken || '',
        mode: updatedContext.mode,
        restaurant: sessionContext.restaurant,
        table: sessionContext.table
      });
      setSessionMessage(`Ordering mode updated to ${response.mode}.`);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to update session mode.');
    } finally {
      setIsUpdatingMode(false);
    }
  }

  function handleLeaveSession() {
    clearActiveSession();
    setSessionContext(null);
    setSessionMessage('Session removed from this browser. You can still browse the menu.');
    setSearchParams({}, { replace: true });
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

      {sessionContext ? (
        <section className="container session-context-card">
          <h2>Active Table Session</h2>
          <p className="muted-text">
            Table {sessionContext.table?.tableNumber || '-'} | Session token:{' '}
            <code>{sessionContext.sessionToken}</code>
          </p>
          <div className="session-mode-actions">
            <button
              className={`btn ${sessionContext.mode === 'collective' ? 'btn-accent' : 'btn-soft'}`}
              onClick={() => handleModeChange('collective')}
              disabled={isUpdatingMode}
            >
              Collective Mode
            </button>
            <button
              className={`btn ${sessionContext.mode === 'individual' ? 'btn-accent' : 'btn-soft'}`}
              onClick={() => handleModeChange('individual')}
              disabled={isUpdatingMode}
            >
              Individual Mode
            </button>
            <button className="btn btn-soft" onClick={handleLeaveSession}>
              Leave Session
            </button>
          </div>
          {sessionMessage ? <p className="success-text">{sessionMessage}</p> : null}
        </section>
      ) : null}

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
