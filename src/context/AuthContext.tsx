import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AnalysisResult, ResumeData } from '../types';
import { INITIAL_ANALYSIS_HISTORY, INITIAL_RESUME_BUILDER_DATA } from '../data/mockData';
import { auth, googleProvider, signInWithPopup, signInWithRedirect, firebaseSignOut, onAuthStateChanged, FirebaseUser } from '../lib/firebase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsDemo: (type?: 'alex' | 'sarah') => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // History & Resumes State
  history: AnalysisResult[];
  addAnalysis: (result: AnalysisResult) => void;
  deleteAnalysis: (id: string) => void;
  
  savedResume: ResumeData;
  updateSavedResume: (resume: ResumeData) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<string, UserProfile> = {
  alex: {
    uid: 'demo-user-1',
    email: 'alex.morgan@example.com',
    displayName: 'Alex Morgan',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    targetRole: 'Senior Full Stack Engineer',
    experienceLevel: 'Senior',
    industry: 'Software & Cloud',
    createdAt: new Date().toISOString(),
  },
  sarah: {
    uid: 'demo-user-2',
    email: 'sarah.chen@example.com',
    displayName: 'Sarah Chen',
    photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    targetRole: 'Product Manager',
    experienceLevel: 'Mid-Level',
    industry: 'Product & FinTech',
    createdAt: new Date().toISOString(),
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [history, setHistory] = useState<AnalysisResult[]>(() => {
    const stored = localStorage.getItem('resumeiq_history');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { /* ignore */ }
    }
    return INITIAL_ANALYSIS_HISTORY;
  });

  const [savedResume, setSavedResume] = useState<ResumeData>(() => {
    const stored = localStorage.getItem('resumeiq_saved_resume');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { /* ignore */ }
    }
    return INITIAL_RESUME_BUILDER_DATA;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        let storedMeta: Partial<UserProfile> = {};
        try {
          const raw = localStorage.getItem(`resumeiq_meta_${fbUser.uid}`);
          if (raw) storedMeta = JSON.parse(raw);
        } catch { /* ignore */ }

        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Job Seeker',
          photoURL: fbUser.photoURL || '',
          targetRole: storedMeta.targetRole || '',
          experienceLevel: storedMeta.experienceLevel || 'Mid-Level',
          industry: storedMeta.industry || 'General',
          createdAt: storedMeta.createdAt || new Date().toISOString(),
        };
        setUser(profile);
      } else {
        // Fallback to local user if explicitly signed in via demo/mock
        const localUserRaw = localStorage.getItem('resumeiq_local_user');
        if (localUserRaw) {
          try {
            setUser(JSON.parse(localUserRaw));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('resumeiq_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('resumeiq_saved_resume', JSON.stringify(savedResume));
  }, [savedResume]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.warn('[Firebase Auth] Popup error, trying redirect:', error);
      if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/popup-closed-by-user') {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectErr) {
          console.error('[Firebase Auth] Redirect error:', redirectErr);
        }
      } else {
        console.error('[Firebase Auth] Google Sign-In failed:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, _pass: string) => {
    const existingName = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = existingName.charAt(0).toUpperCase() + existingName.slice(1);
    const newUser: UserProfile = {
      uid: 'user-' + Date.now(),
      email,
      displayName: formattedName || 'User',
      targetRole: '',
      experienceLevel: 'Mid-Level',
      industry: 'Technology',
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('resumeiq_local_user', JSON.stringify(newUser));
  };

  const signup = async (displayName: string, email: string, _pass: string) => {
    const newUser: UserProfile = {
      uid: 'user-' + Date.now(),
      email,
      displayName,
      targetRole: '',
      experienceLevel: 'Mid-Level',
      industry: 'Technology',
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('resumeiq_local_user', JSON.stringify(newUser));
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('[Firebase Logout Error]:', err);
    }
    localStorage.removeItem('resumeiq_local_user');
    setUser(null);
    setLoading(false);
  };

  const loginAsDemo = (type: 'alex' | 'sarah' = 'alex') => {
    const demo = DEMO_USERS[type];
    setUser(demo);
    localStorage.setItem('resumeiq_local_user', JSON.stringify(demo));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      if (updated.uid) {
        localStorage.setItem(`resumeiq_meta_${updated.uid}`, JSON.stringify({
          targetRole: updated.targetRole,
          experienceLevel: updated.experienceLevel,
          industry: updated.industry,
          createdAt: updated.createdAt
        }));
      }
      return updated;
    });
  };

  const addAnalysis = (result: AnalysisResult) => {
    setHistory((prev) => [result, ...prev]);
  };

  const deleteAnalysis = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const updateSavedResume = (resume: ResumeData) => {
    setSavedResume(resume);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signInWithGoogle,
        login,
        signup,
        logout,
        loginAsDemo,
        updateProfile,
        history,
        addAnalysis,
        deleteAnalysis,
        savedResume,
        updateSavedResume,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
