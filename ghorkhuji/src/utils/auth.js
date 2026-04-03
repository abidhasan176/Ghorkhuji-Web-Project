export const getToken = () => {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth="));
  return match ? match.split("=")[1] : null;
};

export const saveAuth = (token, user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const logoutUser = async () => {
  try {
    // Server must clear the httpOnly token cookie — JS alone cannot
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.warn("Logout request failed:", err);
  }
  // Clear local state regardless
  localStorage.removeItem("user");
  document.cookie = "auth=; path=/; max-age=0; SameSite=Lax";
};

// Keep clearAuth as an alias for backward compatibility
export const clearAuth = logoutUser;