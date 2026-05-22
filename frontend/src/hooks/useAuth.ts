import { useState, useEffect, useCallback } from 'react';

const AUTH_API = 'https://airaquas-api-auth.jfh-099.workers.dev';

export interface User {
  id: string;
  name: string;
  phone: string;
  type: string;
  shop_id?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = useCallback(async (phone: string, password: string) => {
    const res = await fetch(`${AUTH_API}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || '登录失败');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (phone: string, password: string, name: string) => {
    const res = await fetch(`${AUTH_API}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password, name, type: 'customer' }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || '注册失败');
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  return { user, token, login, register, logout, isAuthenticated: !!token && !!user };
}
