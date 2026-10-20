import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  BookOpen,
  TrendingUp,
  Sparkles,
  Heart,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Bell,
  Volume2,
  Coffee,
  Mic,
  FileText,
  Lock,
  ArrowRight,
  Plus
} from 'lucide-react';
import { ChildProfile } from '../types/learning';
import { RexyMascot } from './RexyMascot';

interface Props {
  currentProfile: ChildProfile;
  profiles: ChildProfile[];
  onSelectProfile: (profile: ChildProfile) => void;
}

export const RexyParentInsightsWeeklyRhythm: React.FC<Props> = ({
  currentProfile,
  profiles,
  onSelectProfile,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'insights' | 'rhythm'>('insights');

  // Rhythm Timetable & Goal State
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(60);
  const [preferredSessionTime, setPreferredSessionTime] = useState<string>('4:30 PM');
  const [scheduleReminders, setScheduleReminders] = useState<boolean>(true);

  // Family Controls Toggles
  const [familyControls, setFamilyControls] = useState({
    readAloud: true,
    breakReminders: true,
    micPermission: true,
    parentReview: true,
  });

  const [savedPlanToast, setSavedPlanToast] = useState(false);

  const toggleControl = (key: keyof typeof familyControls) => {
    setFamilyControls((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePlan = () => {
    setSavedPlanToast(true);
    setTimeout(() => setSavedPlanToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-['Fredoka']">
              {activeSubTab === 'insights' ? 'Parent Insights' : 'Our Weekly Rhythm'}
            </h1>
            <span className="text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-mono">
              {currentProfile.name} &bull; Grade {currentProfile.grade}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {activeSubTab === 'insights'
              ? "See what they're exploring, celebrate progress, and plan what's next."
              : 'A calm plan for steady progress, curious discoveries, and time to be themselves.'}
          </p>
        </div>

        {/* Sub-Tab Navigation Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveSubTab('insights')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer font-['Fredoka'] ${
              activeSubTab === 'insights'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Parent Insights
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('rhythm')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer font-['Fredoka'] ${
              activeSubTab === 'rhythm'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Our Weekly Rhythm
          </button>
        </div>
      </div>

      {savedPlanToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-2xl text-xs font-bold flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Family rhythm plan and daily learning goal saved successfully!
          </span>
          <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded font-mono">Synced</span>
        </div>
      )}

      {/* VIEW 1: PARENT INSIGHTS (Matching Image 1 Left Side) */}
      {activeSubTab === 'insights' ? (
        <div className="space-y-6">
          {/* 4 Top Summary Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 leading-tight">4.2 h</div>
                <div className="text-[11px] font-medium text-slate-500">explored this week</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 leading-tight">5 days</div>
                <div className="text-[11px] font-medium text-slate-500">out of 7 learning days</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 leading-tight">3 subjects</div>
                <div className="text-[11px] font-medium text-slate-500">Math &bull; Reading &bull; Science</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 leading-tight">Growing ✨</div>
                <div className="text-[11px] font-medium text-slate-500">More initiative & effort</div>
              </div>
            </div>
          </div>

          {/* Main Grid: Weekly Activity Stacked Chart + Rexy Reflection (Left 7 cols) & Skill Focus (Right 5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Cols: Stacked Bar Chart & Weekly Reflection */}
            <div className="lg:col-span-7 space-y-6">
              {/* Stacked Bar Chart */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Sample weekly activity
                  </h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 font-semibold text-sky-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Math
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-rose-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Reading
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Science
                    </span>
                  </div>
                </div>

                {/* Stacked Chart Canvas */}
                <div className="h-44 flex items-end justify-between gap-4 pt-6 px-4 border-b border-slate-100">
                  {[
                    { day: 'Mon', math: 25, read: 20, sci: 15 },
                    { day: 'Tue', math: 30, read: 25, sci: 20 },
                    { day: 'Wed', math: 20, read: 30, sci: 15 },
                    { day: 'Thu', math: 35, read: 25, sci: 20 },
                    { day: 'Fri', math: 40, read: 30, sci: 25 },
                  ].map((bar) => {
                    const total = bar.math + bar.read + bar.sci;
                    return (
                      <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div className="w-full max-w-[40px] flex flex-col justify-end rounded-t-xl overflow-hidden shadow-xs" style={{ height: `${(total / 100) * 100}%` }}>
                          <div className="bg-emerald-500 w-full" style={{ height: `${(bar.sci / total) * 100}%` }} title={`Science: ${bar.sci}m`} />
                          <div className="bg-rose-500 w-full" style={{ height: `${(bar.read / total) * 100}%` }} title={`Reading: ${bar.read}m`} />
                          <div className="bg-sky-500 w-full" style={{ height: `${(bar.math / total) * 100}%` }} title={`Math: ${bar.math}m`} />
                        </div>
                        <span className="text-xs font-bold text-slate-500">{bar.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rexy's Weekly Reflection Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Rexy's weekly reflection
                  </h3>
                  <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full font-mono">
                    AI Diagnostic
                  </span>
                </div>

                <div className="flex items-start gap-4 bg-sky-50/70 border border-sky-100 rounded-2xl p-4">
                  <RexyMascot size="lg" className="shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                      "Your explorer is explaining how they solve addition problems! They showed great persistence making groups of ten. Try counting everyday objects together at dinner!"
                    </p>
                    <span className="font-handwriting text-base font-bold text-sky-800 block">
                      Curious today. Brighter tomorrow!
                    </span>
                  </div>
                </div>

                {/* Suggested Next Step */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider font-mono">
                      Suggested next step
                    </span>
                    <h4 className="text-xs font-black text-slate-900">
                      10-minute family reading ritual
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Read a short story together and talk about what the characters think and feel.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-purple-600 shrink-0" />
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Skill Focus & What Child Learned */}
            <div className="lg:col-span-5 space-y-6">
              {/* Skill Focus This Week */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Skill focus this week
                </h3>

                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">➕</span>
                        <span className="text-xs font-black text-slate-900">Addition strategies</span>
                      </div>
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                        Growing
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500">Using different ways to find the answer</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">📖</span>
                        <span className="text-xs font-black text-slate-900">Reading comprehension</span>
                      </div>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                        Practising
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '55%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500">Understanding and talking about stories</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🌱</span>
                        <span className="text-xs font-black text-slate-900">Plant needs</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Exploring
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500">Identifying what plants need to grow</p>
                  </div>
                </div>
              </div>

              {/* What My Child Learned */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    What my child learned
                  </h3>
                  <button type="button" className="text-xs font-bold text-indigo-600 hover:underline">
                    See all
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      ●
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Today</div>
                      <p className="text-slate-600 text-[11px]">Read a story about ocean animals and shared their favourite part.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      ●
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Yesterday</div>
                      <p className="text-slate-600 text-[11px]">Practised addition using groups of objects and ten frames.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      ●
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Thursday</div>
                      <p className="text-slate-600 text-[11px]">Explored how plants grow and tested sunlight conditions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: OUR WEEKLY RHYTHM (Matching Image 1 Right Side) */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 font-['Fredoka']">
                  Weekly Plan & Timetable
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  Structured 60-minute daily rhythm with energizing wiggle breaks
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                <span>Mar 11 – Mar 15</span>
              </div>
            </div>

            {/* Mon - Fri Timetable Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                <div key={day} className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-3 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-slate-900 font-mono">{day}</span>
                      <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
                        60 min
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[10px]">
                      <div className="p-1.5 bg-sky-50 rounded-lg text-sky-800 font-bold flex items-center justify-between">
                        <span>👋 Warm-up</span>
                        <span>5 min</span>
                      </div>
                      <div className="p-1.5 bg-blue-50 rounded-lg text-blue-800 font-bold flex items-center justify-between">
                        <span>🔢 Math</span>
                        <span>15 min</span>
                      </div>
                      <div className="p-1.5 bg-rose-50 rounded-lg text-rose-800 font-bold flex items-center justify-between">
                        <span>📖 Reading</span>
                        <span>15 min</span>
                      </div>
                      <div className="p-1.5 bg-amber-50 rounded-lg text-amber-800 font-bold flex items-center justify-between">
                        <span>🤸 Wiggle break</span>
                        <span>5 min</span>
                      </div>
                      <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-800 font-bold flex items-center justify-between">
                        <span>🔬 Science</span>
                        <span>15 min</span>
                      </div>
                      <div className="p-1.5 bg-purple-50 rounded-lg text-purple-800 font-bold flex items-center justify-between">
                        <span>💡 Reflection</span>
                        <span>5 min</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert(`Add custom activity for ${day}`)}
                    className="w-full py-1.5 mt-2 rounded-xl bg-white hover:bg-slate-100 border border-dashed border-slate-300 text-[10px] font-bold text-slate-600 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add activity</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Daily Goal & Preferred Session Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                  <span>Daily learning goal</span>
                  <span className="font-mono text-sky-600 bg-sky-50 px-2 py-0.5 rounded font-black">
                    {dailyGoalMinutes} min per day
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="15"
                  value={dailyGoalMinutes}
                  onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 font-mono">
                  <span>15 min</span>
                  <span>30 min</span>
                  <span>45 min</span>
                  <span>60 min</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                  <span>Preferred session time</span>
                  <span className="text-[11px] text-slate-500">When does your child learn best?</span>
                </div>
                <select
                  value={preferredSessionTime}
                  onChange={(e) => setPreferredSessionTime(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="3:30 PM">3:30 PM (Right after school)</option>
                  <option value="4:30 PM">4:30 PM (After snack &amp; unwind)</option>
                  <option value="6:00 PM">6:00 PM (Before dinner)</option>
                  <option value="7:00 PM">7:00 PM (Quiet evening routine)</option>
                </select>
              </div>
            </div>

            {/* Family Controls & Permissions Toggles (from Mockup!) */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Family controls &amp; safety
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                  You're in control
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Read-aloud</div>
                    <p className="text-[10px] text-slate-500">Allow Rexy to read content aloud</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={familyControls.readAloud}
                    onChange={() => toggleControl('readAloud')}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Break reminders</div>
                    <p className="text-[10px] text-slate-500">Gentle nudges to move and rest</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={familyControls.breakReminders}
                    onChange={() => toggleControl('breakReminders')}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Ask before microphone</div>
                    <p className="text-[10px] text-slate-500">Ask for your permission before voice recording</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={familyControls.micPermission}
                    onChange={() => toggleControl('micPermission')}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Parent review</div>
                    <p className="text-[10px] text-slate-500">Review learning notes and activity summaries</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={familyControls.parentReview}
                    onChange={() => toggleControl('parentReview')}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSavePlan}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer font-['Fredoka']"
              >
                <span>Save family plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
