import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileCheck2, 
  Target, 
  AlertTriangle, 
  Upload, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles, 
  Calendar,
  PenTool,
  HelpCircle,
  Eye,
  Trash2,
  Edit3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { AnalysisResult } from '../types';

interface DashboardProps {
  onSelectAnalysis: (result: AnalysisResult) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectAnalysis }) => {
  const { user, history, setActiveTab, deleteAnalysis, updateProfile } = useAuth();
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [roleInput, setRoleInput] = useState(user?.targetRole || '');

  useEffect(() => {
    setRoleInput(user?.targetRole || '');
  }, [user?.targetRole]);

  const handleSaveRole = () => {
    updateProfile({ targetRole: roleInput.trim() });
    setIsEditingRole(false);
  };

  const totalAnalyzed = history.length;
  const avgAtsScore = totalAnalyzed > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.atsScore, 0) / totalAnalyzed)
    : 82;

  const latestAnalysis = history[0];

  // Radar chart data for ATS criteria
  const radarData = latestAnalysis ? [
    { category: 'Formatting', score: latestAnalysis.scoreBreakdown.formatting, fullMark: 100 },
    { category: 'Keywords', score: latestAnalysis.scoreBreakdown.keywords, fullMark: 100 },
    { category: 'Impact & Results', score: latestAnalysis.scoreBreakdown.impactResults, fullMark: 100 },
    { category: 'Action Verbs', score: latestAnalysis.scoreBreakdown.actionVerbs, fullMark: 100 },
    { category: 'Completeness', score: latestAnalysis.scoreBreakdown.completeness, fullMark: 100 },
  ] : [
    { category: 'Formatting', score: 90, fullMark: 100 },
    { category: 'Keywords', score: 85, fullMark: 100 },
    { category: 'Impact & Results', score: 88, fullMark: 100 },
    { category: 'Action Verbs', score: 82, fullMark: 100 },
    { category: 'Completeness', score: 80, fullMark: 100 },
  ];

  // Progression history chart data
  const progressionData = history
    .slice()
    .reverse()
    .map((item, idx) => ({
      name: item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title,
      score: item.atsScore,
      date: new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              <span>AI Resume Copilot Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome to ResumeIQ AI
            </h1>
            <div className="text-slate-300 text-sm leading-relaxed flex flex-wrap items-center gap-2">
              <span>Target Role:</span>
              {isEditingRole ? (
                <span className="inline-flex items-center gap-1.5 my-0.5">
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    placeholder="Type target role..."
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 border border-blue-400 text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRole();
                      if (e.key === 'Escape') setIsEditingRole(false);
                    }}
                  />
                  <button
                    onClick={handleSaveRole}
                    className="px-2.5 py-1 text-xs font-bold bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-colors shadow-xs"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingRole(false)}
                    className="px-2 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-bold text-blue-300">
                    {user?.targetRole?.trim() || 'Not Selected'}
                  </span>
                  <button
                    onClick={() => setIsEditingRole(true)}
                    className="p-1 rounded-md text-blue-300/80 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit Target Role manually"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              <span>• Analyze your resume against automated ATS filters, detect skill gaps, and optimize for interview shortlists.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dash-cta-analyze-btn"
              onClick={() => setActiveTab('analyzer')}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/30 transition-all flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Analyze Resume</span>
            </button>
            <button
              id="dash-cta-builder-btn"
              onClick={() => setActiveTab('builder')}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all flex items-center space-x-2"
            >
              <PenTool className="h-4 w-4" />
              <span>AI Builder</span>
            </button>
          </div>
        </div>

        {/* Decorative background blur glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Average ATS Score</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{avgAtsScore}</span>
              <span className="text-xs text-slate-400 font-medium">/ 100</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +5% optimization gain
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <BarChart3 className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Resumes Analyzed</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalAnalyzed}</span>
              <span className="text-xs text-slate-400 font-medium">files</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Stored in history
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileCheck2 className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Target Role Match</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {latestAnalysis?.jobMatch ? `${latestAnalysis.jobMatch.matchPercentage}%` : '86%'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              High match potential
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Target className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Key Action Item</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 line-clamp-1">
              {latestAnalysis?.criticalRedFlags?.[0] || 'Add quantified outcome metrics'}
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" /> High priority fix
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Breakdown Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">ATS Score Criteria Breakdown</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Analysis metrics from latest evaluation</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              Score: {latestAnalysis?.atsScore || 88}/100
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" opacity={0.3} />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={10} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ATS Score Progression Over Time */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">ATS Score Progress History</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Improvement trend across resume revisions</p>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              View Full History <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressionData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '8px', 
                    color: '#fff', 
                    fontSize: '12px' 
                  }} 
                />
                <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Feature Navigation Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div 
          onClick={() => setActiveTab('analyzer')}
          className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer shadow-xs hover:shadow-md"
        >
          <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Upload className="h-5 w-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Resume Analyzer
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload PDF/DOCX to receive deep ATS scoring, keyword matching, and line-by-line AI suggestions.
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('builder')}
          className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer shadow-xs hover:shadow-md"
        >
          <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <PenTool className="h-5 w-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            AI Resume Builder
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build high-converting ATS resumes with AI bullet rephrasing, executive summaries, and live PDF export.
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('interview')}
          className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 transition-all cursor-pointer shadow-xs hover:shadow-md"
        >
          <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <HelpCircle className="h-5 w-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            AI Interview Prep
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Practice customized interview questions based on your resume and get instant AI grading & feedback.
          </p>
        </div>

      </div>

      {/* Recent Analysis History Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Analysis Reports</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Click any record to inspect full AI analysis details</p>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All ({history.length})
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <p className="text-sm">No resume analyses saved yet.</p>
            <button
              onClick={() => setActiveTab('analyzer')}
              className="mt-3 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl"
            >
              Analyze Your First Resume
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Resume Title</th>
                  <th className="py-3 px-4">ATS Score</th>
                  <th className="py-3 px-4">Role Match</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {history.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center space-x-2">
                        <FileCheck2 className="h-4 w-4 text-blue-500 shrink-0" />
                        <span className="truncate max-w-xs">{item.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.atsScore >= 80 
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : item.atsScore >= 65
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}>
                        {item.atsScore} / 100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {item.jobMatch ? `${item.jobMatch.matchPercentage}% match` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => onSelectAnalysis(item)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors inline-flex items-center space-x-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => deleteAnalysis(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
