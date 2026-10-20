import React, { useState } from 'react';
import { Sparkles, Target, Compass, Award, ArrowRight, CheckCircle2, ChevronRight, Activity, BookOpen } from 'lucide-react';
import { ChildProfile, CurriculumSkill } from '../types/learning';

interface Props {
  childProfile: ChildProfile;
  skills: CurriculumSkill[];
  onSelectSkill: (skill: CurriculumSkill) => void;
}

export const DiagnosticArena: React.FC<Props> = ({ childProfile, skills, onSelectSkill }) => {
  const [selectedStrand, setSelectedStrand] = useState<'all' | 'math' | 'science'>('all');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticScore, setDiagnosticScore] = useState(childProfile.diagnosticOverallScore);
  const [gradeLevel, setGradeLevel] = useState(childProfile.diagnosticGradeLevel);

  // Strands breakdown
  const strandScores = [
    { name: 'Number Sense & Operations', score: 510, grade: 'Grade 3.9', color: 'from-blue-500 to-cyan-500', icon: '🔢' },
    { name: 'Algebra & Coding Concepts', score: 490, grade: 'Grade 3.8', color: 'from-purple-500 to-indigo-500', icon: '💻' },
    { name: 'Spatial Sense & Geometry', score: 450, grade: 'Grade 3.4', color: 'from-teal-500 to-emerald-500', icon: '📐' },
    { name: 'Financial Literacy (CAD)', score: 530, grade: 'Grade 4.1', color: 'from-amber-500 to-yellow-500', icon: '🍁' },
    { name: 'Science & STEM Inquiry', score: 470, grade: 'Grade 3.6', color: 'from-rose-500 to-pink-500', icon: '🔬' },
  ];

  const handleStepIntoArena = () => {
    setIsDiagnosing(true);
    setTimeout(() => {
      setIsDiagnosing(false);
      setDiagnosticScore((prev) => prev + 15);
      setGradeLevel('Grade 3.8');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden mb-8">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-yellow-300" />
              Real-Time Diagnostic Arena
            </span>
            <span className="text-xs text-indigo-200">Ontario Curriculum Benchmarks</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black font-['Fredoka'] mb-2">
            Discover {childProfile.name}'s Exact Learning Edge
          </h1>
          <p className="text-sm text-indigo-100 leading-relaxed mb-6">
            Lumi's real-time diagnostic evaluates skills across all Ontario curriculum strands without test anxiety. Step into the arena to hone your pinpointed score!
          </p>

          <button
            type="button"
            onClick={handleStepIntoArena}
            disabled={isDiagnosing}
            className="px-6 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer font-['Fredoka']"
          >
            {isDiagnosing ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                Lumi is Calibrating Strands...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Step into Diagnostic Arena
              </>
            )}
          </button>
        </div>

        {/* Pinpoint Score Badge */}
        <div className="absolute right-6 top-8 hidden md:flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-center shadow-lg">
          <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest">
            Overall Score
          </span>
          <span className="text-5xl font-black text-white font-['Fredoka'] my-1">
            {diagnosticScore}
          </span>
          <span className="text-xs bg-emerald-400/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
            {gradeLevel} Equivalent
          </span>
        </div>
      </div>

      {/* Strand Breakdown Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-800 font-['Fredoka'] flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Ontario Strand Performance Indicators
          </h2>
          <span className="text-xs text-slate-500">Based on recent real-time questions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {strandScores.map((strand, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{strand.icon}</span>
                  <span className="text-xs font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                    {strand.grade}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{strand.name}</h3>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-2xl font-black text-slate-900 font-['Fredoka']">
                    {strand.score}
                  </span>
                  <span className="text-xs text-slate-400">/ 800</span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${strand.color}`}
                    style={{ width: `${(strand.score / 800) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-medium">
                  <span>Ontario Level 1</span>
                  <span className="text-emerald-600 font-bold">Level 4 (Mastery)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Action Plan */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-black text-slate-800 font-['Fredoka']">
            Lumi’s Recommended Next Steps for {childProfile.name}
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          These personalized skills will boost {childProfile.name}'s understanding in areas with highest potential for rapid growth.
        </p>

        <div className="space-y-3">
          {skills.slice(0, 3).map((skill) => (
            <div
              key={skill.id}
              onClick={() => onSelectSkill(skill)}
              className="group p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/30 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 font-black text-xs flex items-center justify-center font-mono shrink-0">
                  {skill.curriculumCode}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-900 transition-colors">
                    {skill.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {skill.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full hidden sm:inline">
                  SmartScore {skill.smartScore}/100
                </span>
                <div className="w-8 h-8 rounded-full bg-white group-hover:bg-indigo-600 group-hover:text-white border border-slate-200 flex items-center justify-center text-slate-500 transition-all shadow-xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
