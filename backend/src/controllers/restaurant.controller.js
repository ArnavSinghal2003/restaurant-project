import Restaurant from '../models/Restaurant.js';
import { created, fail, ok } from '../utils/apiResponse.js';
import { toSlug } from '../utils/slug.js';

async function generateUniqueSlug(baseSlug) {
  const fallbackBase = baseSlug || `restaurant-${Date.now()}`;
  let candidate = fallbackBase;
  let suffix = 1;

  while (await Restaurant.exists({ slug: candidate })) {
    candidate = `${fallbackBase}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export async function createRestaurant(req, res) {
  const payload = req.body;
  const requestedSlug = payload.slug ? toSlug(payload.slug) : null;
  const slugBase = requestedSlug || toSlug(payload.name);

  if (!slugBase) {
    return fail(res, 400, 'Invalid name/slug. Unable to generate slug.');
  }

  let finalSlug = requestedSlug;

  if (requestedSlug) {
    const existingSlug = await Restaurant.exists({ slug: requestedSlug });
    if (existingSlug) {
      return fail(res, 409, 'Restaurant slug already exists. Please choose another slug.');
    }
  } else {
    finalSlug = await generateUniqueSlug(slugBase);
  }

  const restaurant = await Restaurant.create({
    ...payload,
    slug: finalSlug
  });

  return created(res, restaurant, 'Restaurant created');
}

export async function listRestaurants(req, res) {
  const { includeInactive, search } = req.query;
  const filters = {};

  if (!includeInactive) {
    filters.isActive = true;
  }

  if (search) {
    filters.name = { $regex: search, $options: 'i' };
  }

  const restaurants = await Restaurant.find(filters).sort({ createdAt: -1 });

  return ok(
    res,
    {
      items: restaurants,
      count: restaurants.length
    },
    'Restaurants fetched'
  );
}

export async function getRestaurantById(req, res) {
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    return fail(res, 404, 'Restaurant not found');
  }

  return ok(res, restaurant, 'Restaurant fetched');
}

export async function getRestaurantBySlug(req, res) {
  const slug = toSlug(req.params.slug);
  const restaurant = await Restaurant.findOne({ slug });

  if (!restaurant) {
    return fail(res, 404, 'Restaurant not found');
  }

  return ok(res, restaurant, 'Restaurant fetched');
}

export async function updateRestaurant(req, res) {
  const { restaurantId } = req.params;
  const payload = req.body;
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    return fail(res, 404, 'Restaurant not found');
  }

  if (payload.slug) {
    const normalizedSlug = toSlug(payload.slug);

    if (!normalizedSlug) {
      return fail(res, 400, 'Invalid slug value');
    }

    const existingSlug = await Restaurant.exists({
      slug: normalizedSlug,
      _id: { $ne: restaurantId }
    });

    if (existingSlug) {
      return fail(res, 409, 'Restaurant slug already exists. Please choose another slug.');
    }

    payload.slug = normalizedSlug;
  }

  Object.assign(restaurant, payload);
  await restaurant.save();

  return ok(res, restaurant, 'Restaurant updated');
}

export async function deactivateRestaurant(req, res) {
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    return fail(res, 404, 'Restaurant not found');
  }

  restaurant.isActive = false;
  await restaurant.save();

  return ok(
    res,
    {
      _id: restaurant._id,
      isActive: restaurant.isActive
    },
    'Restaurant deactivated'
  );
}
