import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
  ArrowRightLeft, 
  FileText, 
  CheckCircle2, 
  Download, 
  X,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnalysisResult } from '../types';

interface AnalysisHistoryProps {
  onSelectAnalysis: (result: AnalysisResult) => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ onSelectAnalysis }) => {
  const { history, deleteAnalysis } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Side by Side Comparison Modal State
  const [compareItemA, setCompareItemA] = useState<AnalysisResult | null>(null);
  const [compareItemB, setCompareItemB] = useState<AnalysisResult | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const filteredHistory = history.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openComparison = () => {
    if (history.length >= 2) {
      setCompareItemA(history[0]);
      setCompareItemB(history[1]);
      setIsCompareOpen(true);
    } else {
      alert('You need at least 2 saved analyses to use side-by-side comparison.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <History className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>Analysis History & Comparisons</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse previous ATS reports, track progress across revisions, and compare two resumes side-by-side.
          </p>
        </div>

        {history.length >= 2 && (
          <button
            onClick={openComparison}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span>Compare 2 Resumes Side-by-Side</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search analyses by title or filename..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  item.atsScore >= 80 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}>
                  ATS: {item.atsScore}/100
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                {item.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Target Role: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.targetRole || item.detectedTargetRole || 'Not Selected'}</span>
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                File: <span className="font-mono text-slate-700 dark:text-slate-300">{item.fileName}</span>
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <span>{item.keyStrengths.length} Strengths</span>
                <span>{item.criticalRedFlags.length} Red Flags</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onSelectAnalysis(item)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Inspect Report</span>
              </button>

              <button
                onClick={() => deleteAnalysis(item.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                title="Delete analysis"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Side-by-Side Resume Comparison Modal */}
      {isCompareOpen && compareItemA && compareItemB && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
                <span>Side-by-Side Resume Revision Comparison</span>
              </h3>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Revision A */}
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-400 uppercase">Version 1</span>
                    <span className="text-xl font-extrabold text-blue-600">{compareItemA.atsScore}/100</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{compareItemA.title}</h4>
                  <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                    <p>Formatting: {compareItemA.scoreBreakdown.formatting}%</p>
                    <p>Keywords: {compareItemA.scoreBreakdown.keywords}%</p>
                    <p>Impact: {compareItemA.scoreBreakdown.impactResults}%</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsCompareOpen(false);
                    onSelectAnalysis(compareItemA);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Inspect Version 1 Report</span>
                </button>
              </div>

              {/* Revision B */}
              <div className="p-5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-indigo-600 uppercase">Version 2 (Latest)</span>
                    <span className="text-xl font-extrabold text-indigo-600">{compareItemB.atsScore}/100</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{compareItemB.title}</h4>
                  <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                    <p>Formatting: {compareItemB.scoreBreakdown.formatting}%</p>
                    <p>Keywords: {compareItemB.scoreBreakdown.keywords}%</p>
                    <p>Impact: {compareItemB.scoreBreakdown.impactResults}%</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsCompareOpen(false);
                    onSelectAnalysis(compareItemB);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Inspect Version 2 Report</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
