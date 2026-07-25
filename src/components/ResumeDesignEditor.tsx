import React from 'react';
import { 
  Palette, 
  Type, 
  Layout, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  Grid, 
  Columns, 
  SlidersHorizontal,
  Sliders,
  UserCheck
} from 'lucide-react';
import { ResumeData, ResumeTemplateId, ResumeDesignSettings } from '../types';

interface ResumeDesignEditorProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export const TEMPLATE_DEFINITIONS: {
  id: ResumeTemplateId;
  name: string;
  category: string;
  atsScore: string;
  badge?: string;
  description: string;
  defaults: ResumeDesignSettings;
}[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    category: 'Universal / Tech & Business',
    atsScore: '99%',
    badge: 'Popular',
    description: 'Sleek contemporary design with primary accent header, clean section dividers, and high readability.',
    defaults: {
      fontFamily: 'inter',
      fontSize: 'normal',
      primaryColor: '#1e3a8a', // Navy
      accentColor: '#3b82f6', // Blue
      sectionSpacing: 'standard',
      pageMargins: 'standard',
      layoutStyle: 'one-column',
      showProfilePhoto: false,
      headerStyle: 'left',
      iconStyle: 'minimal'
    }
  },
  {
    id: 'executive',
    name: 'Executive',
    category: 'Leadership & Finance',
    atsScore: '98%',
    badge: 'Executive',
    description: 'Authoritative leadership layout with rich top border accent, structured two-column header summary.',
    defaults: {
      fontFamily: 'serif',
      fontSize: 'normal',
      primaryColor: '#0f172a', // Dark Slate
      accentColor: '#0284c7', // Sky Blue
      sectionSpacing: 'standard',
      pageMargins: 'standard',
      layoutStyle: 'one-column',
      showProfilePhoto: false,
      headerStyle: 'banner',
      iconStyle: 'minimal'
    }
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    category: 'Clean & High Impact',
    atsScore: '100%',
    badge: '100% ATS',
    description: 'Ultra-clean single-column layout with elegant serif typography and maximum whitespace efficiency.',
    defaults: {
      fontFamily: 'playfair',
      fontSize: 'normal',
      primaryColor: '#111827', // Black
      accentColor: '#6b7280', // Gray
      sectionSpacing: 'relaxed',
      pageMargins: 'standard',
      layoutStyle: 'one-column',
      showProfilePhoto: false,
      headerStyle: 'centered',
      iconStyle: 'none'
    }
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    category: 'Design & Marketing',
    atsScore: '95%',
    badge: 'Creative',
    description: 'Dynamic layout featuring styled sidebar for contact & skills alongside a prominent main timeline.',
    defaults: {
      fontFamily: 'jakarta',
      fontSize: 'normal',
      primaryColor: '#4f46e5', // Indigo
      accentColor: '#ec4899', // Pink
      sectionSpacing: 'standard',
      pageMargins: 'standard',
      layoutStyle: 'two-column',
      showProfilePhoto: true,
      headerStyle: 'left',
      iconStyle: 'rounded-solid'
    }
  },
  {
    id: 'corporate',
    name: 'Corporate Law & Finance',
    category: 'Corporate & Legal',
    atsScore: '100%',
    badge: '100% ATS',
    description: 'Formal corporate structure with uppercase double-rule section titles and crisp alignment.',
    defaults: {
      fontFamily: 'inter',
      fontSize: 'compact',
      primaryColor: '#0f172a', // Slate Navy
      accentColor: '#334155', // Slate
      sectionSpacing: 'compact',
      pageMargins: 'standard',
      layoutStyle: 'one-column',
      showProfilePhoto: false,
      headerStyle: 'left',
      iconStyle: 'minimal'
    }
  },
  {
    id: 'elegant',
    name: 'Elegant Serif',
    category: 'Healthcare & Higher Ed',
    atsScore: '98%',
    description: 'Refined layout with centered serif header, warm subtle line dividers, and sophisticated spacing.',
    defaults: {
      fontFamily: 'serif',
      fontSize: 'normal',
      primaryColor: '#334155', // Warm Slate
      accentColor: '#d97706', // Amber
      sectionSpacing: 'relaxed',
      pageMargins: 'wide',
      layoutStyle: 'one-column',
      showProfilePhoto: false,
      headerStyle: 'centered',
      iconStyle: 'minimal'
    }
  },
  {
    id: 'classic',
    name: 'Classic ATS Standard',
    category: 'Traditional & Government',
    atsScore: '100%',
    badge: '100% ATS',
    description: 'Timeless standard resume layout guaranteed to parse flawlessly in all applicant tracking systems.',
    defaults: {
      fontFamily: 'inter',
      fontSize: 'normal',
      primaryColor: '#000000', // Pure Black
      accentColor: '#475569', // Slate Gray
      sectionSpacing: 'standard',
      pageMargins: 'standard',
      layoutStyle: 'one-column',
      showProfilePhoto: false,
      headerStyle: 'minimal',
      iconStyle: 'none'
    }
  },
  {
    id: 'student',
    name: 'Student & Graduate',
    category: 'Freshers & Switchers',
    atsScore: '99%',
    badge: 'Fresher Friendly',
    description: 'Fresh entry-level template prioritizing Education, Key Projects, and Technical Skills first.',
    defaults: {
      fontFamily: 'jakarta',
      fontSize: 'normal',
      primaryColor: '#047857', // Emerald
      accentColor: '#10b981', // Green
      sectionSpacing: 'standard',
      pageMargins: 'standard',
      layoutStyle: 'one-column',
      showProfilePhoto: false,
      headerStyle: 'left',
      iconStyle: 'minimal'
    }
  }
];

