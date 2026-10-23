import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { getUsers, registerUser } from '../services/db';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLandlord: boolean;
  loginAs: (role: UserRole, userDetails?: Partial<User>) => void;
  registerLandlord: (name: string, phone: string, email: string) => User;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'kwahae_estates_active_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    // Default to visitor
    return {
      id: 'visitor-guest',
      fullName: 'Visitor / House Seeker',
      email: '',
      phone: '',
      role: 'visitor',
      registeredAt: new Date().toISOString()
    };
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const loginAs = (role: UserRole, userDetails?: Partial<User>) => {
    const users = getUsers();
    if (role === 'admin') {
      const admin = users.find(u => u.role === 'admin') || {
        id: 'admin-01',
        fullName: 'District Administrator',
        email: 'admin@kwahae.zm',
        phone: '+260977000111',
        role: 'admin',
        registeredAt: new Date().toISOString()
      };
      setCurrentUser(admin);
    } else if (role === 'landlord') {
      if (userDetails && userDetails.id) {
        const existing = users.find(u => u.id === userDetails.id);
        if (existing) {
          setCurrentUser(existing);
          return;
        }
      }
      const landlord = users.find(u => u.role === 'landlord') || {
        id: 'landlord-mubita-01',
        fullName: userDetails?.fullName || 'Mr. Mubita Silishebo',
        email: userDetails?.email || 'mubita.silishebo@gmail.com',
        phone: userDetails?.phone || '+260977451290',
        role: 'landlord',
        registeredAt: new Date().toISOString()
      };
      setCurrentUser(landlord);
    } else {
      setCurrentUser({
        id: 'visitor-guest',
        fullName: 'Visitor / House Seeker',
        email: '',
        phone: '',
        role: 'visitor',
        registeredAt: new Date().toISOString()
      });
    }
  };

  const registerLandlord = (name: string, phone: string, email: string): User => {
    const newUser = registerUser({
      fullName: name,
      phone: phone,
      email: email,
      role: 'landlord'
    });
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser({
      id: 'visitor-guest',
      fullName: 'Visitor / House Seeker',
      email: '',
      phone: '',
      role: 'visitor',
      registeredAt: new Date().toISOString()
    });
  };

  const switchDemoRole = (newRole: UserRole) => {
    loginAs(newRole);
  };

  const role = currentUser?.role || 'visitor';
  const isLoggedIn = role !== 'visitor';
  const isAdmin = role === 'admin';
  const isLandlord = role === 'landlord';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isLoggedIn,
        isAdmin,
        isLandlord,
        loginAs,
        registerLandlord,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
