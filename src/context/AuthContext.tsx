import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { User } from "@/types";
import { authService } from "@/service/auth.service";

// user type define
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch current authenticated user from backend
  const fetchUser = async () => {
    try {
      setError(null);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // refresh user data
  const refetchUser = async () => {
    setIsLoading(true);
    await fetchUser();
  };

// handle user login and update state
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const loggedUser = await authService.login({ email, password });
      setUser(loggedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login error");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


// handle user registration and update state
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const newUser = await authService.register({ name, email, password });
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration error");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // handle logout and clear user state
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout error");
      throw err;
    }
  };

  // enable for child component
  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// use anywhere
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};