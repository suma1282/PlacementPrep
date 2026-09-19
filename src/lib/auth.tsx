import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/prep-types";

export type SignUpInput = {
  email: string;
  password: string;
  name: string;
  college: string;
  branch: string;
  graduationYear: string;
  targetRole: string;
};

type AuthResult = { error: string | null };

interface AuthValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (input: SignUpInput) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function mapProfileRow(row: {
  full_name: string | null;
  college: string | null;
  branch: string | null;
  graduation_year: string | null;
  target_role: string | null;
  skills: string[] | null;
}): Profile {
  return {
    name: row.full_name ?? "",
    college: row.college ?? "",
    branch: row.branch ?? "",
    graduationYear: row.graduation_year ?? "",
    targetRole: row.target_role ?? "",
    skills: row.skills ?? [],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (input: SignUpInput): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        data: { full_name: input.name.trim() },
      },
    });
    if (error) return { error: error.message };

    const userId = data.user?.id;
    if (!userId) {
      return { error: "Account created, but no session was returned. Try signing in." };
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      full_name: input.name.trim(),
      college: input.college.trim(),
      branch: input.branch.trim(),
      graduation_year: input.graduationYear.trim(),
      target_role: input.targetRole.trim(),
      skills: [],
    });
    if (profileError) return { error: profileError.message };

    return { error: null };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async (): Promise<AuthResult> => {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message ?? null };
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ user, session, loading, signUp, signIn, signOut }),
    [user, session, loading, signUp, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
