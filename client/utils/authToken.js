export const AUTH_TOKEN_KEY = "traveloop_token";

export function saveAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}
