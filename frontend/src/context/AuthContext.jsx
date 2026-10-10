import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService.js';
import { profileService } from '../api/profileService.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Safely decodes JWT payload (without external libraries)
 */
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('careerconnect_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('careerconnect_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Check token validity on startup
  useEffect(() => {
    const initAuth = () => {
      const savedToken = localStorage.getItem('careerconnect_token');
      if (savedToken) {
        const decoded = parseJwt(savedToken);
        // Check if token has expired (exp in seconds)
        if (decoded && decoded.exp && decoded.exp * 1000 < Date.now()) {
          // Token is expired
          logout();
        } else {
          setToken(savedToken);
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for unauthorized 401 events from Axios interceptor
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('careerconnect:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('careerconnect:unauthorized', handleUnauthorized);
    };
  }, []);

  /**
   * Log in user, extract role and token, persist in localStorage
   */
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    
    // Normalizing response:
    // Spring Boot response might return { token, role, user, email, name, id } or { jwt, role, ... }
    const authToken = data.token || data.jwt || data.accessToken || (typeof data === 'string' ? data : null);
    
    if (!authToken) {
      throw new Error('No authentication token received from the backend.');
    }

    const decoded = parseJwt(authToken);
    
    // Determine user role (can be in data.role, decoded.role, decoded.roles[0], data.user.role, etc.)
    let role = data.role || data.user?.role || decoded?.role || (Array.isArray(decoded?.roles) ? decoded.roles[0] : null);
    
    if (role && typeof role === 'string') {
      role = role.replace('ROLE_', '').toUpperCase();
    } else {
      // Default to STUDENT if not specified
      role = 'STUDENT';
    }

    const userInfo = {
      id: data.id || data.userId || data.user?.id || decoded?.id || decoded?.sub,
      email: data.email || data.user?.email || decoded?.sub || credentials.email || credentials.username,
      name: data.name || data.fullName || data.companyName || data.user?.name || credentials.email,
      role: role,
    };

    localStorage.setItem('careerconnect_token', authToken);
    localStorage.setItem('careerconnect_user', JSON.stringify(userInfo));

    setToken(authToken);
    setUser(userInfo);

    return { token: authToken, user: userInfo };
  };

  /**
   * Register student
   */
  const registerStudent = async (studentData) => {
    return await authService.registerStudent(studentData);
  };

  /**
   * Register company
   */
  const registerCompany = async (companyData) => {
    return await authService.registerCompany(companyData);
  };

  /**
   * Logout user, clear storage and state
   */
  const logout = () => {
    localStorage.removeItem('careerconnect_token');
    localStorage.removeItem('careerconnect_user');
    setToken(null);
    setUser(null);
  };

  /**
   * Update local user state (e.g. after profile edit)
   */
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('careerconnect_user', JSON.stringify(updated));
      return updated;
    });
  };

  const role = user?.role ? user.role.toUpperCase() : null;
  const isStudent = role === 'STUDENT';
  const isCompany = role === 'COMPANY';
  const isAdmin = role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        isStudent,
        isCompany,
        isAdmin,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        registerStudent,
        registerCompany,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
