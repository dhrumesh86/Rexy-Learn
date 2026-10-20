import React from 'react';
import { PortalRole, DeviceView, ChildProfile } from '../types/learning';
import {
  Compass,
  BookOpen,
  User,
  Shield,
  Smartphone,
  Tablet,
  Monitor,
  Flame,
  Sparkles,
  Award,
  Trophy
} from 'lucide-react';
import { RexyMascot } from './RexyMascot';

interface Props {
  currentRole: PortalRole;
  onSelectRole: (role: PortalRole) => void;
  deviceView: DeviceView;
  onSelectDevice: (device: DeviceView) => void;
  activeProfile: ChildProfile;
  user?: any;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onOpenGame?: () => void;
  onOpenAiHub?: () => void;
  onOpenLeaderboard?: () => void;
}

export const HeaderNavigation: React.FC<Props> = ({
  currentRole,
  onSelectRole,
  deviceView,
  onSelectDevice,
  activeProfile,
  user,
  onSignIn,
  onSignOut,
  onOpenGame,
  onOpenAiHub,
  onOpenLeaderboard,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
      {/* Top Banner & Device Switcher Bar */}
      <div className="bg-gradient-to-r from-[#070d24] via-[#0d1b3e] to-[#14234b] text-slate-200 text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-3 border-b border-indigo-950/80">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
          </span>
          <span className="font-semibold text-slate-200 text-[11px] sm:text-xs">
            Ontario Curriculum 2020–2023 System &bull; Active: {activeProfile.name} (Gr {activeProfile.grade})
          </span>
          <span className="hidden md:inline-block font-handwriting text-base text-amber-300 ml-2">
            Little questions. Limitless possibilities.
          </span>
        </div>

        {/* 5-Way Device Simulation Switcher (Desktop, iPad, Tablet, iPhone, Android) */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-indigo-900/50">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider px-1.5 font-bold hidden sm:inline">
            Device:
          </span>
          <button
            type="button"
            onClick={() => onSelectDevice('desktop')}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              deviceView === 'desktop'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop Web (Full Experience)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectDevice('ipad')}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              deviceView === 'ipad'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Apple iPad Pro 12.9 App"
          >
            <Tablet className="w-3.5 h-3.5 text-sky-400" />
            <span>iPad App</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectDevice('tablet')}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              deviceView === 'tablet'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Android Tablet App"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Android Tab</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectDevice('iphone')}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              deviceView === 'iphone'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Apple iPhone 16 Pro App"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectDevice('android')}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              deviceView === 'android'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Google Pixel 9 Android App"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Android</span>
          </button>
        </div>
      </div>

      {/* Main Branding & Role Switcher */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand: Rexy Learn */}
        <div className="flex items-center gap-3">
          <RexyMascot size="sm" className="drop-shadow-sm" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-['Fredoka'] text-indigo-950 tracking-tight">
                REXY <span className="text-sky-500">LEARN</span>
              </span>
              <span className="text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-mono uppercase">
                Ontario
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Real-Time AI Tutor & Adaptive Curriculum
            </p>
          </div>
        </div>

        {/* 3-Way Multi-Role Dashboard Selector (Student, Parent, Admin) */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => onSelectRole('student')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 font-['Fredoka'] ${
              currentRole === 'student'
                ? 'bg-white text-sky-600 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Learning Hub</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectRole('parent')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 font-['Fredoka'] ${
              currentRole === 'parent'
                ? 'bg-white text-rose-600 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-rose-500" />
            <span>Parent Space</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectRole('admin')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 font-['Fredoka'] ${
              currentRole === 'admin'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4 text-slate-700" />
            <span>Support &amp; Admin</span>
          </button>
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2">
          {onOpenLeaderboard && (
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer font-['Fredoka']"
              title="Open Global Learning Leaderboard"
            >
              <Trophy className="w-3.5 h-3.5 fill-amber-950" />
              <span>Leaderboard</span>
            </button>
          )}

          {onOpenGame && (
            <button
              type="button"
              onClick={onOpenGame}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1 cursor-pointer font-['Fredoka']"
              title="Launch 3D Canadarm Rover STEM Game"
            >
              <span>🎮 3D Game</span>
            </button>
          )}

          {onOpenAiHub && (
            <button
              type="button"
              onClick={onOpenAiHub}
              className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1 cursor-pointer font-['Fredoka']"
              title="Open Gemini Multi-Modal Studio"
            >
              <span>🔮 AI Studio</span>
            </button>
          )}

          {/* Active Child Profile */}
          <div className="flex items-center gap-2 bg-sky-50 border border-sky-200/80 px-3 py-1.5 rounded-2xl shrink-0">
            <span className="text-xl">{activeProfile.avatar}</span>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-black text-indigo-950 font-['Fredoka'] leading-none">
                {activeProfile.name}
              </div>
              <span className="text-[10px] text-sky-700 font-bold">
                Grade {activeProfile.grade}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
