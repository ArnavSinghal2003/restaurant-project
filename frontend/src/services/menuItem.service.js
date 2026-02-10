import { apiClient } from './apiClient';

export async function listMenuItems(restaurantId, params = {}) {
  const response = await apiClient.get(`/v1/restaurants/${restaurantId}/menu-items`, {
    params
  });

  return response.data.data;
}

export async function createMenuItem(restaurantId, payload) {
  const response = await apiClient.post(`/v1/restaurants/${restaurantId}/menu-items`, payload);
  return response.data.data;
}

export async function updateMenuItem(restaurantId, menuItemId, payload) {
  const response = await apiClient.patch(
    `/v1/restaurants/${restaurantId}/menu-items/${menuItemId}`,
    payload
  );

  return response.data.data;
}

export async function updateMenuItemAvailability(restaurantId, menuItemId, isAvailable) {
  const response = await apiClient.patch(
    `/v1/restaurants/${restaurantId}/menu-items/${menuItemId}/availability`,
    { isAvailable }
  );

  return response.data.data;
}

export async function deleteMenuItem(restaurantId, menuItemId) {
  const response = await apiClient.delete(`/v1/restaurants/${restaurantId}/menu-items/${menuItemId}`);
  return response.data.data;
}
