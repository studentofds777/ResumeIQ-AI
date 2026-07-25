import React, { useState } from 'react';
import { 
  PenTool, 
  Sparkles, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Save, 
  Copy, 
  Check, 
  Layers, 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  Award,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ResumeData, WorkExperience, Education, Project } from '../types';
import { exportElementToPDF } from '../utils/pdfGenerator';
import { ResumeDesignEditor } from './ResumeDesignEditor';
import { ResumePreviewDocument } from './ResumePreviewDocument';

export const ResumeBuilder: React.FC = () => {
  const { savedResume, updateSavedResume, user, updateProfile } = useAuth();
  const [resumeData, setResumeData] = useState<ResumeData>(savedResume);
  const [activeFormTab, setActiveFormTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'template'>('personal');

  React.useEffect(() => {
    if (user?.targetRole && !resumeData.personalInfo.jobTitle) {
      setResumeData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, jobTitle: user.targetRole }
      }));
    }
  }, [user?.targetRole]);
  
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfMessage, setPdfMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync to auth state / localStorage on save
  const handleSaveResume = () => {
    updateSavedResume(resumeData);
    setCopiedStatus('saved');
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  // AI Polish Bullet Point
  const handleAiPolishBullet = async (expIndex: number, bulletIndex: number) => {
    const targetBullet = resumeData.experience[expIndex]?.bullets[bulletIndex];
    if (!targetBullet) return;

    setIsAiLoading(true);
    try {
      const response = await fetch('/api/generate-resume-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bullet',
          context: { bullet: targetBullet, targetRole: user?.targetRole || resumeData.personalInfo.fullName }
        })
      });
      const data = await response.json();
      if (data.result) {
        const updatedExp = [...resumeData.experience];
        updatedExp[expIndex].bullets[bulletIndex] = data.result;
        setResumeData({ ...resumeData, experience: updatedExp });
      }
    } catch (e) {
      alert('Failed to generate AI polish. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Generate Summary
  const handleAiGenerateSummary = async () => {
    setSummaryError(null);

    // Validation checks
    const fullNameTrimmed = resumeData.personalInfo.fullName?.trim() || '';
    const jobTitleTrimmed = resumeData.personalInfo.jobTitle?.trim() || user?.targetRole || '';

    const validExperiences = (resumeData.experience || []).filter(e => e.company?.trim() || e.position?.trim());
    const validEducation = (resumeData.education || []).filter(e => e.institution?.trim() || e.degree?.trim());
    const validSkills = (resumeData.skills || []).filter(s => s.items && s.items.some(i => i.trim().length > 0));
    const validProjects = (resumeData.projects || []).filter(p => p.name?.trim() || p.description?.trim());

    const missingFields: string[] = [];
    if (!fullNameTrimmed) {
      missingFields.push('Full Name');
    }
    if (validExperiences.length === 0 && validEducation.length === 0 && validSkills.length === 0 && validProjects.length === 0) {
      missingFields.push('at least one section from Education, Skills, Projects, or Experience');
    }

    if (missingFields.length > 0) {
      setSummaryError(`Required info missing: Please fill in your ${missingFields.join(' and ')} before generating an AI summary.`);
      return;
    }

    // Always clear old summary before generating a new one
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, summary: '' }
    }));

    setIsAiLoading(true);

    try {
      const isFresher = validExperiences.length === 0 || /fresher|student|intern|entry/i.test(jobTitleTrimmed);

      const contactParts = [
        resumeData.personalInfo.location,
        resumeData.personalInfo.email,
        resumeData.personalInfo.phone,
        resumeData.personalInfo.linkedin,
        resumeData.personalInfo.github
      ].filter(Boolean).join(' | ');

      const skillsText = validSkills.map(s => `${s.category ? s.category + ': ' : ''}${s.items.filter(Boolean).join(', ')}`).filter(Boolean).join(' | ');
      const expText = validExperiences.map(e => `${e.position || 'Role'} at ${e.company || 'Organization'} (${e.startDate || ''} - ${e.endDate || ''}): ${e.bullets.filter(Boolean).join(' ')}`).join('; ');
      const eduText = validEducation.map(e => {
        let text = `${e.degree || 'Degree'} ${e.fieldOfStudy ? 'in ' + e.fieldOfStudy : ''} from ${e.institution || 'University'} (${e.startDate || ''} - ${e.endDate || ''})`;
        if (e.gpa) text += `, CGPA/GPA: ${e.gpa}`;
        if (e.honors) text += `, Honors/Awards: ${e.honors}`;
        if (e.relevantCoursework) text += `, Relevant Coursework: ${e.relevantCoursework}`;
        return text;
      }).join('; ');
      const projText = validProjects.map(p => `${p.name || 'Project'}: ${p.description || ''} ${p.technologies?.length ? '(Tools: ' + p.technologies.filter(Boolean).join(', ') + ')' : ''}`).join('; ');

      const response = await fetch('/api/generate-resume-content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          type: 'summary',
          context: {
            fullName: fullNameTrimmed,
            jobTitle: jobTitleTrimmed || (isFresher ? 'Student / Fresher' : 'Professional'),
            isFresher,
            contactInfo: contactParts,
            skills: skillsText,
            experience: expText,
            education: eduText,
            projects: projText,
            timestamp: Date.now()
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate AI summary.');
      }

      if (data.result) {
        setResumeData(prev => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, summary: data.result }
        }));
      } else {
        throw new Error('Received an empty response from Gemini AI server.');
      }
    } catch (e: any) {
      console.error('Error generating summary:', e);
      setSummaryError(e.message || 'Failed to generate summary. Please check your network and try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsExportingPdf(true);
    setPdfMessage(null);

    try {
      const candidateName = resumeData.personalInfo.fullName?.trim();
      const fileName = candidateName ? `${candidateName.replace(/\s+/g, '_')}_Resume.pdf` : 'Resume.pdf';

      await exportElementToPDF('resume-preview-a4', fileName);

      setPdfMessage({
        type: 'success',
        text: 'Resume.pdf downloaded successfully!'
      });

      // Clear success banner automatically after 6 seconds
      setTimeout(() => {
        setPdfMessage(prev => (prev?.type === 'success' ? null : prev));
      }, 6000);
    } catch (err: any) {
      console.error('Download PDF error:', err);
      setPdfMessage({
        type: 'error',
        text: err?.message || 'Could not export resume PDF. Please check your data and try again.'
      });
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <PenTool className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>AI Resume Builder</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build ATS-formatted professional resumes with real-time live preview and AI text enhancement.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="builder-save-btn"
            type="button"
            onClick={handleSaveResume}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{copiedStatus === 'saved' ? 'Saved!' : 'Save Progress'}</span>
          </button>
          
          <button
            id="builder-export-pdf-btn"
            type="button"
            onClick={handleDownloadPDF}
            disabled={isExportingPdf}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Download Resume PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* PDF Generation Status Notification Banner */}
      {pdfMessage && (
        <div 
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200 ${
            pdfMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {pdfMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{pdfMessage.text}</span>
          </div>
          <button 
            type="button"
            onClick={() => setPdfMessage(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Split Screen: Editor Form (Left) vs Live A4 Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor Controls (7 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Navigation Form Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl overflow-x-auto no-scrollbar">
            {[
              { id: 'personal', label: 'Contact', icon: User },
              { id: 'experience', label: 'Experience', icon: Briefcase },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'skills', label: 'Skills', icon: Wrench },
              { id: 'projects', label: 'Projects', icon: FolderGit2 },
              { id: 'template', label: 'Design', icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFormTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFormTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* FORM TAB 1: PERSONAL & SUMMARY */}
          {activeFormTab === 'personal' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Personal & Contact Info
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, fullName: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Job Title / Profession</label>
                  <input
                    type="text"
                    placeholder="Enter target job title (e.g. Doctor, Accountant, Teacher, Civil Engineer...)"
                    value={resumeData.personalInfo.jobTitle || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, jobTitle: val }
                      });
                      if (val.trim()) {
                        updateProfile({ targetRole: val.trim() });
                      }
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. jane.doe@example.com"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub / Portfolio URL</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.github || ''}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, github: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Professional Summary */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Professional Executive Summary
                    </label>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">3–5 sentence overview generated from your contact, experience, education, skills, and projects.</p>
                  </div>
                  <button
                    id="generate-ai-summary-btn"
                    type="button"
                    onClick={handleAiGenerateSummary}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xs transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5 shrink-0"
                  >
                    {isAiLoading ? (
                      <>
                        <Sparkles className="h-3.5 w-3.5 animate-spin" />
                        <span>Generating 3–5 Sentence Summary...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                        <span>Generate AI Summary</span>
                      </>
                    )}
                  </button>
                </div>

                {summaryError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start justify-between animate-in fade-in">
                    <span className="leading-snug">{summaryError}</span>
                    <button 
                      type="button" 
                      onClick={() => setSummaryError(null)}
                      className="text-rose-500 hover:text-rose-700 font-bold ml-2 shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <textarea
                  rows={5}
                  value={resumeData.personalInfo.summary}
                  onChange={(e) => {
                    if (summaryError) setSummaryError(null);
                    setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, summary: e.target.value }
                    });
                  }}
                  placeholder="Your 3–5 sentence professional summary will appear here. You can also type or edit it directly."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
                />
              </div>

            </div>
          )}

          {/* FORM TAB 2: WORK EXPERIENCE */}
          {activeFormTab === 'experience' && (
            <div className="space-y-4">
              {resumeData.experience.map((exp, expIdx) => (
                <div key={exp.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-blue-600">Position #{expIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = resumeData.experience.filter((_, i) => i !== expIdx);
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[expIdx].company = e.target.value;
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Job Title / Role"
                      value={exp.position}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[expIdx].position = e.target.value;
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Start Date (e.g. 2022-03)"
                      value={exp.startDate}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[expIdx].startDate = e.target.value;
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="End Date (e.g. Present)"
                      value={exp.endDate}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[expIdx].endDate = e.target.value;
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Key Accomplishments & Bullet Points
                    </label>
                    {exp.bullets.map((bullet, bulletIdx) => (
                      <div key={bulletIdx} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[expIdx].bullets[bulletIdx] = e.target.value;
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleAiPolishBullet(expIdx, bulletIdx)}
                          title="AI Polish Bullet Point"
                          disabled={isAiLoading}
                          className="px-2 py-1.5 text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 transition-colors shrink-0 flex items-center space-x-1"
                        >
                          <Sparkles className="h-3 w-3 text-indigo-500" />
                          <span>AI Polish</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...resumeData.experience];
                            updated[expIdx].bullets = updated[expIdx].bullets.filter((_, bI) => bI !== bulletIdx);
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...resumeData.experience];
                        updated[expIdx].bullets.push('Architected and optimized key deliverables increasing team efficiency by 25%.');
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 mt-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Bullet Point</span>
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newExp: WorkExperience = {
                    id: 'exp-' + Date.now(),
                    company: 'New Company Inc.',
                    position: 'Software Developer',
                    location: 'Remote',
                    startDate: '2023-01',
                    endDate: 'Present',
                    current: true,
                    bullets: ['Engineered responsive user interfaces and backend API routes.']
                  };
                  setResumeData({ ...resumeData, experience: [...resumeData.experience, newExp] });
                }}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Work Experience Role</span>
              </button>
            </div>
          )}

          {/* FORM TAB 3: EDUCATION */}
          {activeFormTab === 'education' && (
            <div className="space-y-4">
              {resumeData.education.map((edu, eduIdx) => (
                <div key={edu.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-blue-600">Education #{eduIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = resumeData.education.filter((_, i) => i !== eduIdx);
                        setResumeData({ ...resumeData, education: updated });
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bachelor of Science"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[eduIdx].degree = e.target.value;
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Field of Study / Major
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Computer Science"
                        value={edu.fieldOfStudy}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[eduIdx].fieldOfStudy = e.target.value;
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        University / College Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Stanford University"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[eduIdx].institution = e.target.value;
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        CGPA / GPA <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 3.85 or 3.85/4.00 or 8.7/10"
                        value={edu.gpa || ''}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[eduIdx].gpa = e.target.value;
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Start Date <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 2020"
                          value={edu.startDate}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[eduIdx].startDate = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Graduation Year / End Date
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 2024"
                          value={edu.endDate}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[eduIdx].endDate = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Honors / Awards <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Magna Cum Laude, Dean's List (2021–2023), Merit Scholarship"
                        value={edu.honors || ''}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[eduIdx].honors = e.target.value;
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Relevant Coursework <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Data Structures & Algorithms, Machine Learning, Database Systems, Software Engineering"
                        value={edu.relevantCoursework || ''}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[eduIdx].relevantCoursework = e.target.value;
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newEdu: Education = {
                    id: 'edu-' + Date.now(),
                    institution: '',
                    degree: '',
                    fieldOfStudy: '',
                    startDate: '',
                    endDate: '',
                    gpa: '',
                    honors: '',
                    relevantCoursework: ''
                  };
                  setResumeData({ ...resumeData, education: [...resumeData.education, newEdu] });
                }}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Education Entry</span>
              </button>
            </div>
          )}

          {/* FORM TAB 4: SKILLS */}
          {activeFormTab === 'skills' && (
            <div className="space-y-4">
              {resumeData.skills.map((skillGroup, skillIdx) => (
                <div key={skillIdx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      placeholder="Category Name (e.g. Technical Skills)"
                      value={skillGroup.category}
                      onChange={(e) => {
                        const updated = [...resumeData.skills];
                        updated[skillIdx].category = e.target.value;
                        setResumeData({ ...resumeData, skills: updated });
                      }}
                      className="font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = resumeData.skills.filter((_, i) => i !== skillIdx);
                        setResumeData({ ...resumeData, skills: updated });
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Skills (comma-separated list)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React, TypeScript, Node.js, Python, PostgreSQL, AWS"
                      value={skillGroup.items.join(', ')}
                      onChange={(e) => {
                        const updated = [...resumeData.skills];
                        updated[skillIdx].items = e.target.value.split(',').map(s => s.trimStart());
                        setResumeData({ ...resumeData, skills: updated });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setResumeData({
                    ...resumeData,
                    skills: [...resumeData.skills, { category: 'Core Skills', items: [] }]
                  });
                }}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Skill Category</span>
              </button>
            </div>
          )}

          {/* FORM TAB 5: PROJECTS */}
          {activeFormTab === 'projects' && (
            <div className="space-y-4">
              {(resumeData.projects || []).map((proj, projIdx) => (
                <div key={proj.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-blue-600">Project #{projIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (resumeData.projects || []).filter((_, i) => i !== projIdx);
                        setResumeData({ ...resumeData, projects: updated });
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                      <input
                        type="text"
                        placeholder="e.g. AI Resume Intelligence Suite"
                        value={proj.name}
                        onChange={(e) => {
                          const updated = [...(resumeData.projects || [])];
                          updated[projIdx].name = e.target.value;
                          setResumeData({ ...resumeData, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Link / URL (Optional)</label>
                      <input
                        type="text"
                        placeholder="https://github.com/user/project"
                        value={proj.link || ''}
                        onChange={(e) => {
                          const updated = [...(resumeData.projects || [])];
                          updated[projIdx].link = e.target.value;
                          setResumeData({ ...resumeData, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Summary of project achievements, key features, and performance outcomes..."
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...(resumeData.projects || [])];
                        updated[projIdx].description = e.target.value;
                        setResumeData({ ...resumeData, projects: updated });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Technologies Used (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. React, TypeScript, Tailwind CSS, Gemini API"
                      value={(proj.technologies || []).join(', ')}
                      onChange={(e) => {
                        const updated = [...(resumeData.projects || [])];
                        updated[projIdx].technologies = e.target.value.split(',').map(s => s.trimStart());
                        setResumeData({ ...resumeData, projects: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newProj: Project = {
                    id: 'proj-' + Date.now(),
                    name: '',
                    description: '',
                    technologies: [],
                    link: ''
                  };
                  setResumeData({ ...resumeData, projects: [...(resumeData.projects || []), newProj] });
                }}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Project Entry</span>
              </button>
            </div>
          )}

          {/* FORM TAB 6: DESIGN & TEMPLATE */}
          {activeFormTab === 'template' && (
            <ResumeDesignEditor resumeData={resumeData} setResumeData={setResumeData} />
          )}

        </div>

        {/* Live Visual A4 Resume Preview (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner flex flex-col items-center overflow-x-auto">
          <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Eye className="h-3.5 w-3.5 text-blue-500" />
              <span>Live A4 Document Preview</span>
            </span>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isExportingPdf}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Rendered Resume Document Element */}
          <ResumePreviewDocument resumeData={resumeData} />
        </div>

      </div>

    </div>
  );
};