const COLOR_SWATCHES_PRIMARY = [
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Dark Slate', hex: '#0f172a' },
  { name: 'Emerald', hex: '#047857' },
  { name: 'Deep Burgundy', hex: '#881337' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Warm Slate', hex: '#334155' },
  { name: 'Royal Violet', hex: '#5b21b6' },
  { name: 'Charcoal Black', hex: '#111827' },
  { name: 'Pure Black', hex: '#000000' }
];

const COLOR_SWATCHES_ACCENT = [
  { name: 'Bright Blue', hex: '#3b82f6' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Warm Amber', hex: '#f59e0b' },
  { name: 'Rose Red', hex: '#f43f5e' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Teal Cyan', hex: '#06b6d4' },
  { name: 'Cool Gray', hex: '#64748b' }
];

export const ResumeDesignEditor: React.FC<ResumeDesignEditorProps> = ({
  resumeData,
  setResumeData
}) => {
  // Ensure design object exists with defaults
  const currentDesign: ResumeDesignSettings = resumeData.design || {
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

  const updateDesign = (partial: Partial<ResumeDesignSettings>) => {
    setResumeData(prev => ({
      ...prev,
      design: {
        ...currentDesign,
        ...partial
      }
    }));
  };

  const handleSelectTemplate = (templateId: ResumeTemplateId) => {
    const tplDef = TEMPLATE_DEFINITIONS.find(t => t.id === templateId);
    if (tplDef) {
      setResumeData(prev => ({
        ...prev,
        template: templateId,
        design: {
          ...tplDef.defaults,
          // Preserve custom photo URL if user already set one
          photoUrl: prev.design?.photoUrl || ''
        }
      }));
    } else {
      setResumeData(prev => ({ ...prev, template: templateId }));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* SECTION 1: TEMPLATE GALLERY (8 CARDS) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layout className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Choose Resume Template (8 ATS Options)
            </h3>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            All 8 ATS Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {TEMPLATE_DEFINITIONS.map((tpl) => {
            const isSelected = resumeData.template === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl.id)}
                className={`group relative p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
                }`}
              >
                {/* Mini Visual Document Preview Thumbnail */}
                <div className="w-full h-20 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 overflow-hidden mb-2.5 space-y-1.5 shadow-2xs">
                  {/* Mini Header representation */}
                  <div className="flex items-center space-x-1.5">
                    {tpl.id === 'creative' && (
                      <div className="w-4 h-4 rounded-full bg-slate-300 shrink-0" />
                    )}
                    <div className="space-y-0.5 flex-1">
                      <div 
                        className="h-2 rounded-xs w-3/4" 
                        style={{ backgroundColor: tpl.defaults.primaryColor }}
                      />
                      <div className="h-1 rounded-xs w-1/2 bg-slate-300 dark:bg-slate-700" />
                    </div>
                  </div>
                  {/* Mini divider */}
                  <div 
                    className="h-0.5 w-full rounded-xs" 
                    style={{ backgroundColor: tpl.defaults.primaryColor, opacity: 0.6 }}
                  />
                  {/* Mini Body */}
                  <div className="space-y-1">
                    <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-xs w-full" />
                    <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-xs w-5/6" />
                    <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-xs w-4/6" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tpl.name}
                    </span>
                    {isSelected && (
                      <span className="p-0.5 rounded-full bg-blue-600 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                    {tpl.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px]">
                  <span className="text-slate-400 dark:text-slate-500 font-medium">{tpl.category}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">ATS {tpl.atsScore}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: TYPOGRAPHY & FONT STYLING */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Type className="h-4 w-4 text-purple-600" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Typography & Text Scaling
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Font Family */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Font Family
            </label>
            <select
              value={currentDesign.fontFamily}
              onChange={(e) => updateDesign({ fontFamily: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="inter">Inter / Modern Clean Sans</option>
              <option value="serif">Georgia / Classic Professional Serif</option>
              <option value="playfair">Playfair Display / Elegant Display</option>
              <option value="jakarta">Plus Jakarta Sans / Contemporary Tech</option>
              <option value="mono">JetBrains / Monospace Technical</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Font Scale / Density
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              {[
                { id: 'compact', label: 'Compact (10px)' },
                { id: 'normal', label: 'Standard (11px)' },
                { id: 'spacious', label: 'Spacious (12px)' }
              ].map((sz) => (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => updateDesign({ fontSize: sz.id as any })}
                  className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                    currentDesign.fontSize === sz.id
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {sz.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: COLORS & ACCENTS */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Palette className="h-4 w-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. Colors & Theme Accents
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Primary Color Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Primary Header & Border Color
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={currentDesign.primaryColor}
                  onChange={(e) => updateDesign({ primaryColor: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                  title="Custom Color Picker"
                />
                <span className="text-[10px] font-mono text-slate-500 uppercase">{currentDesign.primaryColor}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {COLOR_SWATCHES_PRIMARY.map((sw) => (
                <button
                  key={sw.hex}
                  type="button"
                  onClick={() => updateDesign({ primaryColor: sw.hex })}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                    currentDesign.primaryColor.toLowerCase() === sw.hex.toLowerCase()
                      ? 'border-blue-600 ring-2 ring-blue-400 scale-105'
                      : 'border-white dark:border-slate-800 shadow-2xs'
                  }`}
                  style={{ backgroundColor: sw.hex }}
                  title={sw.name}
                >
                  {currentDesign.primaryColor.toLowerCase() === sw.hex.toLowerCase() && (
                    <Check className="h-3 w-3 text-white drop-shadow-xs" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Accent Highlighting & Links
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={currentDesign.accentColor}
                  onChange={(e) => updateDesign({ accentColor: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                  title="Custom Accent Picker"
                />
                <span className="text-[10px] font-mono text-slate-500 uppercase">{currentDesign.accentColor}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {COLOR_SWATCHES_ACCENT.map((sw) => (
                <button
                  key={sw.hex}
                  type="button"
                  onClick={() => updateDesign({ accentColor: sw.hex })}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                    currentDesign.accentColor.toLowerCase() === sw.hex.toLowerCase()
                      ? 'border-blue-600 ring-2 ring-blue-400 scale-105'
                      : 'border-white dark:border-slate-800 shadow-2xs'
                  }`}
                  style={{ backgroundColor: sw.hex }}
                  title={sw.name}
                >
                  {currentDesign.accentColor.toLowerCase() === sw.hex.toLowerCase() && (
                    <Check className="h-3 w-3 text-white drop-shadow-xs" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: LAYOUT & GRID OPTIONS */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            4. Structure, Headers & Spacing
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Column Layout */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Column Layout
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateDesign({ layoutStyle: 'one-column' })}
                className={`p-2.5 rounded-xl border-2 text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                  currentDesign.layoutStyle === 'one-column'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Grid className="h-4 w-4" />
                <span>Single Column</span>
              </button>

              <button
                type="button"
                onClick={() => updateDesign({ layoutStyle: 'two-column' })}
                className={`p-2.5 rounded-xl border-2 text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                  currentDesign.layoutStyle === 'two-column'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Columns className="h-4 w-4" />
                <span>Two Columns</span>
              </button>
            </div>
          </div>

          {/* Header Style */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Header Layout Style
            </label>
            <select
              value={currentDesign.headerStyle}
              onChange={(e) => updateDesign({ headerStyle: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="left">Left Aligned Standard</option>
              <option value="centered">Centered Title & Contacts</option>
              <option value="banner">Full Primary Color Top Banner</option>
              <option value="minimal">Minimal Single-Line Header</option>
            </select>
          </div>

          {/* Page Margins */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Page Margins
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px]">
              {[
                { id: 'compact', label: 'Compact' },
                { id: 'standard', label: 'Standard' },
                { id: 'wide', label: 'Wide' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => updateDesign({ pageMargins: m.id as any })}
                  className={`py-1.5 font-semibold rounded-lg transition-all ${
                    currentDesign.pageMargins === m.id
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section Spacing */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Section Gap Spacing
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px]">
              {[
                { id: 'compact', label: 'Tight' },
                { id: 'standard', label: 'Standard' },
                { id: 'relaxed', label: 'Relaxed' }
              ].map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => updateDesign({ sectionSpacing: sp.id as any })}
                  className={`py-1.5 font-semibold rounded-lg transition-all ${
                    currentDesign.sectionSpacing === sp.id
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: PROFILE PHOTO & ICON STYLING */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <ImageIcon className="h-4 w-4 text-amber-500" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            5. Profile Photo & Icon Customization
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Profile Photo Toggle & URL */}
          <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-900 dark:text-white">
                  Show Profile Photo
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Optional for creative or European style CVs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateDesign({ showProfilePhoto: !currentDesign.showProfilePhoto })}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                  currentDesign.showProfilePhoto ? 'bg-blue-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {currentDesign.showProfilePhoto && (
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700 animate-in fade-in">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Photo URL or Image Link
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                  value={currentDesign.photoUrl || ''}
                  onChange={(e) => updateDesign({ photoUrl: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Icon Style */}
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Contact Detail Icon Style
            </label>
            <div className="space-y-2">
              {[
                { id: 'none', title: 'None (Plain Text)', desc: 'Clean standard text labels (e.g., Email • Phone)' },
                { id: 'minimal', title: 'Minimal Outline Icons', desc: 'Subtle SVG icons beside contact fields' },
                { id: 'rounded-solid', title: 'Rounded Badge Icons', desc: 'Icons enclosed in primary-colored badges' }
              ].map((ic) => (
                <button
                  key={ic.id}
                  type="button"
                  onClick={() => updateDesign({ iconStyle: ic.id as any })}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                    currentDesign.iconStyle === ic.id
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 font-bold text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div>{ic.title}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{ic.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
