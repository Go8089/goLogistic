/**
 * Authentication Storage Service
 * Handles memoized localStorage access for auth state
 * Follows Single Responsibility Principle
 */

interface CachedUser {
  role?: string;
  name?: string;
  email?: string;
  userId?: string;
}

class AuthStorageService {
  private cachedUser: CachedUser | null | undefined;
  private cacheInitialized = false;

  /**
   * Get cached user data with memoization
   * Avoids repeated localStorage access and JSON parsing
   */
  getUser(): CachedUser | null {
    // Return cached value if already loaded
    if (this.cacheInitialized) {
      return this.cachedUser ?? null;
    }

    // Initialize cache
    this.cacheInitialized = true;

    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");

    // No token means no user
    if (!token || !userJson) {
      this.cachedUser = null;
      return null;
    }

    try {
      this.cachedUser = JSON.parse(userJson) as CachedUser;
      return this.cachedUser;
    } catch (error) {
      // Invalid JSON, clear corrupted data
      this.clearAuth();
      return null;
    }
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get user role
   */
  getUserRole(): string | undefined {
    return this.getUser()?.role;
  }

  /**
   * Save auth data
   */
  setAuth(token: string, user: CachedUser): void {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    this.cachedUser = user;
    this.cacheInitialized = true;
  }

  /**
   * Clear auth data and cache
   */
  clearAuth(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.cachedUser = null;
    this.cacheInitialized = false;
  }

  /**
   * Invalidate cache (called when storage changes from other tabs)
   */
  invalidateCache(): void {
    this.cacheInitialized = false;
    this.cachedUser = undefined;
  }
}

// Export singleton instance
export const authStorage = new AuthStorageService();
