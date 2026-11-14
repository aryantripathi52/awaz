import { supabase, isSupabaseConfigured } from './supabase';
import { User, Session } from '@supabase/supabase-js';

export interface AuthProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  shopName?: string;
}

/**
 * Trigger Google OAuth Sign-In flow
 */
export async function signInWithGoogle(): Promise<{ error: Error | null; url?: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    // If Supabase is not yet configured, simulate guest sign-in
    if (typeof window !== 'undefined') {
      localStorage.setItem('bahikhaata_demo_user', JSON.stringify({
        id: 'google-demo-user',
        email: 'chaiwala@example.com',
        fullName: 'राजू चायवाला (Google User)',
        avatarUrl: '',
        shopName: 'राजू टी स्टॉल',
      }));
      window.location.href = '/dashboard';
    }
    return { error: null };
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return { error, url: data.url };
}

/**
 * Sign in using email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
  if (!isSupabaseConfigured || !supabase) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bahikhaata_demo_user', JSON.stringify({
        id: 'demo-user',
        email,
        fullName: email.split('@')[0],
      }));
    }
    return { user: null, error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { user: data.user, error };
}

/**
 * Sign up using email and password
 */
export async function signUpWithEmail(email: string, password: string, shopName?: string): Promise<{ user: User | null; error: Error | null }> {
  if (!isSupabaseConfigured || !supabase) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bahikhaata_demo_user', JSON.stringify({
        id: 'demo-user',
        email,
        fullName: email.split('@')[0],
        shopName: shopName || 'मेरी दुकान',
      }));
    }
    return { user: null, error: null };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        shop_name: shopName || 'मेरी दुकान',
      },
    },
  });

  return { user: data.user, error };
}

/**
 * Sign Out
 */
export async function signOut(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('bahikhaata_demo_user');
  }
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
}

/**
 * Get current session / active user
 */
export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured || !supabase) {
    if (typeof window !== 'undefined') {
      const demo = localStorage.getItem('bahikhaata_demo_user');
      if (demo) {
        return JSON.parse(demo) as unknown as User;
      }
    }
    return null;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
