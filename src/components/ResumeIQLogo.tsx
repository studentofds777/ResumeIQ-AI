import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const ResumeIQLogo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Unified Vector Graphic: Resume Document + Magnifying Glass + AI Sparkle */}
      <div
        className={`${sizeClasses[size]} relative rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center group transform transition-transform hover:scale-105`}
      >
        <div className="w-full h-full rounded-[14px] bg-slate-950/20 backdrop-blur-xs flex items-center justify-center relative overflow-hidden">
          {/* Glowing Ambient Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-purple-500/30 opacity-80 group-hover:opacity-100 transition-opacity" />

          {/* SVG Logo Graphic */}
          <svg
            className={`${iconSizes[size]} text-white relative z-10 drop-shadow-md`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Resume Document Outline */}
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" className="opacity-90" />
            <polyline points="14 2 14 8 20 8" className="opacity-80" />
            {/* Document Lines */}
            <line x1="8" y1="13" x2="12" y2="13" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="8" y1="17" x2="11" y2="17" strokeWidth="2.2" strokeLinecap="round" />
            {/* Magnifying Glass Lens & Handle */}
            <circle cx="16" cy="15" r="3.2" className="stroke-cyan-300 fill-cyan-400/20" strokeWidth="2" />
            <line x1="18.5" y1="17.5" x2="21" y2="20" strokeWidth="2.5" className="stroke-cyan-200" />
            {/* AI Sparkle Star on Top Left */}
            <path d="M9 4.5L10 6L9 7.5L8 6z" className="fill-amber-300 stroke-amber-200" strokeWidth="0.5" />
          </svg>

          {/* Top Right Sparkle Badge */}
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 rounded-full p-0.5 shadow-xs">
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`${textSizeClasses[size]} font-black tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-purple-950 dark:from-white dark:via-blue-100 dark:to-purple-200 bg-clip-text text-transparent flex items-center gap-1`}
          >
            ResumeIQ <span className="text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text font-black">AI</span>
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 -mt-1">
            ATS Optimizer & Career Engine
          </span>
        </div>
      )}
    </div>
  );
};
