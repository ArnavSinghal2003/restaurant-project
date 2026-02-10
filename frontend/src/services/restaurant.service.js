import { apiClient } from './apiClient';

export async function listRestaurants(params = {}) {
  const response = await apiClient.get('/v1/restaurants', { params });
  return response.data.data;
}

export async function getRestaurantBySlug(slug) {
  const response = await apiClient.get(`/v1/restaurants/slug/${encodeURIComponent(slug)}`);
  return response.data.data;
}

export async function createRestaurant(payload) {
  const response = await apiClient.post('/v1/restaurants', payload);
  return response.data.data;
}
