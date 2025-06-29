import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'librarian' | 'student';
  rollNo?: string;
  department?: string;
  contact?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: {
    email: string;
    password: string;
    name: string;
    rollNo?: string;
    department?: string;
    contact?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Fetching profile for user:', supabaseUser.email);
      
      // First check if user exists in our users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // User doesn't exist in users table, create them
        console.log('User not found in users table, creating profile...');
        
        // Determine role based on email
        const role = supabaseUser.email === 'admin@nit.ac.in' ? 'admin' : 'student';
        const name = supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User';
        
        const newUserData = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: name,
          role: role,
          roll_no: supabaseUser.user_metadata?.roll_no || (role === 'student' ? 'DEMO2024001' : null),
          department: supabaseUser.user_metadata?.department || (role === 'student' ? 'Computer Science' : null),
          contact: supabaseUser.user_metadata?.contact || null,
        };

        const { data: insertedData, error: insertError } = await supabase
          .from('users')
          .insert(newUserData)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          setUser(null);
        } else {
          console.log('User profile created successfully');
          setUser({
            id: insertedData.id,
            email: insertedData.email,
            name: insertedData.name,
            role: insertedData.role,
            rollNo: insertedData.roll_no,
            department: insertedData.department,
            contact: insertedData.contact,
          });
        }
      } else if (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      } else if (data) {
        console.log('User profile found:', data.email);
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          rollNo: data.roll_no,
          department: data.department,
          contact: data.contact,
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log('Sign in successful for:', email);
      // The onAuthStateChange will handle setting the user
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (userData: {
    email: string;
    password: string;
    name: string;
    rollNo?: string;
    department?: string;
    contact?: string;
  }) => {
    setLoading(true);
    try {
      // Determine role based on email
      const role = userData.email === 'admin@nit.ac.in' ? 'admin' : 'student';
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: role,
            roll_no: userData.rollNo,
            department: userData.department,
            contact: userData.contact,
          }
        }
      });

      if (error) {
        throw error;
      }

      console.log('Sign up successful for:', userData.email);
      
      // If user is created and confirmed immediately, create profile
      if (data.user && !data.user.email_confirmed_at) {
        // User needs email confirmation
        console.log('User needs email confirmation');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}