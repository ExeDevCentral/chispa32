"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export const SUPER_ADMIN_EMAIL = "echevarriaexequiell@gmail.com";

export function isSuperAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

export async function signInWithGoogle(redirectTo?: string) {
  const supabase = createClient();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const destination = redirectTo || "/";
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(destination)}`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error.message);
    throw error;
  }

  return data;
}

export async function signOutUser() {
  const supabase = createClient();
  await supabase.auth.signOut();
  if (typeof window !== "undefined") {
    localStorage.removeItem("chispa32_user_role");
    window.location.href = "/";
  }
}

export interface CurrentUserData {
  user: User | null;
  email: string | null;
  nombre: string;
  avatarUrl: string | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export function useCurrentUser(): CurrentUserData {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Check active session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const email = user?.email || null;
  const nombre = 
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (email ? email.split("@")[0] : "Usuario");
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  const isAdmin = isSuperAdmin(email);

  return {
    user,
    email,
    nombre,
    avatarUrl,
    isAdmin,
    isLoading,
  };
}
