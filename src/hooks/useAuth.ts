import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast({ title: 'Bienvenido', description: 'Sesión iniciada correctamente' });
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Error al iniciar sesión',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      if (error) throw error;
      toast({ title: 'Cuenta creada', description: 'Tu cuenta ha sido creada exitosamente' });
    } catch (error: any) {
      let message = error.message;
      if (error.message?.includes('already registered')) {
        message = 'Este email ya está registrado. Intenta iniciar sesión.';
      }
      toast({ 
        title: 'Error', 
        description: message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ title: 'Sesión cerrada', description: 'Has cerrado sesión correctamente' });
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Error al cerrar sesión',
        variant: 'destructive'
      });
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
