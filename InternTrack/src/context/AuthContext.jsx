import { createContext, useContext, useState, useEffect } from 'react';
import { authStorage } from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = authStorage.getCurrentUser();
    if (current) setUser(current);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const userData = authStorage.login({ email, password });
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, phone) => {
    const userData = authStorage.register({ name, email, password, phone });
    setUser(userData);
    return userData;
  };

  const logout = () => {
    authStorage.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
