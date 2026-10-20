import React, { useState } from 'react';
import { StreakData } from '../types/classroom';
import { Flame, ShieldCheck, Trophy, Sparkles, ChevronRight, CheckCircle2, Calendar, Zap, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  streakData: StreakData;
  childName: string;
  onPracticeClick?: () => void;
}

export const DailyStreakTracker: React.FC<Props> = ({ streakData, childName, onPracticeClick }) => {
  const [showStreakModal, setShowStreakModal] = useState(false);

  const triggerCelebration = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const isTodayComplete = streakData.todayCompletedCount >= streakData.dailyGoalCount;

  return (
    <>
      {/* Prominent Streak Card on Student Dashboard */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden mb-6 transition-all hover:shadow-xl">
        {/* Ambient background glows */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-yellow-300/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-600/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Flame Icon & Day Count */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setShowStreakModal(true);
                triggerCelebration();
              }}
              className="relative group cursor-pointer"
              title="Click to view streak journey & rewards"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform">
                <span className="inline-block animate-bounce drop-shadow-md">🔥</span>
              </div>
              <span className="absolute -bottom-1.5 -right-1.5 bg-yellow-300 text-amber-950 font-black text-[11px] px-1.5 py-0.2 rounded-full shadow-md font-mono border-2 border-orange-600">
                +{streakData.currentStreak}
              </span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black font-['Fredoka'] text-white flex items-center gap-1.5 tracking-tight">
                  <span>{streakData.currentStreak} Day Learning Streak!</span>
                </h2>
                <span className="text-[10px] font-bold bg-white/20 text-yellow-200 px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                  On Fire
                </span>
              </div>
              <p className="text-xs text-orange-100 font-medium">
                {isTodayComplete
                  ? `Awesome job, ${childName}! You've reached your daily goal for today!`
                  : `${streakData.todayCompletedCount} of ${streakData.dailyGoalCount} daily skills completed today. Keep the flame alive!`}
              </p>
            </div>
          </div>

          {/* Right: Weekly Calendar Beads & Quick Details Button */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Weekly Days Bar */}
            <div className="flex items-center gap-1.5 bg-black/15 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
              {streakData.weeklyHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center w-8 h-10 rounded-xl text-[10px] font-bold transition-all ${
                    item.completed
                      ? 'bg-amber-300 text-amber-950 shadow-xs'
                      : item.isToday
                      ? 'bg-white/30 text-white ring-2 ring-yellow-300'
                      : 'bg-white/10 text-orange-200'
                  }`}
                  title={`${item.day} (${item.date}): ${item.completed ? 'Completed!' : 'In progress'}`}
                >
                  <span className="text-[9px] uppercase">{item.day}</span>
                  <span className="text-xs">
                    {item.completed ? '🔥' : item.isToday ? '⚡' : '•'}
                  </span>
                </div>
              ))}
            </div>

            {/* View Full Streak Hub button */}
            <button
              type="button"
              onClick={() => setShowStreakModal(true)}
              className="px-4 py-2.5 bg-white text-orange-600 hover:bg-orange-50 font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer font-['Fredoka'] shrink-0"
            >
              <span>Streak Hub</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar toward daily goal */}
        <div className="relative z-10 mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-orange-100">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>
              Daily Goal: <strong>{streakData.todayCompletedCount} / {streakData.dailyGoalCount} questions</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-200" />
            <span className="text-[11px] font-semibold text-yellow-100">
              {streakData.streakFreezesAvailable} Streak Freezes Active
            </span>
          </div>
        </div>
      </div>

      {/* Streak Details & Milestone Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-scaleUp text-slate-800">
            <button
              type="button"
              onClick={() => setShowStreakModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-4xl shadow-md mx-auto mb-3">
                🔥
              </div>
              <h3 className="text-2xl font-black font-['Fredoka'] text-slate-900">
                {childName}'s Learning Streak
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Consistency is the secret to mastering the Ontario Curriculum. Daily 15-minute practice sessions compound into true brilliance!
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 uppercase">Current Streak</span>
                <div className="text-2xl font-black text-amber-900 font-['Fredoka']">
                  {streakData.currentStreak} Days
                </div>
              </div>
              <div className="bg-orange-50 p-3 rounded-2xl border border-orange-200">
                <span className="text-[10px] font-bold text-orange-700 uppercase">Longest Streak</span>
                <div className="text-2xl font-black text-orange-900 font-['Fredoka']">
                  {streakData.longestStreak} Days
                </div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Freezes</span>
                <div className="text-2xl font-black text-emerald-900 font-['Fredoka']">
                  {streakData.streakFreezesAvailable} Shielded
                </div>
              </div>
            </div>

            {/* Streak Milestones */}
            <div className="mb-5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                Streak Milestones & Rewards
              </h4>
              <div className="space-y-2">
                {streakData.milestones.map((m, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                      m.unlocked
                        ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                        m.unlocked ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {m.days}d
                      </span>
                      <div>
                        <div className="text-xs font-bold font-['Fredoka']">{m.title}</div>
                        <div className="text-[11px] text-slate-500">{m.reward}</div>
                      </div>
                    </div>
                    {m.unlocked ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Unlocked!
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">
                        {m.days - streakData.currentStreak} days left
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowStreakModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
              {onPracticeClick && (
                <button
                  type="button"
                  onClick={() => {
                    setShowStreakModal(false);
                    onPracticeClick();
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs rounded-xl shadow cursor-pointer font-['Fredoka'] flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Practice Today's Skill
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
