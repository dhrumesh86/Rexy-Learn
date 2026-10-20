import React from 'react';
import { Award, Star, Trophy, Sparkles, X } from 'lucide-react';
import { ChildProfile } from '../types/learning';

interface Props {
  profile: ChildProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentAwardsModal: React.FC<Props> = ({ profile, isOpen, onClose }) => {
  if (!isOpen) return null;

  const allBadges = [
    { title: 'Ontario Math Champion', icon: '🍁', desc: 'Reached SmartScore 100 on Grade 3 standards', earned: true },
    { title: 'Canadarm Space Pioneer', icon: '🚀', desc: 'Mastered Science Grade 6 Space exploration', earned: true },
    { title: 'Beaver Logic Builder', icon: '🦫', desc: 'Solved 10 consecutive coding loop puzzles', earned: true },
    { title: 'Cell Biologist', icon: '🔬', desc: 'Explored human organ systems with 90%+ accuracy', earned: true },
    { title: 'Canadian Currency Ace', icon: '💰', desc: 'Mastered making change with Loonies & Toonies', earned: true },
    { title: '7-Day Learning Streak', icon: '🔥', desc: 'Practiced 7 days in a row without breaking', earned: profile.currentStreakDays >= 7 },
    { title: 'Master of Fractions', icon: '🍕', desc: 'Completed 20 fraction bar comparisons', earned: false },
    { title: 'Grand Provincial Scholar', icon: '👑', desc: 'Achieve Level 4 across all 5 curriculum strands', earned: false },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-scaleUp">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl text-amber-600 shadow-inner">
            🏆
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 font-['Fredoka']">
              {profile.name}’s Ontario Trophy Album
            </h2>
            <p className="text-xs text-slate-500">
              {allBadges.filter((b) => b.earned).length} of {allBadges.length} Badges Unlocked
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
          {allBadges.map((badge, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                badge.earned
                  ? 'bg-amber-50/70 border-amber-200 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
              }`}
            >
              <div className="text-3xl mb-1">{badge.icon}</div>
              <h4 className="font-bold text-xs text-slate-800 font-['Fredoka'] mb-0.5">
                {badge.title}
              </h4>
              <p className="text-[10px] text-slate-500 leading-tight">
                {badge.desc}
              </p>
              {badge.earned ? (
                <span className="inline-block mt-2 text-[9px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  Unlocked!
                </span>
              ) : (
                <span className="inline-block mt-2 text-[9px] font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                  In Progress
                </span>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer font-['Fredoka']"
        >
          Keep Earning Badges
        </button>
      </div>
    </div>
  );
};
