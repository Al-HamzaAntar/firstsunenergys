import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isEditor: boolean;
  hasAccess: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Don't call async functions inside the auth callback to prevent deadlocks
        // Use setTimeout to defer the role checks
        if (session?.user) {
          setTimeout(() => {
            checkUserRoles(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsEditor(false);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await checkUserRoles(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRoles = async (userId: string) => {
    // Check admin role
    const { data: adminData, error: adminError } = await supabase
      .rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });
    
    // Check editor role
    const { data: editorData, error: editorError } = await supabase
      .rpc('has_role', {
        _user_id: userId,
        _role: 'editor'
      });
    
    setIsAdmin(!!adminData && !adminError);
    setIsEditor(!!editorData && !editorError);
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Successfully signed in!');
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Account created! You can now sign in.');
  };

  const signOut = async () => {
    // Clear state immediately before calling signOut
    setIsAdmin(false);
    setIsEditor(false);
    setUser(null);
    setSession(null);
    
    try {
      // Sign out with scope: 'global' to clear all sessions
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      // Ignore session missing errors - user is already logged out
      if (error && error.message !== 'Auth session missing!' && !error.message.includes('session_not_found')) {
        console.error('Sign out error:', error);
        toast.error(error.message);
        throw error;
      }
    } finally {
      // Force clear localStorage as extra precaution
      localStorage.removeItem('supabase.auth.token');
      
      toast.success('Signed out successfully');
      navigate('/auth');
    }
  };

  const hasAccess = isAdmin || isEditor;

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isEditor, hasAccess, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
