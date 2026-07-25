import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ResumeIQLogo } from './ResumeIQLogo';
import { Shield, Sparkles, FileText, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, loginAsDemo } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full z-10 space-y-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner">
            <ResumeIQLogo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-4">
            Welcome to ResumeIQ AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Precision ATS Optimization, Executive Resume Builder & Real-time Interview Copilot
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          <div className="space-y-2 text-center">
            <h2 className="text-base font-bold text-white">Sign in to your account</h2>
            <p className="text-xs text-slate-400">
              Access your saved resumes, ATS analysis history, and AI interview tools
            </p>
          </div>

          {/* Primary Google Sign-In Button */}
          <button
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center justify-center space-x-3 group disabled:opacity-75 disabled:cursor-not-allowed border border-slate-200"
          >
            {isSigningIn ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Signing in with Google...</span>
              </div>
            ) : (
              <>
                {/* Official Google G Logo */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          {/* Feature Bullets */}
          <div className="pt-4 border-t border-slate-700/60 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Instant Gemini 3.6 Flash Resume Diagnostics</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Pixel-Perfect PDF Export (A4 Clean Layout)</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Interactive AI Mock Interviewer with Audio Feedback</span>
            </div>
          </div>

          {/* Quick Demo Login Option */}
          <div className="pt-3 border-t border-slate-700/40 text-center">
            <p className="text-[11px] text-slate-400 mb-2 font-medium">
              Want to preview before signing in?
            </p>
            <div className="flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={() => loginAsDemo('alex')}
                className="px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-xs text-slate-200 border border-slate-600 transition-colors"
              >
                Demo as Alex
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo('sarah')}
                className="px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-xs text-slate-200 border border-slate-600 transition-colors"
              >
                Demo as Sarah
              </button>
            </div>
          </div>

        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          <span>Secure Google Firebase Authentication</span>
        </div>

      </div>
    </div>
  );
};
