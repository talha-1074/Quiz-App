// src/context/AuthContext.tsx
// This file manages login state for the whole app
// Any screen can access user info using useAuth()

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

// Define what our context will have
interface AuthContextType {
  user: User | null; // logged in user info
  token: string | null; // JWT token
  loading: boolean; // true while checking saved login
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// AuthProvider wraps the whole app
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // When app starts, check if user was already logged in
  useEffect(() => {
    checkSavedLogin();
  }, []);

  const checkSavedLogin = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("token");
      const savedUser = await AsyncStorage.getItem("user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log("Error reading saved login:", error);
    } finally {
      setLoading(false); // done checking
    }
  };

  // Save login info to storage
  const login = async (userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    await AsyncStorage.setItem("token", tokenData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  // Clear login info from storage
  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this in any screen
// Example: const { user, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
