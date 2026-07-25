import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  Award,
  ExternalLink
} from 'lucide-react';
import { ResumeData, ResumeDesignSettings } from '../types';

interface ResumePreviewDocumentProps {
  resumeData: ResumeData;
}

export const ResumePreviewDocument: React.FC<ResumePreviewDocumentProps> = ({ resumeData }) => {
  const { personalInfo, experience = [], education = [], skills = [], projects = [] } = resumeData;

  const design: ResumeDesignSettings = resumeData.design || {
    fontFamily: 'inter',
    fontSize: 'normal',
    primaryColor: '#1e3a8a',
    accentColor: '#3b82f6',
    sectionSpacing: 'standard',
    pageMargins: 'standard',
    layoutStyle: 'one-column',
    showProfilePhoto: false,
    headerStyle: 'left',
    iconStyle: 'minimal'
  };

  const templateId = resumeData.template || 'modern';

  // 1. Font Family Style
  const getFontFamilyStyle = () => {
    switch (design.fontFamily) {
      case 'serif':
        return { fontFamily: 'Georgia, Cambria, "Times New Roman", serif' };
      case 'playfair':
        return { fontFamily: '"Playfair Display", Georgia, serif' };
      case 'jakarta':
        return { fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' };
      case 'mono':
        return { fontFamily: '"JetBrains Mono", Consolas, monospace' };
      case 'inter':
      default:
        return { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' };
    }
  };

  // 2. Font Size Classes
  const getFontSizeClasses = () => {
    switch (design.fontSize) {
      case 'compact':
        return {
          base: 'text-[10px] leading-snug',
          heading: 'text-[11px] font-bold uppercase tracking-wider',
          title: 'text-xl font-bold tracking-tight'
        };
      case 'spacious':
        return {
          base: 'text-xs leading-relaxed',
          heading: 'text-sm font-bold uppercase tracking-wider',
          title: 'text-2xl font-bold tracking-tight'
        };
      case 'normal':
      default:
        return {
          base: 'text-[11px] leading-relaxed',
          heading: 'text-[12px] font-bold uppercase tracking-wider',
          title: 'text-2xl font-bold tracking-tight'
        };
    }
  };

  // 3. Margin Padding Classes
  const getMarginClass = () => {
    switch (design.pageMargins) {
      case 'compact':
        return 'p-6';
      case 'wide':
        return 'p-12';
      case 'standard':
      default:
        return 'p-9';
    }
  };

  // 4. Section Gap Classes
  const getSpacingClass = () => {
    switch (design.sectionSpacing) {
      case 'compact':
        return 'space-y-2.5';
      case 'relaxed':
        return 'space-y-5';
      case 'standard':
      default:
        return 'space-y-4';
    }
  };

  const fontSizes = getFontSizeClasses();

  // Helper for rendering Contact Details
  const renderContactInfo = (horizontal = true) => {
    const items = [
      { key: 'email', val: personalInfo.email, icon: Mail, label: 'Email' },
      { key: 'phone', val: personalInfo.phone, icon: Phone, label: 'Phone' },
      { key: 'location', val: personalInfo.location, icon: MapPin, label: 'Location' },
      { key: 'linkedin', val: personalInfo.linkedin, icon: Linkedin, label: 'LinkedIn' },
      { key: 'github', val: personalInfo.github, icon: Github, label: 'GitHub' },
      { key: 'website', val: personalInfo.website, icon: Globe, label: 'Website' },
    ].filter(i => Boolean(i.val));

    if (items.length === 0) return null;

    if (design.iconStyle === 'none') {
      return (
        <div className={`text-slate-600 ${fontSizes.base} ${horizontal ? 'flex flex-wrap items-center gap-x-2 gap-y-1' : 'space-y-1'}`}>
          {items.map((item, idx) => (
            <React.Fragment key={item.key}>
              {idx > 0 && horizontal && <span className="text-slate-300">•</span>}
              <span>{item.val}</span>
            </React.Fragment>
          ))}
        </div>
      );
    }

    if (design.iconStyle === 'rounded-solid') {
      return (
        <div className={`text-slate-700 ${fontSizes.base} ${horizontal ? 'flex flex-wrap items-center gap-x-3 gap-y-1.5' : 'space-y-2'}`}>
          {items.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.key} className="flex items-center space-x-1.5 shrink-0">
                <div 
                  className="w-4 h-4 rounded-full text-white flex items-center justify-center shrink-0 shadow-2xs"
                  style={{ backgroundColor: design.primaryColor }}
                >
                  <IconComponent className="h-2.5 w-2.5" />
                </div>
                <span className="font-medium">{item.val}</span>
              </div>
            );
          })}
        </div>
      );
    }

    // Default 'minimal' icons
    return (
      <div className={`text-slate-600 ${fontSizes.base} ${horizontal ? 'flex flex-wrap items-center gap-x-3.5 gap-y-1' : 'space-y-1.5'}`}>
        {items.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.key} className="flex items-center space-x-1 shrink-0 whitespace-nowrap">
              <IconComponent className="h-3 w-3 shrink-0" style={{ color: design.primaryColor }} />
              <span>{item.val}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Section Header Renderer
  const renderSectionHeading = (title: string, icon?: React.ElementType) => {
    const IconComp = icon;

    if (templateId === 'corporate') {
      return (
        <div className="border-b-2 border-double pb-1 mb-2" style={{ borderColor: design.primaryColor }}>
          <h2 className={fontSizes.heading} style={{ color: design.primaryColor }}>
            {title}
          </h2>
        </div>
      );
    }

    if (templateId === 'executive') {
      return (
        <div className="border-b-2 pb-1 mb-2" style={{ borderColor: design.primaryColor }}>
          <h2 className={`${fontSizes.heading} font-serif`} style={{ color: design.primaryColor }}>
            {title}
          </h2>
        </div>
      );
    }

    if (templateId === 'elegant') {
      return (
        <div className="text-center border-b border-slate-200 pb-1 mb-2">
          <h2 className={`${fontSizes.heading} font-serif tracking-widest`} style={{ color: design.primaryColor }}>
            ♦ {title} ♦
          </h2>
        </div>
      );
    }

    if (templateId === 'modern') {
      return (
        <div className="border-l-4 pl-2 mb-2" style={{ borderColor: design.primaryColor }}>
          <h2 className={fontSizes.heading} style={{ color: design.primaryColor }}>
            {title}
          </h2>
        </div>
      );
    }

    // Default section heading
    return (
      <div className="border-b border-slate-200 pb-1 mb-2 flex items-center justify-between">
        <h2 className={fontSizes.heading} style={{ color: design.primaryColor }}>
          {title}
        </h2>
        {IconComp && (
          <IconComp className="h-3.5 w-3.5 opacity-40" style={{ color: design.primaryColor }} />
        )}
      </div>
    );
  };

  // Section Blocks
  const renderSummarySection = () => {
    if (!personalInfo.summary) return null;
    return (
      <div className="space-y-1">
        {renderSectionHeading('Professional Executive Summary', User)}
        <p className={`${fontSizes.base} text-slate-700 leading-relaxed`}>
          {personalInfo.summary}
        </p>
      </div>
    );
  };

  const renderExperienceSection = () => {
    if (experience.length === 0) return null;
    return (
      <div className="space-y-2">
        {renderSectionHeading('Work Experience', Briefcase)}
        <div className="space-y-3">
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900">{exp.position}</span>
                <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <p className="font-semibold text-slate-700" style={{ color: design.primaryColor }}>
                {exp.company} {exp.location ? `• ${exp.location}` : ''}
              </p>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="list-disc list-inside text-slate-700 space-y-0.5 pl-0.5">
                  {exp.bullets.filter(Boolean).map((bullet, idx) => (
                    <li key={idx} className="leading-snug">
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducationSection = () => {
    if (education.length === 0) return null;
    return (
      <div className="space-y-2">
        {renderSectionHeading('Education & Credentials', GraduationCap)}
        <div className="space-y-2.5">
          {education.map((edu) => (
            <div key={edu.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900">
                    {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                  </span>
                  {edu.institution && (
                    <span className="block text-slate-600 font-medium">{edu.institution}</span>
                  )}
                </div>
                {(edu.startDate || edu.endDate) && (
                  <span className="text-[10px] font-medium text-slate-500 shrink-0">
                    {edu.startDate && edu.endDate ? `${edu.startDate} – ${edu.endDate}` : (edu.endDate || edu.startDate)}
                  </span>
                )}
              </div>

              {(edu.gpa || edu.honors || edu.relevantCoursework) && (
                <div className="text-[10px] text-slate-600 space-y-0.5 pt-0.5">
                  {edu.gpa && (
                    <p>
                      <strong className="text-slate-700">CGPA / GPA:</strong> {edu.gpa}
                    </p>
                  )}
                  {edu.honors && (
                    <p>
                      <strong className="text-slate-700">Honors & Awards:</strong> {edu.honors}
                    </p>
                  )}
                  {edu.relevantCoursework && (
                    <p>
                      <strong className="text-slate-700">Relevant Coursework:</strong> {edu.relevantCoursework}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkillsSection = () => {
    if (skills.length === 0) return null;

    if (templateId === 'creative' || templateId === 'student') {
      return (
        <div className="space-y-2">
          {renderSectionHeading('Core Skills & Tech Stack', Wrench)}
          <div className="space-y-2">
            {skills.map((grp, i) => (
              <div key={i} className="space-y-1">
                {grp.category && (
                  <span className="block font-bold text-[10px] uppercase text-slate-500">{grp.category}</span>
                )}
                <div className="flex flex-wrap gap-1">
                  {grp.items.map((item, j) => (
                    <span 
                      key={j} 
                      className="px-2 py-0.5 rounded text-[10px] font-semibold text-white shadow-2xs"
                      style={{ backgroundColor: design.primaryColor }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-1.5">
        {renderSectionHeading('Skills & Competencies', Wrench)}
        <div className="space-y-1 text-slate-700">
          {skills.map((grp, i) => (
            <p key={i}>
              <strong className="text-slate-900">{grp.category || 'Skills'}:</strong>{' '}
              <span>{grp.items.join(', ')}</span>
            </p>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectsSection = () => {
    if (!projects || projects.length === 0) return null;
    return (
      <div className="space-y-2">
        {renderSectionHeading('Key Projects & Portfolio', FolderGit2)}
        <div className="space-y-2.5">
          {projects.map((proj) => (
            <div key={proj.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900">{proj.name}</span>
                {proj.link && (
                  <span className="text-[10px] font-medium underline flex items-center space-x-0.5" style={{ color: design.accentColor }}>
                    <span>{proj.link}</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </span>
                )}
              </div>
              <p className="text-slate-700 leading-snug">{proj.description}</p>
              {proj.technologies && proj.technologies.length > 0 && proj.technologies.some(Boolean) && (
                <p className="text-[10px] text-slate-500">
                  <strong className="text-slate-700">Technologies:</strong> {proj.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Header Renderer
  const renderHeader = () => {
    const photoElement = design.showProfilePhoto && (
      <div className="shrink-0">
        <img
          src={design.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt={personalInfo.fullName}
          className="w-16 h-16 rounded-full object-cover border-2 shadow-xs"
          style={{ borderColor: design.primaryColor }}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
      </div>
    );

    if (design.headerStyle === 'banner' || templateId === 'executive') {
      return (
        <div 
          className="p-5 rounded-lg text-white mb-4 shadow-xs flex items-center justify-between"
          style={{ backgroundColor: design.primaryColor }}
        >
          <div className="space-y-1">
            <h1 className={`${fontSizes.title} uppercase font-bold text-white tracking-tight`}>
              {personalInfo.fullName || 'YOUR FULL NAME'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-xs font-semibold tracking-wider uppercase opacity-90 text-amber-200">
                {personalInfo.jobTitle}
              </p>
            )}
            <div className="text-[10px] text-slate-100 opacity-90 pt-1">
              {renderContactInfo(true)}
            </div>
          </div>
          {photoElement}
        </div>
      );
    }

    if (design.headerStyle === 'centered' || templateId === 'minimal' || templateId === 'elegant') {
      return (
        <div className="text-center pb-3 border-b border-slate-200 space-y-1 mb-3">
          {photoElement && <div className="flex justify-center mb-2">{photoElement}</div>}
          <h1 className={`${fontSizes.title} uppercase font-bold text-slate-900 tracking-tight`}>
            {personalInfo.fullName || 'YOUR FULL NAME'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: design.primaryColor }}>
              {personalInfo.jobTitle}
            </p>
          )}
          <div className="flex justify-center pt-1">
            {renderContactInfo(true)}
          </div>
        </div>
      );
    }

    // Default Left-aligned header
    return (
      <div className="pb-3 border-b border-slate-200 flex items-start justify-between mb-3" style={{ borderColor: design.primaryColor }}>
        <div className="space-y-1">
          <h1 className={`${fontSizes.title} uppercase font-bold text-slate-900 tracking-tight`}>
            {personalInfo.fullName || 'YOUR FULL NAME'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: design.primaryColor }}>
              {personalInfo.jobTitle}
            </p>
          )}
          <div className="pt-0.5">
            {renderContactInfo(true)}
          </div>
        </div>
        {photoElement}
      </div>
    );
  };

  // Render Layouts: One-Column vs Two-Column
  const isTwoColumn = design.layoutStyle === 'two-column' || templateId === 'creative';
  const isStudentTemplate = templateId === 'student';

  return (
    <div
      id="resume-preview-a4"
      className={`w-[794px] max-w-full min-h-[1123px] bg-white text-slate-900 ${getMarginClass()} shadow-2xl rounded-sm ${fontSizes.base} transition-all text-left mx-auto box-border`}
      style={getFontFamilyStyle()}
    >
      {renderHeader()}

      {isTwoColumn ? (
        // Two-Column Grid Layout
        <div className="grid grid-cols-12 gap-5 pt-2">
          {/* Sidebar (4 cols) */}
          <div className="col-span-4 space-y-4 border-r border-slate-200 pr-3">
            {renderSkillsSection()}
            {renderEducationSection()}
          </div>

          {/* Main Area (8 cols) */}
          <div className={`col-span-8 ${getSpacingClass()}`}>
            {renderSummarySection()}
            {renderExperienceSection()}
            {renderProjectsSection()}
          </div>
        </div>
      ) : (
        // One-Column Vertical Layout
        <div className={getSpacingClass()}>
          {renderSummarySection()}

          {/* Student/Graduate template prioritizes Education & Projects first */}
          {isStudentTemplate ? (
            <>
              {renderEducationSection()}
              {renderProjectsSection()}
              {renderSkillsSection()}
              {renderExperienceSection()}
            </>
          ) : (
            <>
              {renderExperienceSection()}
              {renderEducationSection()}
              {renderSkillsSection()}
              {renderProjectsSection()}
            </>
          )}
        </div>
      )}
    </div>
  );
};
