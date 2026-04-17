/**
 * Centralized API utility.
 * - Automatically attaches credentials (cookies) to every request.
 * - Intercepts 401 / 403 responses globally.
 *   → Clears auth state and redirects to /login (session expired).
 */

import { logoutUser } from "./auth";

let _navigateFn = null;

/** Call this once in App.jsx so the utility can navigate on 401. */
export function initApiNavigate(navigateFn) {
  _navigateFn = navigateFn;
}

/**
 * Drop-in replacement for fetch that:
 *  1. Always sends cookies (credentials: "include")
 *  2. Handles 401 / 403 by logging the user out automatically
 */
export async function apiFetch(url, options = {}) {
  const config = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  const res = await fetch(url, config);

  if (res.status === 401 || res.status === 403) {
    // Token is invalid, expired, or was tampered with.
    await logoutUser();
    if (_navigateFn) {
      _navigateFn("/login", {
        state: { sessionExpired: true },
        replace: true,
      });
    } else {
      // Fallback hard redirect
      window.location.href = "/login";
    }
    // Return a fake response so the caller doesn't crash
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return res;
}
