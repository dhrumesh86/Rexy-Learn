import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Star,
  Flame,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Search,
  Users,
  Calendar,
  Globe,
  School,
  ArrowRight,
  Heart,
  Smile,
  ChevronUp,
  ChevronDown,
  Info,
  X,
  Volume2,
  Share2,
  ShieldAlert,
  Zap,
  BookOpen
} from 'lucide-react';
import { ChildProfile, GradeLevel } from '../types/learning';
import { RexyMascot } from './RexyMascot';
import {
  LeaderboardEntry,
  INITIAL_LEADERBOARD_STUDENTS,
  SPECIAL_ENCOURAGEMENT_AWARDS
} from '../data/leaderboardData';

export type LeaderboardMetric = 'all-round' | 'smart-score' | 'assignments' | 'streak';
export type LeaderboardScope = 'global' | 'school-board' | 'grade';
export type LeaderboardTimeframe = 'this-week' | 'all-time';

interface Props {
  currentProfile: ChildProfile;
  onOpenSkillPractice?: () => void;
  onOpenClassroomAssignments?: () => void;
  onClose?: () => void;
  isCompactModal?: boolean;
}

export const GlobalLearningLeaderboard: React.FC<Props> = ({
  currentProfile,
  onOpenSkillPractice,
  onOpenClassroomAssignments,
  onClose,
  isCompactModal = false,
}) => {
  const [students, setStudents] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD_STUDENTS);
  const [metric, setMetric] = useState<LeaderboardMetric>('all-round');
  const [scope, setScope] = useState<LeaderboardScope>('global');
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('this-week');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<LeaderboardEntry | null>(null);

  // Kudos / Cheer animation state
  const [floatingCheer, setFloatingCheer] = useState<{ id: string; emoji: string; studentId: string } | null>(null);
  const [celebrationFanfare, setCelebrationFanfare] = useState<string | null>(null);

  // Filtered and sorted students
  const filteredStudents = students
    .filter((student) => {
      // Scope filter
      if (scope === 'school-board' && !student.schoolBoard.includes('Toronto District')) {
        return false;
      }
      if (scope === 'grade' && student.grade !== currentProfile.grade) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          student.name.toLowerCase().includes(q) ||
          student.school.toLowerCase().includes(q) ||
          student.city.toLowerCase().includes(q) ||
          student.badgeTitle.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (metric === 'smart-score') {
        return b.smartScorePoints - a.smartScorePoints;
      }
      if (metric === 'assignments') {
        return b.completedAssignments - a.completedAssignments;
      }
      if (metric === 'streak') {
        return b.streakDays - a.streakDays;
      }
      // All-round weighted index: SmartScore points + (assignments * 25) + (streak * 15)
      const scoreA = a.smartScorePoints + a.completedAssignments * 25 + a.streakDays * 15;
      const scoreB = b.smartScorePoints + b.completedAssignments * 25 + b.streakDays * 15;
      return scoreB - scoreA;
    });

  // Find current user's rank
  const currentUserIndex = filteredStudents.findIndex(
    (s) => s.isCurrentUser || s.name.toLowerCase().includes(currentProfile.name.toLowerCase())
  );
  const currentUserEntry = currentUserIndex !== -1 ? filteredStudents[currentUserIndex] : null;
  const currentUserRank = currentUserIndex !== -1 ? currentUserIndex + 1 : 4;

  // Ahead student for growth nudge
  const studentAhead = currentUserIndex > 0 ? filteredStudents[currentUserIndex - 1] : null;
  const pointsToClimb =
    studentAhead && currentUserEntry
      ? metric === 'smart-score'
        ? studentAhead.smartScorePoints - currentUserEntry.smartScorePoints + 5
        : metric === 'assignments'
        ? studentAhead.completedAssignments - currentUserEntry.completedAssignments + 1
        : Math.max(10, (studentAhead.smartScorePoints - currentUserEntry.smartScorePoints) + 15)
      : 0;

  // Handle cheer / kudos
  const handleSendCheer = (studentId: string, emoji: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, kudosCount: s.kudosCount + 1 } : s))
    );
    setFloatingCheer({ id: String(Date.now()), emoji, studentId });
    setTimeout(() => {
      setFloatingCheer(null);
    }, 1200);
  };

  // Simulate boost action for child
  const handleSimulatePracticeBoost = () => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.isCurrentUser || s.name.toLowerCase().includes(currentProfile.name.toLowerCase())) {
          return {
            ...s,
            smartScorePoints: s.smartScorePoints + 60,
            smartScore100Count: s.smartScore100Count + 1,
            completedAssignments: s.completedAssignments + 1,
            growthNote: '🚀 Just completed Ontario Number Sense Quiz + reached 100 SmartScore!',
            kudosCount: s.kudosCount + 5,
          };
        }
        return s;
      })
    );
    setCelebrationFanfare("🎉 Amazing job! You boosted your SmartScore by +60 points and climbed up the leaderboard!");
    setTimeout(() => {
      setCelebrationFanfare(null);
    }, 5000);
  };

  const topThree = filteredStudents.slice(0, 3);
  const remainingStudents = filteredStudents.slice(3);

  return (
    <div className={`space-y-6 ${isCompactModal ? 'p-1' : ''}`}>
      {/* Top Banner with Rexy Cheering */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-800 text-white p-6 sm:p-8 shadow-xl border border-indigo-700/50">
        {/* Background decorative celestial stars */}
        <div className="absolute top-2 right-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-8 left-20 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Global Learning Leaderboard • Ontario Curriculum</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Fredoka'] tracking-tight text-white leading-tight">
              Celebrate Mastery, Growth &amp; Curiosity! 🌟
            </h1>

            <p className="text-xs sm:text-sm text-indigo-100 font-medium leading-relaxed">
              Track top performers in <strong className="text-amber-300 font-bold">SmartScore mastery</strong>,
              completed <strong className="text-sky-300 font-bold">Google Classroom assignments</strong>, and daily learning streaks.
              Every question explored makes you a stronger learner!
            </p>

            {/* Rexy Quote Callout */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium text-white shadow-xs">
              <span className="text-base">🦖</span>
              <span className="font-handwriting text-base text-amber-200">
                “Little questions lead to limitless achievements! Keep shining, {currentProfile.name}!”
              </span>
            </div>
          </div>

          {/* Right Trophy Mascot Podium Illustration */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 flex items-center justify-center shadow-lg border-4 border-white/30 animate-bounce-subtle">
                <RexyMascot size="lg" mood="celebrating" />
              </div>
              <span className="absolute -top-2 -right-1 text-2xl animate-spin" style={{ animationDuration: '8s' }}>
                ✨
              </span>
              <span className="absolute -bottom-2 -left-1 text-2xl">
                🏆
              </span>
            </div>
            <div className="mt-2 text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 bg-black/25 px-2.5 py-0.5 rounded-full">
                Friendly Explorer League
              </span>
            </div>
          </div>
        </div>

        {/* Celebration Fanfare Banner if triggered */}
        {celebrationFanfare && (
          <div className="mt-4 p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-2xl flex items-center justify-between shadow-lg animate-scaleUp">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎉</span>
              <span>{celebrationFanfare}</span>
            </div>
            <button
              onClick={() => setCelebrationFanfare(null)}
              className="p-1 rounded-lg hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Interactive Controls & Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => setMetric('all-round')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                metric === 'all-round'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All-Stars Overall</span>
            </button>

            <button
              type="button"
              onClick={() => setMetric('smart-score')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                metric === 'smart-score'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>SmartScore Mastery (100 Club)</span>
            </button>

            <button
              type="button"
              onClick={() => setMetric('assignments')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                metric === 'assignments'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Assignment All-Stars</span>
            </button>

            <button
              type="button"
              onClick={() => setMetric('streak')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                metric === 'streak'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Streak Legends</span>
            </button>
          </div>

          {/* Quick Actions (Simulate practice win / assignments) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSimulatePracticeBoost}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer font-['Fredoka']"
              title="Simulate answering Ontario curriculum problems to climb ranks"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-950" />
              <span>Boost My Score (+60 pts)</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-Filters: Scope & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Scope:</span>
            </span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setScope('global')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                  scope === 'global' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌎 Global
              </button>
              <button
                type="button"
                onClick={() => setScope('school-board')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                  scope === 'school-board' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏫 TDSB District
              </button>
              <button
                type="button"
                onClick={() => setScope('grade')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                  scope === 'grade' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎒 Grade {currentProfile.grade} Cohort
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Period:</span>
            </span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setTimeframe('this-week')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                  timeframe === 'this-week' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                This Week
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('all-time')}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                  timeframe === 'all-time' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All-Time
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, school, or city..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Student's Personal Rank & Growth Progress Banner */}
      {currentUserEntry && (
        <div className="relative overflow-hidden bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 rounded-3xl p-5 text-white shadow-lg border border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl border-2 border-white/40 shadow-inner">
                  {currentUserEntry.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 font-black text-[11px] px-1.5 py-0.2 rounded-full shadow-xs">
                  #{currentUserRank}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black font-['Fredoka'] text-white">
                    {currentUserEntry.name}
                  </h3>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    You
                  </span>
                </div>
                <p className="text-xs text-sky-100 font-medium">
                  {currentUserEntry.school} • {currentUserEntry.schoolBoard}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-bold text-white">
                  <span className="flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-lg">
                    <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>{currentUserEntry.smartScorePoints} SmartScore</span>
                  </span>
                  <span className="flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{currentUserEntry.completedAssignments} Assignments</span>
                  </span>
                  <span className="flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-lg">
                    <Flame className="w-3.5 h-3.5 text-orange-300 fill-orange-300" />
                    <span>{currentUserEntry.streakDays}-Day Streak</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Growth Encouragement Message */}
            <div className="text-right sm:max-w-xs space-y-2">
              {currentUserRank === 1 ? (
                <div className="bg-amber-400/20 border border-amber-300/40 p-2.5 rounded-2xl text-left">
                  <div className="text-xs font-black text-amber-300 flex items-center gap-1">
                    <span>👑 Global Rank #1 Leader!</span>
                  </div>
                  <p className="text-[11px] text-white mt-0.5">
                    Incredible work! You are inspiring students across Ontario!
                  </p>
                </div>
              ) : studentAhead ? (
                <div className="bg-white/15 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl text-left">
                  <div className="text-[11px] font-black text-amber-300 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Only {pointsToClimb} pts behind Rank #{currentUserRank - 1} ({studentAhead.name.split(' ')[0]})!</span>
                  </div>
                  <p className="text-[10px] text-indigo-100 mt-0.5">
                    Complete 1 quick Ontario math quest or submit your reading log to climb the podium!
                  </p>
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-2">
                {onOpenSkillPractice && (
                  <button
                    type="button"
                    onClick={onOpenSkillPractice}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-black text-xs shadow-xs transition-colors font-['Fredoka'] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Practice Next Standard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium (Gold, Silver, Bronze) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4 pb-2">
        {/* 2nd Place (Silver) */}
        {topThree[1] && (
          <div className="order-2 md:order-1 bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center relative group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-slate-400 to-slate-500 text-white font-black text-xs px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <span>🥈 2nd Place</span>
            </div>

            <div className="relative mt-2 mb-3">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform">
                {topThree[1].avatar}
              </div>
              <span className="absolute -bottom-1 -right-1 text-xl">🥈</span>
            </div>

            <h3 className="font-black text-slate-900 text-base font-['Fredoka']">
              {topThree[1].name}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mb-2">
              {topThree[1].school}
            </p>

            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full mb-3">
              {topThree[1].badgeTitle}
            </span>

            {/* Score Highlight */}
            <div className="w-full bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1 mb-3">
              <div className="text-xl font-black text-slate-800 font-['Fredoka']">
                {metric === 'smart-score'
                  ? `${topThree[1].smartScorePoints} pts`
                  : metric === 'assignments'
                  ? `${topThree[1].completedAssignments} done`
                  : metric === 'streak'
                  ? `${topThree[1].streakDays} days`
                  : `${topThree[1].smartScorePoints} pts`}
              </div>
              <div className="text-[10px] text-slate-500 font-bold flex items-center justify-center gap-2">
                <span>⭐ {topThree[1].smartScore100Count} Perfect 100s</span>
                <span>•</span>
                <span>📝 {topThree[1].completedAssignments} Tasks</span>
              </div>
            </div>

            {/* Cheer Button */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSendCheer(topThree[1].id, '⭐')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <span>⭐ Send Kudos</span>
                <span className="text-[10px] font-mono text-slate-400">({topThree[1].kudosCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudent(topThree[1])}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="View explorer profile"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 1st Place (Gold Champion) - Elevated & Highlighted */}
        {topThree[0] && (
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 via-white to-amber-50/50 rounded-3xl border-2 border-amber-400 p-6 shadow-xl hover:shadow-2xl transition-all flex flex-col items-center text-center relative md:-translate-y-3 group">
            {/* Shimmering Gold Crown Banner */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 font-black text-xs px-4 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-shimmer">
              <span>👑</span>
              <span>1st Place Champion</span>
              <span>✨</span>
            </div>

            <div className="relative mt-2 mb-3">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-200 to-amber-100 border-4 border-amber-300 flex items-center justify-center text-5xl shadow-lg group-hover:scale-105 transition-transform">
                {topThree[0].avatar}
              </div>
              <span className="absolute -top-3 -right-2 text-2xl animate-bounce-subtle">👑</span>
              <span className="absolute -bottom-1 -right-1 text-2xl">🥇</span>
            </div>

            <h3 className="font-black text-slate-900 text-lg font-['Fredoka']">
              {topThree[0].name}
            </h3>
            <p className="text-xs text-slate-500 font-medium line-clamp-1 mb-2">
              {topThree[0].school}
            </p>

            <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-3 py-0.5 rounded-full mb-3 shadow-xs">
              {topThree[0].badgeTitle}
            </span>

            {/* Score Highlight */}
            <div className="w-full bg-amber-100/60 rounded-2xl p-3.5 border border-amber-200 space-y-1 mb-3">
              <div className="text-2xl font-black text-amber-950 font-['Fredoka']">
                {metric === 'smart-score'
                  ? `${topThree[0].smartScorePoints} pts`
                  : metric === 'assignments'
                  ? `${topThree[0].completedAssignments} completed`
                  : metric === 'streak'
                  ? `${topThree[0].streakDays} day streak`
                  : `${topThree[0].smartScorePoints} pts`}
              </div>
              <div className="text-[11px] text-amber-800 font-bold flex items-center justify-center gap-2">
                <span>⭐ {topThree[0].smartScore100Count} Perfect 100s</span>
                <span>•</span>
                <span>🔥 {topThree[0].streakDays}-Day Streak</span>
              </div>
            </div>

            {/* Cheer Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSendCheer(topThree[0].id, '🎉')}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer font-['Fredoka']"
              >
                <span>🎉 Give High-Five!</span>
                <span className="text-[10px] font-mono opacity-80">({topThree[0].kudosCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudent(topThree[0])}
                className="p-2 rounded-xl text-amber-800 hover:text-amber-950 hover:bg-amber-200/60 transition-colors"
                title="View explorer profile"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 3rd Place (Bronze) */}
        {topThree[2] && (
          <div className="order-3 bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center relative group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black text-xs px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <span>🥉 3rd Place</span>
            </div>

            <div className="relative mt-2 mb-3">
              <div className="w-20 h-20 rounded-2xl bg-amber-50/80 border-2 border-amber-300/80 flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform">
                {topThree[2].avatar}
              </div>
              <span className="absolute -bottom-1 -right-1 text-xl">🥉</span>
            </div>

            <h3 className="font-black text-slate-900 text-base font-['Fredoka']">
              {topThree[2].name}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mb-2">
              {topThree[2].school}
            </p>

            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full mb-3">
              {topThree[2].badgeTitle}
            </span>

            {/* Score Highlight */}
            <div className="w-full bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1 mb-3">
              <div className="text-xl font-black text-slate-800 font-['Fredoka']">
                {metric === 'smart-score'
                  ? `${topThree[2].smartScorePoints} pts`
                  : metric === 'assignments'
                  ? `${topThree[2].completedAssignments} done`
                  : metric === 'streak'
                  ? `${topThree[2].streakDays} days`
                  : `${topThree[2].smartScorePoints} pts`}
              </div>
              <div className="text-[10px] text-slate-500 font-bold flex items-center justify-center gap-2">
                <span>⭐ {topThree[2].smartScore100Count} Perfect 100s</span>
                <span>•</span>
                <span>📝 {topThree[2].completedAssignments} Tasks</span>
              </div>
            </div>

            {/* Cheer Button */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSendCheer(topThree[2].id, '💖')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-800 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <span>💖 Send Cheer</span>
                <span className="text-[10px] font-mono text-slate-400">({topThree[2].kudosCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudent(topThree[2])}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="View explorer profile"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating cheer reaction toast */}
      {floatingCheer && (
        <div className="fixed bottom-10 right-10 z-50 pointer-events-none animate-confetti flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-2xl shadow-2xl">
          <span className="text-2xl">{floatingCheer.emoji}</span>
          <span className="text-xs font-bold">Kudos sent to explorer!</span>
        </div>
      )}

      {/* Ranks 4 to 10+ Table List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-900 font-['Fredoka'] text-base">
              Explorer Standings
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
              {filteredStudents.length} Students
            </span>
          </div>

          <div className="text-xs text-slate-400 font-semibold hidden sm:block">
            Updates continuously with Ontario classroom curriculum milestones
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredStudents.map((student, index) => {
            const rank = index + 1;
            const isUser = student.isCurrentUser || student.name.toLowerCase().includes(currentProfile.name.toLowerCase());

            return (
              <div
                key={student.id}
                className={`px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                  isUser
                    ? 'bg-sky-50/80 hover:bg-sky-100/70 border-l-4 border-sky-500'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Left: Rank, Avatar, Student Name, School */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-8 text-center shrink-0">
                    {rank === 1 ? (
                      <span className="text-xl">🥇</span>
                    ) : rank === 2 ? (
                      <span className="text-xl">🥈</span>
                    ) : rank === 3 ? (
                      <span className="text-xl">🥉</span>
                    ) : (
                      <span className="font-black text-sm text-slate-400 font-mono">
                        #{rank}
                      </span>
                    )}
                  </div>

                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shadow-xs">
                      {student.avatar}
                    </div>
                    {isUser && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-sky-500 rounded-full border-2 border-white animate-pulse"></span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900 truncate">
                        {student.name}
                      </h4>
                      {isUser && (
                        <span className="bg-sky-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                          You
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                        Gr {student.grade}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate">
                      {student.school} • {student.city}
                    </p>

                    <p className="text-[10px] text-indigo-600 font-medium truncate mt-0.5">
                      {student.growthNote}
                    </p>
                  </div>
                </div>

                {/* Right: Metrics + Interactive Kudos */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 shrink-0 pl-11 sm:pl-0">
                  {/* SmartScore Column */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end font-extrabold text-xs text-slate-800">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{student.smartScorePoints}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">
                      {student.smartScore100Count} in 100 Club
                    </div>
                  </div>

                  {/* Completed Assignments Column */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end font-extrabold text-xs text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{student.completedAssignments}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">
                      Assignments
                    </div>
                  </div>

                  {/* Streak Column */}
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-1 justify-end font-extrabold text-xs text-rose-500">
                      <Flame className="w-3.5 h-3.5 fill-rose-500" />
                      <span>{student.streakDays}d</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">
                      Streak
                    </div>
                  </div>

                  {/* Interactive Cheer Button */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSendCheer(student.id, '👏')}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-700 text-xs font-bold transition-colors flex items-center gap-1"
                      title="Cheer for this learner"
                    >
                      <span>👏</span>
                      <span className="text-[10px] font-mono text-slate-400">{student.kudosCount}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedStudent(student)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="View details"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Recognition & Effort Spotlight Section (Growth Mindset) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎖️</span>
            <div>
              <h3 className="font-black text-slate-900 font-['Fredoka'] text-base">
                Rexy Spotlight: Effort &amp; Character Awards
              </h3>
              <p className="text-xs text-slate-500">
                Recognizing consistency, curiosity, and teamwork — every quality of a great learner matters!
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            Updated Weekly
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SPECIAL_ENCOURAGEMENT_AWARDS.map((award, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-indigo-200 hover:shadow-xs transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 font-['Fredoka']">
                  {award.title}
                </span>
                <span className="text-xs">✨</span>
              </div>

              <div className="text-xs font-black text-indigo-900 bg-indigo-100/70 px-2 py-1 rounded-lg inline-block">
                {award.award}
              </div>

              <div className="font-extrabold text-sm text-slate-900">
                {award.studentName}
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                {award.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Student Detail Modal Inspector */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-scaleUp space-y-4">
            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 border-2 border-sky-200 flex items-center justify-center text-4xl shadow-inner">
                {selectedStudent.avatar}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 font-['Fredoka']">
                  {selectedStudent.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedStudent.school}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
                    {selectedStudent.badgeEmoji} {selectedStudent.badgeTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-lg font-black text-slate-900 font-['Fredoka']">
                  {selectedStudent.smartScorePoints}
                </div>
                <div className="text-[10px] text-slate-400 font-bold">SmartScore Pts</div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="text-lg font-black text-emerald-800 font-['Fredoka']">
                  {selectedStudent.completedAssignments}
                </div>
                <div className="text-[10px] text-emerald-600 font-bold">Assignments Done</div>
              </div>

              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100">
                <div className="text-lg font-black text-rose-800 font-['Fredoka']">
                  {selectedStudent.streakDays}d
                </div>
                <div className="text-[10px] text-rose-600 font-bold">Active Streak</div>
              </div>
            </div>

            {/* Favorite Ontario Strand & Growth Note */}
            <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 space-y-1.5 text-xs text-sky-950">
              <div className="font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                <span>Favorite Ontario Strand: {selectedStudent.favoriteStrand}</span>
              </div>
              <p className="text-[11px] text-sky-800">
                {selectedStudent.growthNote}
              </p>
            </div>

            {/* Student Cheer Quotes */}
            {selectedStudent.cheerQuotes.length > 0 && (
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-900 italic font-medium">
                {selectedStudent.cheerQuotes[0]}
              </div>
            )}

            {/* Send Cheer Action in Modal */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  handleSendCheer(selectedStudent.id, '🌟');
                  setSelectedStudent(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-colors flex items-center justify-center gap-1.5 font-['Fredoka']"
              >
                <span>🌟 Send Star Kudos!</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
