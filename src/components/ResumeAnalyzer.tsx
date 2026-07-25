import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Target, 
  ArrowRight, 
  Copy, 
  Check, 
  RefreshCw,
  Zap,
  Info,
  ChevronRight,
  Briefcase,
  Layers,
  Award,
  Loader2
} from 'lucide-react';
import { extractTextFromFile } from '../utils/fileExtractor';
import { exportElementToPDF } from '../utils/pdfGenerator';
import { AnalysisResult } from '../types';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from './LoadingScreen';
import { SAMPLE_RESUMES } from '../data/mockData';

interface ResumeAnalyzerProps {
  initialAnalysis?: AnalysisResult | null;
  onClearInitial?: () => void;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ initialAnalysis, onClearInitial }) => {
  const { addAnalysis, user, updateProfile } = useAuth();

  const [inputMode, setInputMode] = useState<'file' | 'paste'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [targetRole, setTargetRole] = useState<string>(user?.targetRole || '');

  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(initialAnalysis || null);
  const [activeTab, setActiveTab] = useState<'scorecard' | 'skills' | 'jobmatch' | 'suggestions'>('scorecard');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync if initialAnalysis prop changes
  React.useEffect(() => {
    if (initialAnalysis) {
      setCurrentResult(initialAnalysis);
    }
  }, [initialAnalysis]);

  React.useEffect(() => {
    if (user?.targetRole && targetRole !== user.targetRole) {
      setTargetRole(user.targetRole);
    }
  }, [user?.targetRole]);

  const handleRoleChange = (newRole: string) => {
    setTargetRole(newRole);
    updateProfile({ targetRole: newRole });
  };

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setIsExtracting(true);
    setAnalysisError(null);
    try {
      const { text } = await extractTextFromFile(file);
      setResumeText(text);
    } catch (err: any) {
      setAnalysisError(err.message || 'Error extracting file text.');
    } finally {
      setIsExtracting(false);
    }
  };

  const loadSampleResume = (sampleType: 'tech' | 'product') => {
    const sample = SAMPLE_RESUMES[sampleType];
    const newRole = sampleType === 'tech' ? 'Senior Software Engineer' : 'Product Manager';
    setResumeText(sample.resumeText);
    setJobDescription(sample.jobDescription);
    setTargetRole(newRole);
    updateProfile({ targetRole: newRole });
    setSelectedFile(null);
    setInputMode('paste');
  };

  const runAnalysis = async () => {
    const finalResumeText = resumeText;

    if (!finalResumeText || finalResumeText.trim().length < 30) {
      setAnalysisError('Please upload a resume file or paste resume text first.');
      return;
    }

    if (targetRole && targetRole.trim()) {
      updateProfile({ targetRole: targetRole.trim() });
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: finalResumeText,
          jobDescription,
          targetRole,
          fileName: selectedFile ? selectedFile.name : `${(targetRole || 'Resume').replace(/\s+/g, '_')}.txt`
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to analyze resume.');
      }

      const data: AnalysisResult = await response.json();
      
      // Automatically update the target role based on the latest job description / AI detection
      const finalRole = data.detectedTargetRole?.trim() || data.targetRole?.trim() || targetRole?.trim() || '';
      
      if (finalRole) {
        setTargetRole(finalRole);
        updateProfile({ targetRole: finalRole });
        data.targetRole = finalRole;
      }
      
      const roleTitle = finalRole || 'Resume';
      data.title = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : `${roleTitle} Analysis`;
      data.userId = user?.uid || 'guest';

      setCurrentResult(data);
      addAnalysis(data);

      if (onClearInitial) onClearInitial();
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalysisError(err.message || 'Failed to analyze resume. Please check your network connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadPDF = async () => {
    setIsExportingPdf(true);
    try {
      await exportElementToPDF('resumeiq-report-view', `${currentResult?.title || 'ResumeIQ'}-Report.pdf`);
    } catch (err) {
      console.error('Download PDF report error:', err);
      alert('Could not export PDF report. Please check the console for details.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Full Page AI Scanning Loader */}
      {isAnalyzing && (
        <LoadingScreen
          message={`Analyzing ${targetRole} Resume...`}
          subMessage="Gemini 3.6 Flash is checking ATS keywords, section formats, and job description alignment"
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>AI Resume & ATS Analyzer</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload your resume or paste plain text to receive real-time ATS score breakdown, skill gap detection, and AI recommendations.
          </p>
        </div>

        {currentResult && (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setCurrentResult(null);
                setResumeText('');
                setSelectedFile(null);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>New Analysis</span>
            </button>
            <button
              id="export-pdf-report-btn"
              onClick={handleDownloadPDF}
              disabled={isExportingPdf}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span>Export PDF Report</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Input Section (Hidden if result is active) */}
      {!currentResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Upload / Input Card */}
          <div className="lg:col-span-2 space-y-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            
            {/* Input Mode Selector */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>1. Provide Resume Document</span>
              </h2>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setInputMode('file')}
                  className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    inputMode === 'file'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  File Upload
                </button>
                <button
                  onClick={() => setInputMode('paste')}
                  className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    inputMode === 'paste'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {/* Drag & Drop File Zone */}
            {inputMode === 'file' ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-8 text-center transition-all bg-slate-50/50 dark:bg-slate-850/50 flex flex-col items-center justify-center space-y-3 cursor-pointer"
              >
                <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedFile ? selectedFile.name : 'Drag & drop your resume file here'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Supports PDF, DOCX, and TXT files (Max 10MB)
                  </p>
                </div>

                <label className="cursor-pointer px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs">
                  <span>Browse Files</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {isExtracting && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold animate-pulse flex items-center">
                    <Sparkles className="h-3.5 w-3.5 mr-1" /> Extracting document text...
                  </p>
                )}

                {resumeText && !isExtracting && (
                  <div className="w-full text-left p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                    <span className="truncate font-semibold">Text extracted ({resumeText.length} characters)</span>
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <textarea
                  rows={9}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste complete resume text here (Contact info, Summary, Work History, Education, Skills)..."
                  className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
            )}

            {/* Step 2: Target Job Description & Target Role */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>2. Target Role & Job Description</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Recommended for JD Matching</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Job Title
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    placeholder="Enter desired target job role..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Industry
                  </label>
                  <input
                    type="text"
                    placeholder="Enter industry (optional)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Paste Target Job Posting / Description
                </label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description requirements to calculate exact keyword match %, missing qualifications, and tailoring advice..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Error banner */}
            {analysisError && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{analysisError}</span>
              </div>
            )}

            {/* Submit Analysis Button */}
            <button
              id="submit-analysis-btn"
              onClick={runAnalysis}
              disabled={isAnalyzing || isExtracting}
              className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/20 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Zap className="h-5 w-5" />
              <span>Run AI Resume Analysis & ATS Score</span>
            </button>

          </div>

          {/* Side Info & Tips Box */}
          <div className="space-y-5">
            
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-4 border border-indigo-500/20">
              <h3 className="text-base font-bold flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span>What ResumeIQ AI Scans</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">ATS Filter Rules:</strong> Validates header structure, font readability, and single-column layout parsing.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Quantified Impact:</strong> Audits metrics, percentages, revenue, team size, and efficiency numbers.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Skill Matrix:</strong> Compares hard technical tools and soft skills against market expectations.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Job Match Index:</strong> Identifies exact missing keywords from target job descriptions.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 space-y-2">
              <p className="font-bold flex items-center space-x-1.5 text-sm">
                <Info className="h-4 w-4 text-blue-600" />
                <span>Pro Tip for 90+ ATS Score</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Replace vague duties with metrics-focused achievement statements. For example: "Managed CI/CD pipeline" → "Engineered automated CI/CD pipeline reducing release deployment time by 45%".
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Analysis Results View */}
      {currentResult && (
        <div id="resumeiq-report-view" className="space-y-6">
          
          {/* Top Score Banner Card with Dual Radial Gauges */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              
              {/* Left Column: Title & Metadata */}
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Gemini 3.6 Flash Audit Complete</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {currentResult.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                  <span>Target Role: <strong className="text-slate-800 dark:text-slate-200">{currentResult.targetRole || currentResult.detectedTargetRole || targetRole?.trim() || 'Not Selected'}</strong></span>
                  <span>•</span>
                  <span>File: {currentResult.fileName}</span>
                  <span>•</span>
                  <span>{new Date(currentResult.createdAt).toLocaleDateString()}</span>
                </p>
              </div>

              {/* Right Column: Dual Gauges */}
              <div className="flex items-center space-x-6 sm:space-x-8 bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                
                {/* Gauge 1: ATS Overall Score */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" className="text-slate-200 dark:text-slate-700" fill="transparent" />
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="currentColor"
                        strokeWidth="6"
                        className={currentResult.atsScore >= 80 ? 'text-emerald-500' : currentResult.atsScore >= 65 ? 'text-amber-500' : 'text-rose-500'}
                        strokeDasharray="200"
                        strokeDashoffset={200 - (200 * currentResult.atsScore) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute text-xl font-black text-slate-900 dark:text-white">
                      {currentResult.atsScore}%
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1">ATS Pass Rate</p>
                </div>

                <div className="h-12 w-[1px] bg-slate-200 dark:bg-slate-700" />

                {/* Gauge 2: Job Match Percentage */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" className="text-slate-200 dark:text-slate-700" fill="transparent" />
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-blue-600 dark:text-blue-400"
                        strokeDasharray="200"
                        strokeDashoffset={200 - (200 * (currentResult.jobMatch?.matchPercentage || 86)) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute text-xl font-black text-slate-900 dark:text-white">
                      {currentResult.jobMatch?.matchPercentage || 86}%
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1">Job Match Index</p>
                </div>

              </div>

            </div>
          </div>

          {/* Navigation Tabs for Report Modules */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
            <button
              id="report-tab-scorecard"
              onClick={() => setActiveTab('scorecard')}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'scorecard'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ATS Scorecard & Category Breakdown
            </button>
            <button
              id="report-tab-skills"
              onClick={() => setActiveTab('skills')}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'skills'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Skill Gap Matrix
            </button>
            <button
              id="report-tab-jobmatch"
              onClick={() => setActiveTab('jobmatch')}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'jobmatch'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Job Match & Missing Keywords
            </button>
            <button
              id="report-tab-suggestions"
              onClick={() => setActiveTab('suggestions')}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'suggestions'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              AI Fix Suggestions ({currentResult.suggestions.length})
            </button>
          </div>

          {/* TAB 1: ATS SCORECARD & BREAKDOWN */}
          {activeTab === 'scorecard' && (
            <div className="space-y-6">
              
              {/* Category Progress Bars */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Detailed Category Metrics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-300">Format & ATS Parsability</span>
                      <span className="text-blue-600 dark:text-blue-400 font-extrabold">{currentResult.scoreBreakdown.formatting}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${currentResult.scoreBreakdown.formatting}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-300">Keyword Density & Match</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{currentResult.scoreBreakdown.keywords}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${currentResult.scoreBreakdown.keywords}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-300">Impact & Quantified Results</span>
                      <span className="text-purple-600 dark:text-purple-400 font-extrabold">{currentResult.scoreBreakdown.impactResults}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${currentResult.scoreBreakdown.impactResults}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-300">Action Verbs & Professional Tone</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{currentResult.scoreBreakdown.actionVerbs}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${currentResult.scoreBreakdown.actionVerbs}%` }} />
                    </div>
                  </div>

                </div>
              </div>

              {/* Strengths & Red Flags Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Strengths */}
                <div className="p-6 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-4">
                  <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Key Resume Strengths ({currentResult.keyStrengths.length})</span>
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                    {currentResult.keyStrengths.map((str, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Red Flags */}
                <div className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-4">
                  <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    <span>Critical Red Flags / Urgent Fixes ({currentResult.criticalRedFlags.length})</span>
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                    {currentResult.criticalRedFlags.map((flag, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: SKILL GAP ANALYSIS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Market Skill Gap Matrix
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comparison of skills detected in your resume versus expected industry requirements for {targetRole}.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentResult.skillGaps.map((gap, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          {gap.category}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {gap.matchedSkills.length} Matched / {gap.missingSkills.length} Missing
                        </span>
                      </div>

                      {/* Matched Skills */}
                      <div>
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Detected Skills:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {gap.matchedSkills.map((s, i) => (
                            <span key={i} className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      <div>
                        <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mb-1.5">Recommended Additions:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {gap.missingSkills.map((s, i) => (
                            <span key={i} className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              + {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <strong className="text-slate-900 dark:text-white">Recommendation:</strong> {gap.recommendation}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: JOB MATCH & KEYWORDS */}
          {activeTab === 'jobmatch' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Job Description Compatibility</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {currentResult.jobMatch?.roleFitSummary || 'Matched against target industry requirements.'}
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                      {currentResult.jobMatch?.matchPercentage || 86}%
                    </span>
                    <span className="block text-[10px] font-bold uppercase text-slate-500">Keyword Overlap</span>
                  </div>
                </div>

                {/* Keywords Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Matched Keywords ({currentResult.jobMatch?.matchedKeywords.length || 6})</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(currentResult.jobMatch?.matchedKeywords || ['React', 'TypeScript', 'Node.js', 'REST API', 'CI/CD', 'Microservices']).map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400 flex items-center space-x-1.5">
                      <XCircle className="h-4 w-4" />
                      <span>Missing Keywords ({currentResult.jobMatch?.missingKeywords.length || 3})</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(currentResult.jobMatch?.missingKeywords || ['Kubernetes', 'gRPC', 'GraphQL']).map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Tailoring Advice */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Custom Tailoring Action Steps
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {(currentResult.jobMatch?.tailoringAdvice || [
                      'Incorporate missing keywords into your skills section and past work experience bullets.',
                      'Reorder bullet points to highlight cloud infrastructure achievements first.'
                    ]).map((tip, idx) => (
                      <li key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-start space-x-2">
                        <ArrowRight className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: SECTION SUGGESTIONS */}
          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              {currentResult.suggestions.map((sug, idx) => (
                <div 
                  key={idx}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      {sug.section}
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      sug.status === 'critical'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        : sug.status === 'warning'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {sug.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {sug.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Issue Identified:</strong> {sug.issue}
                  </p>

                  {/* Before / After comparison if provided */}
                  {sug.currentText && sug.suggestedText && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Current Text</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">{sug.currentText}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">AI Recommended Text</span>
                          <button
                            onClick={() => handleCopyText(sug.suggestedText!, `sug-${idx}`)}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-white dark:bg-slate-800 text-blue-600 shadow-xs flex items-center space-x-1"
                          >
                            {copiedId === `sug-${idx}` ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedId === `sug-${idx}` ? 'Copied' : 'Copy Text'}</span>
                          </button>
                        </div>
                        <p className="text-xs text-blue-950 dark:text-blue-200 font-mono leading-relaxed">{sug.suggestedText}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white">Recommendation:</strong> {sug.recommendation}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
