import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  login as loginUser,
  logout as logoutUser,
  fetchUser,
} from '../services/api';

import { AxiosError } from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  authLoading: boolean;
  fetchCurrentUser: () => Promise<void>;
}

interface ErrorResponse {
  error: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetchUser();
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    try {
      const response = await loginUser(email, password);
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setUser(user);
      setIsAuthenticated(true);
      return null;
    } catch (error) {
      setIsAuthenticated(false);
      const axiosError = error as AxiosError<ErrorResponse>;
      return axiosError.response?.data?.error || 'An error occurred';
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetchUser();
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        user,
        authLoading,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
