import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]           = useState(null);
  const [org, setOrg]             = useState(null);
  const [accountType, setType]    = useState(null);
  const [loading, setLoading]     = useState(true);

  const hydrateFromStorage = useCallback(async () => {
    const token = localStorage.getItem('ax_token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await authAPI.me();
      setType(data.accountType);
      if (data.accountType === 'organization') setOrg(data.data);
      else setUser(data.data);
    } catch {
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { hydrateFromStorage(); }, [hydrateFromStorage]);

  const login = (payload) => {
    localStorage.setItem('ax_token',   payload.token);
    localStorage.setItem('ax_refresh', payload.refreshToken);
    localStorage.setItem('ax_type',    payload.accountType);
    setType(payload.accountType);
    if (payload.accountType === 'organization') { setOrg(payload.org); setUser(null); }
    else { setUser(payload.user); setOrg(null); }
  };

  const logout = async () => {
    try { await authAPI.logout({ refreshToken: localStorage.getItem('ax_refresh') }); } catch {}
    localStorage.clear();
    setUser(null); setOrg(null); setType(null);
  };

  const updateUser = (updates) => setUser((prev) => ({ ...prev, ...updates }));
  const updateOrg  = (updates) => setOrg((prev) => ({ ...prev, ...updates }));

  const isAuthenticated = !!localStorage.getItem('ax_token');
  const isUser = accountType === 'user';
  const isOrg  = accountType === 'organization';

  return (
    <AuthContext.Provider value={{ user, org, accountType, loading, isAuthenticated, isUser, isOrg, login, logout, updateUser, updateOrg }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
