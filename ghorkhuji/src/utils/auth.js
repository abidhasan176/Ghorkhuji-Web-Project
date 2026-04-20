/**
 * Authentication helpers.
 * - Token lives as an httpOnly "token" cookie (set by server).
 * - "auth" cookie is a non-httpOnly flag readable by JS → used by ProtectedRoute.
 * - User info lives in localStorage.
 */

export const getToken = () => {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth="));
  return match ? match.split("=")[1] : null;
};

export const isLoggedIn = () => !!getToken();

/** Called after a successful login to store user info. */
export const saveAuth = (token, user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    if (user._id) localStorage.setItem("userId", user._id);
    if (user.id)  localStorage.setItem("userId", user.id);
  }
};

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

/**
 * Full logout:
 * 1. Calls the backend logout route to clear the httpOnly cookie.
 * 2. Clears all local storage items set by auth.
 * 3. Clears the client-readable "auth" cookie.
 */
export const logoutUser = async () => {
  try {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
  } catch (_) {}

  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  localStorage.removeItem("rememberedPhone");

  // Clear the JS-readable flag cookie
  document.cookie = "auth=; path=/; max-age=0; SameSite=Lax";
};

// Backward-compat alias
export const clearAuth = logoutUser;