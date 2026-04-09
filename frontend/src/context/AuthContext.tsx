import { createContext, useEffect, useState } from "react";
import { api } from "../api/client";
import type { User } from "../types";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

type RegisterPayload = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  job_title: string;
  bio: string;
  password: string;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("taskforge_access");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get<User>("/auth/me/");
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("taskforge_access");
        localStorage.removeItem("taskforge_refresh");
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await api.post<{ access: string; refresh: string }>("/auth/login/", {
      username,
      password
    });
    localStorage.setItem("taskforge_access", response.data.access);
    localStorage.setItem("taskforge_refresh", response.data.refresh);
    const profile = await api.get<User>("/auth/me/");
    setUser(profile.data);
  };

  const register = async (payload: RegisterPayload) => {
    await api.post("/auth/register/", payload);
    await login(payload.username, payload.password);
  };

  const logout = () => {
    localStorage.removeItem("taskforge_access");
    localStorage.removeItem("taskforge_refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
