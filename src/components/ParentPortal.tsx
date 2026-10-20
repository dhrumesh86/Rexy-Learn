import React, { useState } from 'react';
import { ChildProfile, CurriculumSkill } from '../types/learning';
import {
  Heart,
  TrendingUp,
  Award,
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  Printer,
  Sparkles,
  ChevronDown,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';

interface Props {
  profiles: ChildProfile[];
  currentProfile: ChildProfile;
  onSelectProfile: (profile: ChildProfile) => void;
  skills: CurriculumSkill[];
}

export const ParentPortal: React.FC<Props> = ({ profiles, currentProfile, onSelectProfile, skills }) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [weeklyGoalQuestions, setWeeklyGoalQuestions] = useState(150);

  // Filter skills by child's grade
  const gradeSkills = skills.filter((s) => s.grade === currentProfile.grade);
  const masteredCount = gradeSkills.filter((s) => (s.smartScore ?? 0) >= 90).length;
  const inProgressCount = gradeSkills.length - masteredCount;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Profile Bar & Role Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-3xl shadow-sm">
            {currentProfile.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-800 font-['Fredoka']">
                {currentProfile.name}'s Learning Journey
              </h1>
              <span className="text-xs bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full font-bold">
                Parent Portal
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Grade {currentProfile.grade} • {currentProfile.targetSchoolBoard}
            </p>
          </div>
        </div>

        {/* Child Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Switch Child:</span>
          <div className="flex gap-1.5">
            {profiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectProfile(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  p.id === currentProfile.id
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{p.avatar}</span>
                <span>{p.name} (Gr {p.grade})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Row: Time, Questions, Accuracy, Mastered */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Practice Time</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-slate-800 font-['Fredoka']">
            {Math.floor(currentProfile.totalTimeMinutes / 60)}h {currentProfile.totalTimeMinutes % 60}m
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1">↑ 22% vs last week</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Questions Solved</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-800 font-['Fredoka']">
            {currentProfile.totalQuestions}
          </div>
          <span className="text-[11px] text-slate-500 mt-1">Goal: {weeklyGoalQuestions}/week</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Ontario Mastery</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-800 font-['Fredoka']">
            {masteredCount} Skills
          </div>
          <span className="text-[11px] text-amber-700 font-medium mt-1">SmartScore 90+ achieved</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Diagnostic Level</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-purple-700 font-['Fredoka']">
            {currentProfile.diagnosticGradeLevel}
          </div>
          <span className="text-[11px] text-purple-600 font-bold mt-1">Score: {currentProfile.diagnosticOverallScore}</span>
        </div>
      </div>

      {/* Main Grid: Concept Hurdles & Ontario Curriculum Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column: Concept Hurdles & Misconceptions (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* AI Identified Concept Hurdles Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-black text-slate-800 font-['Fredoka'] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Lumi’s Concept Hurdle Alerts
              </h2>
              <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                Actionable Family Tips
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              When {currentProfile.name} hesitates or repeats mistakes, Lumi isolates the exact conceptual barrier rather than just marking answers wrong.
            </p>

            <div className="space-y-3">
              {currentProfile.recentHurdles.map((hurdle, i) => (
                <div
                  key={i}
                  className="bg-amber-50/70 border-2 border-amber-200/80 rounded-2xl p-4 text-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-amber-950 font-['Fredoka']">
                      {hurdle.skillTitle}
                    </span>
                    <span className="text-[10px] text-amber-700 font-mono">
                      Detected: {hurdle.detectedAt}
                    </span>
                  </div>
                  <div className="text-xs text-amber-900 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-950">🧠 Identified Mental Trap: </span>
                    {hurdle.misconception}
                  </div>
                  <div className="text-xs text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-start gap-2">
                    <Heart className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-950">5-Minute Home Activity: </span>
                      {hurdle.parentTip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ontario Curriculum Report Card Generation */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-6 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-rose-950 font-['Fredoka'] mb-1">
                Ontario Curriculum Progress Certificate
              </h3>
              <p className="text-xs text-rose-700">
                Generate an official, printable milestone report for {currentProfile.name} aligned with Ontario Ministry standards.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCertificate(true)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer font-['Fredoka']"
            >
              <FileText className="w-4 h-4" />
              View & Print Certificate
            </button>
          </div>
        </div>

        {/* Right Column: Ontario Curriculum Standards Status (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-lg font-black text-slate-800 font-['Fredoka'] mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Grade {currentProfile.grade} Ontario Expectations
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Real-time mastery status according to Ontario Ministry Curriculum standards.
            </p>

            <div className="space-y-3">
              {gradeSkills.map((skill) => {
                const score = skill.smartScore ?? 65;
                const isMastered = score >= 90;

                return (
                  <div
                    key={skill.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded">
                          {skill.curriculumCode}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {skill.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {skill.strand}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-xs font-black font-['Fredoka'] ${isMastered ? 'text-emerald-600' : 'text-indigo-600'}`}>
                        {score}/100
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isMastered ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {isMastered ? 'Level 4' : 'Level 3'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Google Classroom & Extracurriculars Overview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-base text-slate-800 font-['Fredoka'] flex items-center gap-2">
                <span className="text-xl">🏫</span>
                Google Classroom & Schedule
              </h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                TDSB Synced
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time monitoring of school assignments, teacher notes, and extracurricular activity balance.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Homework Completion Rate</div>
                  <div className="text-[11px] text-slate-500">3 of 4 assignments turned in on time</div>
                </div>
                <span className="font-black text-emerald-600 font-mono text-sm">75%</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Due Tomorrow: </span>
                  Fractions of a Set Problem Solving (Ontario Math B1.4)
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🏒</span>
                  <div>
                    <div className="font-bold text-indigo-950">Next Extracurricular</div>
                    <div className="text-[11px] text-indigo-700">Minor Hockey Practice • 4:00 PM</div>
                  </div>
                </div>
                <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded-full">
                  1h on ice
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border-8 border-amber-300 relative text-center">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
            >
              ✕ Close
            </button>

            {/* Official seal */}
            <div className="flex justify-center items-center gap-2 mb-2">
              <span className="text-3xl">🍁</span>
              <span className="text-xs font-black text-rose-700 uppercase tracking-widest">
                Ontario Curriculum Milestone Certificate
              </span>
              <span className="text-3xl">🍁</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-['Fredoka'] mb-2">
              Certificate of Academic Excellence
            </h2>

            <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">
              Presented to
            </p>

            <div className="text-3xl font-black text-indigo-900 font-['Fredoka'] border-b-2 border-indigo-200 pb-2 inline-block px-8 mb-4">
              {currentProfile.name}
            </div>

            <p className="text-sm text-slate-700 max-w-lg mx-auto leading-relaxed mb-6">
              For demonstrating exceptional dedication and mastery of <strong>Grade {currentProfile.grade} Ontario Curriculum Expectations</strong> in Mathematics, Science, and STEM Inquiry, having answered <strong>{currentProfile.totalQuestions} questions</strong> with guided real-time AI Socratic mentorship.
            </p>

            <div className="grid grid-cols-3 gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center mb-6">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase">Diagnostic Level</span>
                <div className="text-base font-black text-amber-950 font-['Fredoka']">{currentProfile.diagnosticGradeLevel}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase">Mastered Skills</span>
                <div className="text-base font-black text-amber-950 font-['Fredoka']">{masteredCount} Standards</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase">Academic Partner</span>
                <div className="text-base font-black text-amber-950 font-['Fredoka']">Lumi AI Tutor</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer font-['Fredoka']"
              >
                <Printer className="w-4 h-4" />
                Print Certificate
              </button>
              <button
                type="button"
                onClick={() => setShowCertificate(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
