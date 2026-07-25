import React, { useState } from 'react';
import { X, User, Briefcase, Award, Save, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Senior');
  const [industry, setIndustry] = useState(user?.industry || 'Technology & Cloud SaaS');
  const [savedStatus, setSavedStatus] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      targetRole,
      experienceLevel: experienceLevel as any,
      industry
    });
    setSavedStatus(true);
    setTimeout(() => {
      setSavedStatus(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Profile & Career Preferences</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Career Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Type your target role..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as any)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Entry-Level">Entry-Level (0-2 Yrs)</option>
              <option value="Mid-Level">Mid-Level (3-5 Yrs)</option>
              <option value="Senior">Senior (6+ Yrs)</option>
              <option value="Executive">Executive / Director</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Industry Focus</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            {savedStatus ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{savedStatus ? 'Saved Changes!' : 'Save Preferences'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
