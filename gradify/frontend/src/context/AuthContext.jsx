import { createContext, useCallback, useEffect, useState } from "react";
import { authGoogle, getMe, tokenStore } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState("");

  const loadCurrentUser = useCallback(async () => {
    const token = tokenStore.get();
    if (!token) {
      setInitializing(false);
      return;
    }
    try {
      const { data } = await getMe();
      setUser(data.user);
    } catch (err) {
      tokenStore.clear();
      setUser(null);
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const loginWithGoogle = useCallback(async (credential) => {
    setAuthError("");
    try {
      const { data } = await authGoogle(credential);
      tokenStore.set(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setAuthError(
        err.response?.data?.message ||
          "Couldn't sign you in. Please try again."
      );
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = {
    user,
    setUser,
    initializing,
    authError,
    isAuthenticated: Boolean(user),
    loginWithGoogle,
    logout,
    refreshUser: loadCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
