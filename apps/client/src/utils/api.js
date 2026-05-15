const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'An error occurred.');
  return data;
};

export const fetchImages = () =>
  fetch(`${BASE_URL}/images`).then(handleResponse);

export const startSession = (imageId) =>
  fetch(`${BASE_URL}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageId }),
  }).then(handleResponse);

export const validateGuess = (token, characterId, x, y) =>
  fetch(`${BASE_URL}/sessions/${token}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ characterId, x, y }),
  }).then(handleResponse);

export const completeSession = (token, playerName) =>
  fetch(`${BASE_URL}/sessions/${token}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName }),
  }).then(handleResponse);

export const fetchLeaderboard = (imageId, token) => {
  const params = new URLSearchParams({ imageId });
  if (token) params.append('token', token);
  return fetch(`${BASE_URL}/leaderboard?${params}`).then(handleResponse);
};
