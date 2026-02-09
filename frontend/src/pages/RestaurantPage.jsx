import { useParams } from 'react-router-dom';

function RestaurantPage() {
  const { slug } = useParams();

  return (
    <section className="container page-shell">
      <p className="eyebrow">Restaurant Route</p>
      <h1>Restaurant: {slug}</h1>
      <p>
        This route is ready for Phase 1. Next, we will fetch restaurant data, menu categories,
        and table-aware session context.
      </p>
    </section>
  );
}

export default RestaurantPage;
