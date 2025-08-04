"use client";

import type React from "react";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  login as apiLogin,
  signup as apiSignup,
  getCurrentUser,
} from "@/lib/api/auth";


type SignupData = {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
};

export const AuthContext = createContext<any | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();


  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log(token)
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch current user data
        const userData = await getCurrentUser();
        // console.log(userData)
        setUser(userData);
      } catch (error) {
        // console.error("Authentication check failed:", error);
        // Token is invalid or expired
        // console.log(error)
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // console.log(email, password)
      setLoading(true);
      const response = await apiLogin({ email, password });
      // console.log(response)
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setUser(response.foundUser);

      toast({
        title: "Login successful",
        description: `Welcome back, ${response.foundUser.firstName}!`,
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
      // console.log(userData)
      setLoading(true);
      const response = await apiSignup({
        username: userData.username,
        displayName: userData.username,
        email: userData.email,
        userType: "alumni",
        surName: userData.lastname,
        firstName: userData.firstname,
        password: userData.password
      });
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setUser(response.foundUser);

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
    localStorage.removeItem("refreshToken");
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
