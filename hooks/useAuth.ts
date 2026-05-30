'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User, AuthState } from '@/types';

// Keep these keys — still used as UI cache
const AUTH_STORAGE_KEY = 'profileflow_auth';
const USER_STORAGE_KEY = 'profileflow_user';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  // On mount — verify token with server
  useEffect(() => {
    const verifyAuth = async () => {
      // Check localStorage cache first (fast UI)
      const cachedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      const cachedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (cachedAuth === 'true' && cachedUser) {
        try {
          setState({
            isAuthenticated: true,
            user: JSON.parse(cachedUser),
            loading: false,
            error: null,
          });
        } catch {}
      }

      // Verify with server (source of truth)
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const user: User = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            company: data.user.company,
            avatar: data.user.avatar,
            createdAt: new Date(data.user.createdAt),
          };
          localStorage.setItem(AUTH_STORAGE_KEY, 'true');
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          setState({ isAuthenticated: true, user, loading: false, error: null });
        } else {
          // Token invalid — clear cache
          localStorage.removeItem(AUTH_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
          setState({ isAuthenticated: false, user: null, loading: false, error: null });
        }
      } catch {
        // Network error — use cached state
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    verifyAuth();
  }, []);

  // LOGIN — same signature as before: login(email, password)
  const login = useCallback((email: string, password: string): Promise<User> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          reject(new Error(data.error || 'Login failed'));
          return;
        }

        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          company: data.user.company,
          createdAt: new Date(data.user.createdAt),
        };

        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

        setState({ isAuthenticated: true, user, loading: false, error: null });
        resolve(user);
      } catch (err) {
        reject(new Error('Network error. Please try again.'));
      }
    });
  }, []);

  // SIGNUP — same signature as before: signup(email, name, password)
  const signup = useCallback((email: string, name: string, password: string): Promise<User> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          reject(new Error(data.error || 'Signup failed'));
          return;
        }

        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          company: data.user.company,
          createdAt: new Date(data.user.createdAt),
        };

        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

        setState({ isAuthenticated: true, user, loading: false, error: null });
        resolve(user);
      } catch (err) {
        reject(new Error('Network error. Please try again.'));
      }
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}

    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

    setState({ isAuthenticated: false, user: null, loading: false, error: null });
  }, []);

  return { ...state, login, logout, signup };
}
