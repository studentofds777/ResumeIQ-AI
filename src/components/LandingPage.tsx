import React from 'react';
import { 
  Sparkles, 
  FileCheck, 
  Target, 
  Bot, 
  PenTool, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Star,
  Users,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_RESUMES } from '../data/mockData';

export const LandingPage: React.FC = () => {
  const { setActiveTab } = useAuth();

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-indigo-500/20">
        
        {/* Glowing Background Orbs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              <span>Next-Gen Gemini 3.6 AI Career Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Beat the ATS Filter & Land Your <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Dream Role</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              ResumeIQ AI analyzes your resume against top ATS algorithms, calculates real-time job description match percentages, rewrites impactful experience bullets, and trains you for interviews.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setActiveTab('analyzer')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <FileCheck className="h-4 w-4" />
                <span>Analyze Your Resume Free</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setActiveTab('builder')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md transition-all flex items-center justify-center space-x-2"
              >
                <PenTool className="h-4 w-4 text-purple-300" />
                <span>Build New AI Resume</span>
              </button>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300 font-medium">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Real-Time Gemini 3.6 Scoring</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Export PDF & TXT</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Mock Score Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-5 transform hover:scale-[1.02] transition-all">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    IQ
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Live ResumeIQ Audit</h3>
                    <p className="text-[11px] text-slate-400">Custom Candidate Profile</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ATS Ready
                </span>
              </div>

              {/* Gauge Meter Display */}
              <div className="flex items-center justify-around bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" className="text-slate-800" fill="transparent" />
                      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" className="text-emerald-500" strokeDasharray="200" strokeDashoffset="24" strokeLinecap="round" fill="transparent" />
                    </svg>
                    <span className="absolute text-lg font-black text-white">88%</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">Overall ATS Score</p>
                </div>

                <div className="h-12 w-[1px] bg-slate-800" />

                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" className="text-slate-800" fill="transparent" />
                      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" className="text-blue-500" strokeDasharray="200" strokeDashoffset="16" strokeLinecap="round" fill="transparent" />
                    </svg>
                    <span className="absolute text-lg font-black text-white">92%</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">Target Job Match</p>
                </div>
              </div>

              {/* Quick AI Highlights */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 text-slate-300">
                  <span className="flex items-center space-x-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Action Verbs & Impact Metrics</span>
                  </span>
                  <span className="font-bold text-emerald-400">Strong</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 text-slate-300">
                  <span className="flex items-center space-x-2">
                    <Target className="h-3.5 w-3.5 text-amber-400" />
                    <span>Missing 2 Target Keywords</span>
                  </span>
                  <span className="font-bold text-amber-400">Kubernetes, GraphQL</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('analyzer')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center space-x-1"
              >
                <span>Run Instant Analysis On Your Resume</span>
                <ChevronRight className="h-4 w-4" />
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: '98.4%', label: 'ATS Parsing Accuracy', icon: ShieldCheck, color: 'text-blue-600 dark:text-blue-400' },
          { value: '3.2x', label: 'More Interview Invites', icon: TrendingUp, color: 'text-purple-600 dark:text-purple-400' },
          { value: '15,000+', label: 'Resumes Analyzed', icon: Users, color: 'text-indigo-600 dark:text-indigo-400' },
          { value: '4.9 / 5', label: 'User Satisfaction Rating', icon: Star, color: 'text-amber-500' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Feature Capabilities Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            Complete Career Optimization Suite
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Everything You Need to Stand Out
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Powered by Gemini 3.6 Flash, engineered specifically for modern ATS software (Workday, Greenhouse, Lever, Taleo).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-blue-500/40 transition-all space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Deep ATS Resume Analyzer</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload PDF or paste plain text. Get a complete score breakdown covering formatting, keyword coverage, action verbs, and quantify achievements.
            </p>
            <button onClick={() => setActiveTab('analyzer')} className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1 hover:underline">
              <span>Try Analyzer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-purple-500/40 transition-all space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-600/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Job Description Matcher</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Paste the target job description to reveal missing technical and soft skills, role fit analysis, and tailored keywords to add before applying.
            </p>
            <button onClick={() => setActiveTab('analyzer')} className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center space-x-1 hover:underline">
              <span>Match Against Job</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-indigo-500/40 transition-all space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <PenTool className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Interactive AI Builder</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Design ATS-compliant resumes with modular sections, AI bullet point generation, custom styling templates, and direct PDF download.
            </p>
            <button onClick={() => setActiveTab('builder')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1 hover:underline">
              <span>Open Resume Builder</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Interview Prep Copilot</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Generate tailored interview questions based on your target role. Practice answers and get real-time STAR framework feedback and scoring.
            </p>
            <button onClick={() => setActiveTab('interview')} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 hover:underline">
              <span>Practice Interviewing</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-amber-500/40 transition-all space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-600/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Version History & Compare</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Track ATS score improvements over time. Compare two resume versions side-by-side to verify keyword density and formatting gains.
            </p>
            <button onClick={() => setActiveTab('history')} className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1 hover:underline">
              <span>View History</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-rose-500/40 transition-all space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-600/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Instant AI Bullet Rewriter</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Turn weak responsibility bullet points into high-impact, metrics-driven achievements with single-click AI enhancements.
            </p>
            <button onClick={() => setActiveTab('builder')} className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-1 hover:underline">
              <span>Try AI Rewriter</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Instant 1-Click Sample Test Drive */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white space-y-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">Want to see it in action instantly?</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Select a pre-loaded sample resume profile to run a full live ATS audit in seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('analyzer')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-sm"
            >
              Test Senior Tech Resume
            </button>
            <button
              onClick={() => setActiveTab('analyzer')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-500/30 hover:bg-indigo-500/40 text-white border border-indigo-400/40 transition-colors"
            >
              Test Product Manager Resume
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
