import { apiClient } from './apiClient';

export async function createOrJoinSession(payload) {
  const response = await apiClient.post('/v1/sessions/create', payload);
  return response.data.data;
}

export async function getSessionByToken(sessionToken) {
  const response = await apiClient.get(`/v1/sessions/${encodeURIComponent(sessionToken)}`);
  return response.data.data;
}

export async function addSessionParticipant(sessionToken, name) {
  const response = await apiClient.post(`/v1/sessions/${encodeURIComponent(sessionToken)}/participants`, {
    name
  });

  return response.data.data;
}

export async function updateSessionMode(sessionToken, mode) {
  const response = await apiClient.patch(`/v1/sessions/${encodeURIComponent(sessionToken)}/mode`, {
    mode
  });

  return response.data.data;
}
