import { apiClient } from './apiClient';

export async function listTables(restaurantId, params = {}) {
  const response = await apiClient.get(`/v1/restaurants/${restaurantId}/tables`, {
    params
  });

  return response.data.data;
}

export async function createTable(restaurantId, payload) {
  const response = await apiClient.post(`/v1/restaurants/${restaurantId}/tables`, payload);
  return response.data.data;
}

export async function updateTable(restaurantId, tableId, payload) {
  const response = await apiClient.patch(`/v1/restaurants/${restaurantId}/tables/${tableId}`, payload);
  return response.data.data;
}

export async function deleteTable(restaurantId, tableId) {
  const response = await apiClient.delete(`/v1/restaurants/${restaurantId}/tables/${tableId}`);
  return response.data.data;
}
