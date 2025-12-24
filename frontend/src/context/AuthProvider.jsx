import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { loginUser, logoutUser } from '@/services/auth.service';
import { getMe } from '@/services/user.service';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const fetchMe = async () => {
    try {
      const res = await getMe();
      setUser(res?.data?.data || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (data) => {
    const res = await loginUser(data);
    setUser(res?.data?.data || null);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        refreshUser: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
