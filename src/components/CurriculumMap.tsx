import React, { useState } from 'react';
import { CurriculumSkill, GradeLevel, SubjectId, ChildProfile } from '../types/learning';
import {
  Search,
  BookOpen,
  Award,
  Sparkles,
  Flame,
  Star,
  CheckCircle2,
  ChevronRight,
  Filter,
  GraduationCap
} from 'lucide-react';

interface Props {
  skills: CurriculumSkill[];
  currentProfile: ChildProfile;
  onSelectSkill: (skill: CurriculumSkill) => void;
  activeGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  activeSubject: SubjectId;
  onSelectSubject: (subject: SubjectId) => void;
}

export const CurriculumMap: React.FC<Props> = ({
  skills,
  currentProfile,
  onSelectSkill,
  activeGrade,
  onSelectGrade,
  activeSubject,
  onSelectSubject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const grades: GradeLevel[] = ['K', '1', '2', '3', '4', '5', '6', '7', '8'];

  const subjects: Array<{ id: SubjectId; name: string; icon: string; badge: string }> = [
    { id: 'math', name: 'Mathematics', icon: '🔢', badge: 'Ontario 2020' },
    { id: 'science', name: 'Science & Tech', icon: '🔬', badge: 'Ontario 2022' },
    { id: 'language', name: 'Language Arts', icon: '📚', badge: 'Ontario 2023' },
    { id: 'social', name: 'Social Studies', icon: '🍁', badge: 'Ontario Heritage' },
  ];

  // Filter skills
  const filteredSkills = skills.filter((skill) => {
    const matchesSubject = skill.subject === activeSubject;
    const matchesGrade = skill.grade === activeGrade;
    const matchesQuery =
      searchQuery.trim() === '' ||
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.curriculumCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.strand.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSubject && matchesGrade && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Ontario Ministry Standards Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-5 rounded-3xl shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-xs">
            🍁
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold font-['Fredoka']">
                Ontario Ministry of Education Aligned
              </h2>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono uppercase">
                Official Standards
              </span>
            </div>
            <p className="text-xs text-emerald-100">
              Curriculum expectations mapped for TDSB, OCDSB, PDSB, YRDSB and all Ontario School Boards.
            </p>
          </div>
        </div>

        {/* Daily Streak & Reward Pill */}
        <div className="flex items-center gap-2 bg-black/15 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-white/10">
          <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span className="text-xs font-bold font-['Fredoka']">
            {currentProfile.currentStreakDays} Day Streak!
          </span>
        </div>
      </div>

      {/* Grade Selector Tabs */}
      <div className="mb-5 overflow-x-auto pb-2">
        <div className="flex items-center gap-1.5 min-w-max bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
          {grades.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onSelectGrade(g)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer font-['Fredoka'] ${
                activeGrade === g
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {g === 'K' ? 'Kindergarten' : `Grade ${g}`}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {subjects.map((subj) => (
          <button
            key={subj.id}
            type="button"
            onClick={() => onSelectSubject(subj.id)}
            className={`p-3.5 rounded-2xl border-2 transition-all text-left flex items-center justify-between cursor-pointer ${
              activeSubject === subj.id
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{subj.icon}</span>
              <div>
                <div className="font-extrabold text-sm text-slate-800 font-['Fredoka']">
                  {subj.name}
                </div>
                <div className="text-[10px] text-slate-500">{subj.badge}</div>
              </div>
            </div>
            {activeSubject === subj.id && (
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
            )}
          </button>
        ))}
      </div>

      {/* Search and Filter bar */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search Grade ${activeGrade} Ontario skills (e.g., "Fractions", "Base-Ten", "B1.1")...`}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Skills Grid */}
      <div className="space-y-4">
        {filteredSkills.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700 text-sm">
              No skills found matching your filter
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Try switching grades or adjusting your search term.
            </p>
          </div>
        ) : (
          filteredSkills.map((skill) => {
            const score = skill.smartScore ?? 50;
            const isMastered = score >= 90;

            return (
              <div
                key={skill.id}
                onClick={() => onSelectSkill(skill)}
                className="group bg-white rounded-3xl p-5 border-2 border-slate-200/80 hover:border-indigo-500 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Code, Strand, Title, Expectation */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-lg">
                      {skill.curriculumCode}
                    </span>
                    <span className="text-xs font-semibold text-indigo-700">
                      {skill.strand}
                    </span>
                    {skill.substrand && (
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        • {skill.substrand}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {skill.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {skill.description}
                  </p>

                  <div className="text-[11px] text-emerald-800 bg-emerald-50/70 px-2.5 py-1 rounded-xl border border-emerald-100/80 inline-block font-medium">
                    🎯 <strong>Expectation:</strong> {skill.ontarioExpectation}
                  </div>
                </div>

                {/* Right: SmartScore & CTA */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* SmartScore Pill */}
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      SmartScore
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-lg font-black font-['Fredoka'] ${
                        isMastered ? 'text-emerald-600' : 'text-indigo-600'
                      }`}>
                        {score}
                      </span>
                      <span className="text-xs text-slate-400">/ 100</span>
                      {isMastered && <Award className="w-4 h-4 text-amber-500" />}
                    </div>
                  </div>

                  {/* Practice Button */}
                  <button
                    type="button"
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-700 group-hover:to-purple-700 text-white rounded-2xl text-xs font-extrabold shadow-sm flex items-center gap-1.5 cursor-pointer font-['Fredoka'] transition-transform group-hover:scale-105"
                  >
                    <span>Practice with Lumi</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
