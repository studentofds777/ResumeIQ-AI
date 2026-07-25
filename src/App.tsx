import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { ResumeBuilder } from './components/ResumeBuilder';
import { InterviewPrep } from './components/InterviewPrep';
import { AnalysisHistory } from './components/AnalysisHistory';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { LoginScreen } from './components/LoginScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { AnalysisResult } from './types';
import { ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading, activeTab, setActiveTab } = useAuth();
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);

  const handleSelectAnalysis = (result: AnalysisResult) => {
    setSelectedAnalysis(result);
    setActiveTab('analyzer');
  };

  if (loading) {
    return <LoadingScreen message="Checking authentication status..." />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors flex flex-col">
      
      {/* Top Header Navbar */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'landing' && <LandingPage />}

        {activeTab === 'dashboard' && (
          <Dashboard
            onSelectAnalysis={handleSelectAnalysis}
          />
        )}

        {activeTab === 'analyzer' && (
          <ResumeAnalyzer
            initialAnalysis={selectedAnalysis}
            onClearInitial={() => setSelectedAnalysis(null)}
          />
        )}

        {activeTab === 'builder' && <ResumeBuilder />}

        {activeTab === 'interview' && <InterviewPrep />}

        {activeTab === 'history' && (
          <AnalysisHistory
            onSelectAnalysis={handleSelectAnalysis}
          />
        )}
      </main>

      {/* App Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900 dark:text-white">ResumeIQ AI</span>
            <span>•</span>
            <span>Precision ATS Optimization & Interview Copilot</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Gemini 3.6 Flash Active</span>
            </span>
            <span>•</span>
            <span>© {new Date().getFullYear()} ResumeIQ AI</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
