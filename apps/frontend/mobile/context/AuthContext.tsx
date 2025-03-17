import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BACKEND_URL } from '@/lib/constants';
import { fetch } from 'expo/fetch';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

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

interface DecodedToken {
  exp: number;
  iat: number;
}

interface AuthContextType {
  user: User | null;
  refreshToken: string | null;
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
  refreshToken: null,
  address: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refresh: async () => {}
});

const TOKEN_REFRESH_INTERVAL = 13 * 60 * 1000; // 13 minutes
const TOKEN_EXPIRY_BUFFER = 60 * 1000; // 1 minute

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

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTokenFn = useCallback(async () => {
    if (!refreshToken) return null;

    try {
      console.log("Attempting to refresh token...");
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
      console.log("Token refresh successful");
      
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

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      const session = await getSessionData();
      
      if (session) {
        if (isTokenExpired(session.accessToken)) {
          console.log("Access token expired, refreshing...");
          const newAccessToken = await refreshTokenFn();
          if (!newAccessToken) {
            throw new Error("Failed to refresh token");
          }
        }

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
      await logout();
    } finally {
      setLoading(false);
    }
  }, [refreshTokenFn]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (!refreshToken) return;

    const interval = setInterval(async () => {
      if (accessToken && isTokenExpired(accessToken)) {
        console.log("Access token expired during interval, refreshing...");
        await refreshTokenFn();
      }
    }, TOKEN_REFRESH_INTERVAL);
  
    return () => clearInterval(interval);
  }, [refreshToken, accessToken, refreshTokenFn]);

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
        refreshToken,
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