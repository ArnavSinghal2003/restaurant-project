import mongoose from 'mongoose';

export function assertRestaurantScope(restaurantId) {
  if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) {
    const error = new Error('Invalid or missing restaurantId');
    error.statusCode = 400;
    throw error;
  }
}

export function withRestaurantScope(query = {}, restaurantId) {
  assertRestaurantScope(restaurantId);

  return {
    ...query,
    restaurantId
  };
}
