import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BACKEND_URL } from '@/lib/constants';
import { fetch } from 'expo/fetch';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string[];
}

export interface AddressPayload {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  address: AddressPayload | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  address: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refresh: async () => {}
});

async function getSessionData() {
  try {
    const [userDataStr, accessToken, refreshToken, addressDataStr] = await Promise.all([
      SecureStore.getItemAsync("userData"),
      SecureStore.getItemAsync("accessToken"),
      SecureStore.getItemAsync("refreshToken"),
      SecureStore.getItemAsync("addressData")
    ]);

    if (!userDataStr || !accessToken || !refreshToken) {
      return null;
    }

    return {
      user: JSON.parse(userDataStr),
      accessToken,
      refreshToken,
      address: addressDataStr ? JSON.parse(addressDataStr) : null
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      const session = await getSessionData();
      
      if (session) {
        setUser(session.user);
        setAccessToken(session.accessToken);
        setRefreshToken(session.refreshToken);
        setAddress(session.address);
      } else {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        setAddress(null);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTokenFn = useCallback(async () => {
    if (!refreshToken) return null;
    
    try {
      const response = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`,
        },
        credentials: "include",
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Invalid refresh token");
      }

      const data = await response.json();
      
      await Promise.all([
        SecureStore.setItemAsync("accessToken", data.accessToken),
        SecureStore.setItemAsync("refreshToken", data.refreshToken)
      ]);
      
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      
      return data.accessToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      await logout();
      return null;
    }
  }, [refreshToken]);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (!refreshToken) return;
    
    const interval = setInterval(refreshTokenFn, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshToken, refreshTokenFn]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Přihlášení selhalo');
      }

      await Promise.all([
        SecureStore.setItemAsync("userData", JSON.stringify(data.user)),
        SecureStore.setItemAsync("accessToken", data.accessToken),
        SecureStore.setItemAsync("refreshToken", data.refreshToken),
        data.address ? SecureStore.setItemAsync("addressData", JSON.stringify(data.address)) : Promise.resolve()
      ]);
      
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setAddress(data.address);

      router.replace('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Přihlášení selhalo');
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registrace selhala');
      }

      await Promise.all([
        SecureStore.setItemAsync("userData", JSON.stringify(data.user)),
        SecureStore.setItemAsync("accessToken", data.accessToken),
        SecureStore.setItemAsync("refreshToken", data.refreshToken)
      ]);
      
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);

      router.replace('/');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Registrace selhala');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync("userData"),
        SecureStore.deleteItemAsync("accessToken"),
        SecureStore.deleteItemAsync("refreshToken"),
        SecureStore.deleteItemAsync("addressData")
      ]);
      
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setAddress(null);
      
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refresh = async () => {
    await loadUserData();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        address,
        loading,
        error,
        login,
        register,
        logout,
        refresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}