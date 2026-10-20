import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Lock,
  CheckCircle2,
  Play,
  ArrowRight,
  Clock,
  Compass,
  MapPin,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Award,
  Layers
} from 'lucide-react';
import { CurriculumSkill, ChildProfile } from '../types/learning';
import { RexyMascot } from './RexyMascot';

interface Props {
  currentProfile: ChildProfile;
  skills: CurriculumSkill[];
  onStartSkill: (skill: CurriculumSkill) => void;
  onOpenStoryStudio?: () => void;
  onOpenDiscoveryLab?: () => void;
}

export const RexyLearningPath: React.FC<Props> = ({
  currentProfile,
  skills,
  onStartSkill,
  onOpenStoryStudio,
  onOpenDiscoveryLab,
}) => {
  const [selectedIsland, setSelectedIsland] = useState<'math' | 'reading' | 'science'>('math');
  const [viewMode, setViewMode] = useState<'map' | 'standards'>('map');

  const mathSkill = skills.find((s) => s.subject === 'math') || skills[0];
  const storySkill = skills.find((s) => s.subject === 'language') || skills[2];
  const scienceSkill = skills.find((s) => s.subject === 'science') || skills[1];

  // Islands configuration with pathway levels
  const islands = {
    math: {
      name: 'Number island',
      subject: 'Math',
      icon: '🏝️',
      color: 'sky',
      bgGrad: 'from-sky-500 to-indigo-600',
      activeSkillTitle: 'Add in clever ways',
      duration: '15 minutes',
      practiceTags: ['Count on', 'Make ten'],
      description: 'Break numbers apart and use ten-frames to add super fast without counting on fingers!',
      levels: [
        { id: 1, title: 'Count & Group', status: 'completed', stars: 3 },
        { id: 2, title: 'Ten Frame Magic', status: 'completed', stars: 3 },
        { id: 3, title: 'Add in clever ways', status: 'active', stars: 2 },
        { id: 4, title: 'Break Apart Numbers', status: 'locked', stars: 0 },
        { id: 5, title: 'Word Problem Detective', status: 'locked', stars: 0 },
      ],
    },
    reading: {
      name: 'Story forest',
      subject: 'Reading',
      icon: '🌳',
      color: 'rose',
      bgGrad: 'from-rose-500 to-purple-600',
      activeSkillTitle: 'The Seed That Wouldn\'t Give Up',
      duration: '12 minutes',
      practiceTags: ['New words', 'Predict next'],
      description: 'Explore character thoughts, discover new vocabulary words with audio, and invent your own ending!',
      levels: [
        { id: 1, title: 'Ocean Animals', status: 'completed', stars: 3 },
        { id: 2, title: 'Finding Clues', status: 'completed', stars: 3 },
        { id: 3, title: 'The Seed That Wouldn\'t Give Up', status: 'active', stars: 1 },
        { id: 4, title: 'Character Feelings', status: 'locked', stars: 0 },
        { id: 5, title: 'Tell My Story', status: 'locked', stars: 0 },
      ],
    },
    science: {
      name: 'Wonder valley',
      subject: 'Science',
      icon: '🌿',
      color: 'emerald',
      bgGrad: 'from-emerald-500 to-teal-600',
      activeSkillTitle: 'Grow your own little world',
      duration: '15 minutes',
      practiceTags: ['Sunlight & Water', 'Test ideas'],
      description: 'Test what plants need to thrive by adjusting sun and water sliders and watching real-time sprout growth!',
      levels: [
        { id: 1, title: 'Living vs Non-Living', status: 'completed', stars: 3 },
        { id: 2, title: 'Animal Habitats', status: 'completed', stars: 3 },
        { id: 3, title: 'Grow your own little world', status: 'active', stars: 2 },
        { id: 4, title: 'Weather Watcher', status: 'locked', stars: 0 },
        { id: 5, title: 'Soil & Minerals', status: 'locked', stars: 0 },
      ],
    },
  };

  const activeIslandData = islands[selectedIsland];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-['Fredoka'] tracking-tight">
              My Learning Path
            </h1>
            <span className="text-[10px] uppercase font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-mono">
              Ontario Grade {currentProfile.grade}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Your personalized learning adventure &bull; Follow the island trails to unlock discoveries!
          </p>
        </div>

        {/* 3 Top Summary Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-2xl">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <div className="text-left">
              <div className="text-xs font-black text-emerald-950 leading-none">3</div>
              <span className="text-[10px] text-emerald-700 font-bold">pathways</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <div className="text-left">
              <div className="text-xs font-black text-amber-950 leading-none">8</div>
              <span className="text-[10px] text-amber-700 font-bold">discoveries</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-2xl">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <div className="text-left">
              <div className="text-xs font-black text-sky-950 leading-none">Keep</div>
              <span className="text-[10px] text-sky-700 font-bold">growing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Island Pathway Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedIsland('math')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer font-['Fredoka'] ${
            selectedIsland === 'math'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>🏝️</span>
          <span>Number Island (Math)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedIsland('reading')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer font-['Fredoka'] ${
            selectedIsland === 'reading'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>🌳</span>
          <span>Story Forest (Reading)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedIsland('science')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer font-['Fredoka'] ${
            selectedIsland === 'science'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>🌿</span>
          <span>Wonder Valley (Science)</span>
        </button>
      </div>

      {/* Main Grid: Interactive Fantasy Island Map (Left 7 cols) + Next Discovery Card (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Fantasy Island Map Visualization (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 relative overflow-hidden min-h-[460px] flex flex-col justify-between">
          {/* Whimsical celestial sky background */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100/60 via-indigo-50/30 to-white pointer-events-none" />

          {/* Floating clouds & stars */}
          <div className="absolute top-4 left-6 text-sky-300 text-sm">☁️</div>
          <div className="absolute top-10 right-10 text-sky-300 text-base">☁️</div>
          <div className="absolute top-20 left-1/3 text-amber-300 text-xs">✨</div>

          {/* Island Title Card inside Canvas */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{activeIslandData.icon}</span>
              <div>
                <h3 className="text-lg font-black text-slate-900 font-['Fredoka']">
                  {activeIslandData.name}
                </h3>
                <span className="text-[11px] font-bold text-slate-400">
                  {activeIslandData.subject} Pathway &bull; Step 3 of 5
                </span>
              </div>
            </div>

            <RexyMascot size="sm" variant={selectedIsland === 'reading' ? 'reading' : selectedIsland === 'science' ? 'science' : 'blocks'} />
          </div>

          {/* Interactive Stepping Trail */}
          <div className="relative z-10 my-6 py-4">
            {/* Curved Path Line */}
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
              {activeIslandData.levels.map((lvl, index) => {
                const isCompleted = lvl.status === 'completed';
                const isActive = lvl.status === 'active';
                const isLocked = lvl.status === 'locked';

                return (
                  <div key={lvl.id} className="flex flex-col items-center group relative cursor-pointer">
                    {/* Node Circle */}
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedIsland === 'reading' && onOpenStoryStudio) {
                          onOpenStoryStudio();
                        } else if (selectedIsland === 'science' && onOpenDiscoveryLab) {
                          onOpenDiscoveryLab();
                        } else {
                          onStartSkill(mathSkill);
                        }
                      }}
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all shadow-md group-hover:scale-110 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                          : isActive
                          ? 'bg-gradient-to-tr from-sky-400 via-indigo-500 to-sky-500 text-white ring-4 ring-sky-200 animate-pulse'
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : isActive ? (
                        <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400" />
                      )}
                      <span className="text-[9px] font-black mt-0.5 font-mono">
                        L{lvl.id}
                      </span>
                    </button>

                    {/* Level Title */}
                    <span className="text-[11px] font-bold text-slate-700 mt-2 text-center max-w-[80px] line-clamp-1">
                      {lvl.title}
                    </span>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: 3 }).map((_, s) => (
                        <Star
                          key={s}
                          className={`w-2.5 h-2.5 ${
                            s < lvl.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Island Bottom Info */}
          <div className="relative z-10 bg-slate-50/90 rounded-2xl p-3 border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">
              💡 Complete all 5 levels to earn the golden Ontario {activeIslandData.subject} Crest!
            </span>
            <span className="font-bold text-sky-600">60% Complete</span>
          </div>
        </div>

        {/* Your Next Discovery Card (Right 5 Cols - from Mockup!) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                Your next discovery
              </span>
              <span className="text-xs font-bold text-sky-600">
                {activeIslandData.subject} &bull; {activeIslandData.name}
              </span>
            </div>

            {/* Banner with Rexy */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 p-4 text-white shadow-sm flex items-center justify-between">
              <RexyMascot size="lg" variant={selectedIsland === 'reading' ? 'reading' : selectedIsland === 'science' ? 'science' : 'blocks'} className="animate-float" />
              <div className="text-right">
                <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full uppercase">
                  Ready to play
                </span>
                <div className="font-handwriting text-xl text-amber-200 mt-1">
                  You got this!
                </div>
              </div>
            </div>

            {/* Title & Duration */}
            <div>
              <h3 className="text-xl font-black text-slate-900 font-['Fredoka']">
                {activeIslandData.activeSkillTitle}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeIslandData.duration}</span>
                <span>&bull;</span>
                <span>Ontario Curriculum Aligned</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {activeIslandData.description}
              </p>
            </div>

            {/* Skills you'll practise */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Skills you'll practise:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeIslandData.practiceTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  if (selectedIsland === 'reading' && onOpenStoryStudio) {
                    onOpenStoryStudio();
                  } else if (selectedIsland === 'science' && onOpenDiscoveryLab) {
                    onOpenDiscoveryLab();
                  } else {
                    onStartSkill(mathSkill);
                  }
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start adventure</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedIsland === 'reading' && onOpenStoryStudio) {
                    onOpenStoryStudio();
                  } else if (selectedIsland === 'science' && onOpenDiscoveryLab) {
                    onOpenDiscoveryLab();
                  } else {
                    onStartSkill(mathSkill);
                  }
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-700" />
                <span>Try a sample question</span>
              </button>
            </div>
          </div>

          {/* Go at my pace card */}
          <div className="bg-sky-50/80 border border-sky-200/80 rounded-2xl p-4 flex items-center gap-3">
            <RexyMascot size="xs" />
            <div className="text-xs">
              <div className="font-black text-sky-950 font-['Fredoka']">Go at my pace</div>
              <p className="text-sky-800 text-[11px] mt-0.5">
                Take your time. You can always come back and explore more!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
