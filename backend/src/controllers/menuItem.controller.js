import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import { created, fail, ok } from '../utils/apiResponse.js';

async function ensureRestaurantExists(restaurantId) {
  return Restaurant.exists({ _id: restaurantId, isActive: true });
}

export async function createMenuItem(req, res) {
  const { restaurantId } = req.params;
  const payload = req.body;

  const restaurantExists = await ensureRestaurantExists(restaurantId);
  if (!restaurantExists) {
    return fail(res, 404, 'Restaurant not found or inactive');
  }

  const menuItem = await MenuItem.create({
    ...payload,
    restaurantId
  });

  return created(res, menuItem, 'Menu item created');
}

export async function listMenuItems(req, res) {
  const { restaurantId } = req.params;
  const { includeUnavailable, category, search } = req.query;

  const restaurantExists = await ensureRestaurantExists(restaurantId);
  if (!restaurantExists) {
    return fail(res, 404, 'Restaurant not found or inactive');
  }

  const filters = { restaurantId };

  if (!includeUnavailable) {
    filters.isAvailable = true;
  }

  if (category) {
    filters.category = category;
  }

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const menuItems = await MenuItem.find(filters).sort({ category: 1, sortOrder: 1, name: 1 });

  return ok(
    res,
    {
      items: menuItems,
      count: menuItems.length
    },
    'Menu items fetched'
  );
}

export async function getMenuItemById(req, res) {
  const { restaurantId, menuItemId } = req.params;

  const menuItem = await MenuItem.findOne({
    _id: menuItemId,
    restaurantId
  });

  if (!menuItem) {
    return fail(res, 404, 'Menu item not found');
  }

  return ok(res, menuItem, 'Menu item fetched');
}

export async function updateMenuItem(req, res) {
  const { restaurantId, menuItemId } = req.params;
  const payload = req.body;

  const menuItem = await MenuItem.findOne({
    _id: menuItemId,
    restaurantId
  });

  if (!menuItem) {
    return fail(res, 404, 'Menu item not found');
  }

  Object.assign(menuItem, payload);
  await menuItem.save();

  return ok(res, menuItem, 'Menu item updated');
}

export async function updateMenuItemAvailability(req, res) {
  const { restaurantId, menuItemId } = req.params;
  const { isAvailable } = req.body;

  const menuItem = await MenuItem.findOne({
    _id: menuItemId,
    restaurantId
  });

  if (!menuItem) {
    return fail(res, 404, 'Menu item not found');
  }

  menuItem.isAvailable = isAvailable;
  await menuItem.save();

  return ok(
    res,
    {
      _id: menuItem._id,
      isAvailable: menuItem.isAvailable
    },
    'Menu item availability updated'
  );
}

export async function deleteMenuItem(req, res) {
  const { restaurantId, menuItemId } = req.params;

  const menuItem = await MenuItem.findOneAndDelete({
    _id: menuItemId,
    restaurantId
  });

  if (!menuItem) {
    return fail(res, 404, 'Menu item not found');
  }

  return ok(
    res,
    {
      _id: menuItem._id
    },
    'Menu item deleted'
  );
}
