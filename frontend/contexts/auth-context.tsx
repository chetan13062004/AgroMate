"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"
import { authApi } from "@/lib/api"

interface LoginResponse {
  success: boolean;
  error?: string;
  isPendingApproval?: boolean;
  user?: User;
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: string) => Promise<LoginResponse>
  register: (userData: any) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateUser: (userData: User) => void
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Load user from session on initial load
  useEffect(() => {
    const loadUser = async () => {
      // Skip if we're not in the browser
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      // Check if we have a token in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in localStorage, skipping auto-login');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching user session...');
        setLoading(true);
        setError(null);
        
        const response = await authApi.getMe();
        console.log('User session response:', response);
        
        if (response.error) {
          console.error('Error fetching user session:', response.error);
          setUser(null);
          localStorage.removeItem('token');
          return;
        }
        
        // Handle different response structures
        const userData = response.data?.user || response.data?.data?.user || null;
        
        if (userData) {
          console.log('User data loaded successfully:', { 
            id: userData._id, 
            email: userData.email,
            role: userData.role 
          });
          setUser(userData);
        } else {
          console.log('No user data in response');
          setUser(null);
          localStorage.removeItem('token');
        }
        
      } catch (err) {
        console.error('Failed to load user:', err);
        setError('Failed to load user session');
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [])

  const login = async (email: string, password: string, role?: string): Promise<LoginResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting login with email:', email);
      const response = await authApi.login({ email, password, role });
      console.log('Login response:', response);
      
      // Handle API errors
      if (response.error) {
        const errorMessage = typeof response.error === 'string' 
          ? response.error 
          : response.error?.message || 'Login failed. Please try again.';
        
        console.error('Login error:', errorMessage);
        setError(errorMessage);
        
        const isPendingApproval = errorMessage.toLowerCase().includes('pending') || 
                               errorMessage.toLowerCase().includes('approval');
        
        return { 
          success: false, 
          error: errorMessage,
          isPendingApproval
        };
      }
      
      // Handle different response structures
      const userData = response.data?.user || response.data?.data?.user || null;
      
      if (!userData) {
        const errorMsg = 'Login successful but no user data received';
        console.error(errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
      
      // Check if user is pending approval
      if (userData.role === 'farmer' && userData.status === 'pending') {
        return {
          success: false,
          error: 'Your account is pending admin approval',
          isPendingApproval: true,
          user: userData
        };
      }
      
      console.log('Login successful, user data:', {
        id: userData._id,
        email: userData.email,
        role: userData.role,
        status: userData.status
      });
      
      setUser(userData);
      
      // Store token if available in response
      const token = response.data?.token || response.data?.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      
      // Redirect based on user role or to dashboard
      const redirectPath = userData.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      console.log('Redirecting to:', redirectPath);
      
      // Use Next.js router for client-side navigation
      router.push(redirectPath);
      
      return { 
        success: true,
        user: userData
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      console.error('Login error:', err);
      setError(errorMessage);
      
      const isPendingApproval = errorMessage.toLowerCase().includes('pending') || 
                             errorMessage.toLowerCase().includes('approval');
      
      return { 
        success: false, 
        error: errorMessage,
        isPendingApproval
      };
    } finally {
      setLoading(false);
    }
  }

  const register = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare registration data based on role
      const registrationData: any = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'buyer',
      };
      
      // Add farmer-specific fields if role is farmer
      if (userData.role === 'farmer') {
        registrationData.location = {
          address: userData.address || '',
          coordinates: [0, 0]  // Default coordinates, can be updated later
        };
        registrationData.farmSize = userData.farmSize || '';
        
        // Handle categories - can be string (comma-separated) or array
        if (userData.categories) {
          if (Array.isArray(userData.categories)) {
            registrationData.categories = userData.categories;
          } else if (typeof userData.categories === 'string') {
            registrationData.categories = userData.categories
              .split(',')
              .map((s: string) => s.trim())
              .filter(Boolean);
          } else {
            registrationData.categories = [];
          }
        } else {
          registrationData.categories = [];
        }
      }

      console.log('Registration data:', registrationData);
      const response = await authApi.register(registrationData);
      console.log('Registration response:', response);
      
      // Handle API errors
      if (response.error) {
        const errorMessage = typeof response.error === 'string'
          ? response.error
          : response.error?.message || 'Registration failed. Please try again.';
          
        console.error('Registration error:', errorMessage);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
      
      // Verify we have user data in the response
      const userDataFromResponse = response.data?.user || response.data?.data?.user;
      if (!userDataFromResponse) {
        const errorMsg = 'Registration successful but no user data received';
        console.error(errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Auto login after successful registration
      console.log('Auto-logging in after registration...');
      const loginResponse = await login(userData.email, userData.password);
      
      if (!loginResponse.success) {
        const errorMsg = loginResponse.error || 'Registration successful but login failed';
        console.error('Auto-login after registration failed:', errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      console.log('Registration and auto-login successful');
      return { success: true };
      
    } catch (err) {
      let errorMessage = 'Registration failed';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        // Provide user-friendly error messages
        if (errorMessage.toLowerCase().includes('exists')) {
          errorMessage = 'A user with this email already exists';
        } else if (errorMessage.toLowerCase().includes('validation')) {
          errorMessage = 'Please fill in all required fields correctly';
        } else if (errorMessage.includes('400')) {
          errorMessage = 'Invalid registration data. Please check your input.';
        }
      }
      
      console.error('Registration error:', err);
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    try {
      console.log('Initiating logout...');
      
      // Clear user state first to prevent race conditions
      setUser(null);
      
      // Clear all auth-related items from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('Cleared local storage');
      }
      
      // Call the logout API to clear the HTTP-only cookie
      try {
        console.log('Calling logout API...');
        await authApi.logout();
        console.log('Logout API call successful');
      } catch (apiError) {
        console.error('Logout API error:', apiError);
        // Continue with client-side cleanup even if API call fails
      }
      
      // Redirect to login page
      console.log('Redirecting to login page...');
      router.push('/auth/login');
      
      // Force a full page reload to clear any cached data and state
      if (typeof window !== 'undefined') {
        console.log('Forcing page reload...');
        window.location.href = '/auth/login';
      }
    } catch (err) {
      console.error('Logout error:', err);
      // Ensure we still clear everything even if something fails
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
  }

  const updateUser = (userData: User) => {
    setUser(prev => ({
      ...prev,
      ...userData,
      location: {
        ...prev?.location,
        ...userData.location
      }
    }));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
