"use client";

import type React from "react";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  login as apiLogin,
  signup as apiSignup,
  getCurrentUser,
  AuthResponse,
} from "@/lib/api/auth";

type User = AuthResponse["user"];

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

type SignupData = {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch current user data
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Authentication check failed:", error);
        // Token is invalid or expired
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiLogin({ email, password });
      localStorage.setItem("token", response.token);
      setUser(response.user);

      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.firstname}!`,
      });

      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during login",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      setLoading(true);
      const response = await apiSignup(userData);
      localStorage.setItem("token", response.token);
      setUser(response.user);

      toast({
        title: "Signup successful",
        description: "Your account has been created successfully!",
      });

      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during signup",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
