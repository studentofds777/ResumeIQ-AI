import React, { useEffect, useState } from 'react';
import { ResumeIQLogo } from './ResumeIQLogo';
import { Sparkles, CheckCircle2, FileSearch, Cpu, Award } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  onCancel?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Analyzing Resume with Gemini AI...',
  subMessage = 'Evaluating ATS compatibility, keyword match, and executive impact',
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Parsing & Extracting Document Text', icon: FileSearch },
    { title: 'Gemini 3.6 Flash Intelligence Scan', icon: Cpu },
    { title: 'Computing ATS Keyword Match & Gap Metrics', icon: Sparkles },
    { title: 'Finalizing Actionable Career Insights', icon: Award },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-indigo-500/20 dark:border-indigo-500/30 text-center space-y-6 relative overflow-hidden">
        
        {/* Subtle Gradient Glow in Background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Brand Logo */}
        <div className="flex justify-center">
          <ResumeIQLogo size="lg" />
        </div>

        {/* Animated Scanner Ring */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-4 border-indigo-100 dark:border-slate-800 border-t-blue-600 border-r-purple-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
            {message}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {subMessage}
          </p>
        </div>

        {/* Dynamic Progress Steps */}
        <div className="space-y-2.5 text-left bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={idx} className="flex items-center space-x-3 text-xs">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                ) : isCurrent ? (
                  <div className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-700 flex-shrink-0" />
                )}
                <span
                  className={`font-medium transition-colors ${
                    isDone
                      ? 'text-emerald-600 dark:text-emerald-400 line-through opacity-80'
                      : isCurrent
                      ? 'text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors pt-2 underline"
          >
            Cancel Analysis
          </button>
        )}
      </div>
    </div>
  );
};
