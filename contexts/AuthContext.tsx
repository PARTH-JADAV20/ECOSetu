'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Role = 'Engineer' | 'Approver' | 'Operations' | 'Admin';

interface User {
  name: string;
  email: string;
  role?: Role;
  location?: string;
  phone?: string;
  description?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isReady: boolean;
  currentRole: Role;
  currentUser: User;
  login: (userData: User) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'ec_setu_auth_state';

const defaultUser: User = {
  name: 'John Smith',
  email: 'john.smith@example.com',
  location: 'San Francisco, CA',
  phone: '+1 (555) 123-4567',
  description: 'Senior Manufacturing Engineer with 10 years of experience in automotive and aerospace industries.',
  role: 'Engineer',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role>('Engineer');
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);

  // Hydrate auth state from localStorage so refreshes stay logged in
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<AuthContextType> & { currentUser?: User; currentRole?: Role };
        if (parsed.isAuthenticated && parsed.currentUser) {
          setIsAuthenticated(true);
          setCurrentUser(parsed.currentUser);
          setCurrentRole(parsed.currentRole || parsed.currentUser.role || 'Engineer');
        }
      }
    } catch (error) {
      console.warn('Failed to restore auth state, continuing with defaults', error);
    } finally {
      setIsReady(true);
    }
  }, []);

  const persistState = (authState: { isAuthenticated: boolean; user: User; role: Role }) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        isAuthenticated: authState.isAuthenticated,
        currentUser: authState.user,
        currentRole: authState.role,
      }),
    );
  };

  const login = (userData: User) => {
    const nextRole = userData.role || 'Engineer';
    const nextUser = { ...defaultUser, ...userData, role: nextRole };

    setIsAuthenticated(true);
    setCurrentRole(nextRole);
    setCurrentUser(nextUser);
    persistState({ isAuthenticated: true, user: nextUser, role: nextRole });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentRole('Engineer');
    setCurrentUser(defaultUser);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const setRole = (role: Role) => {
    setCurrentRole(role);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, currentRole: role }));
      }
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...userData };
      persistState({ isAuthenticated, user: updated, role: updated.role || currentRole });
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isReady,
        currentRole,
        currentUser,
        login,
        logout,
        setRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
