import React from 'react';
import {
  Home,
  BookOpen,
  Compass,
  Award,
  Users,
  Shield,
  Calendar,
  Sparkles,
  Gamepad2,
  Mic,
  FileText,
  FlaskConical,
  Trees,
  Trophy
} from 'lucide-react';
import { RexyMascot } from './RexyMascot';

export type SidebarTab =
  | 'overview'
  | 'learning-path'
  | 'rexy-live'
  | 'story-studio'
  | 'discovery-lab'
  | 'leaderboard'
  | 'achievements'
  | 'classroom'
  | 'parent-space'
  | 'admin-monitor';

interface Props {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  badgeCounts?: {
    achievements?: number;
    assignments?: number;
  };
}

export const RexySidebar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  badgeCounts = { achievements: 8, assignments: 3 },
}) => {
  const navItems = [
    {
      id: 'overview' as SidebarTab,
      label: 'Overview',
      icon: Home,
      desc: 'Daily hub & live tutor',
    },
    {
      id: 'learning-path' as SidebarTab,
      label: 'Learning path',
      icon: Trees,
      desc: 'Fantasy island adventure',
    },
    {
      id: 'rexy-live' as SidebarTab,
      label: 'Rexy Live',
      icon: Mic,
      desc: 'Socratic voice & whiteboard',
      highlight: true,
    },
    {
      id: 'story-studio' as SidebarTab,
      label: 'Story Studio',
      icon: BookOpen,
      desc: 'Read, create & vocab',
    },
    {
      id: 'discovery-lab' as SidebarTab,
      label: 'Discovery lab',
      icon: FlaskConical,
      desc: 'Plant lab, 3D & AI studio',
    },
    {
      id: 'leaderboard' as SidebarTab,
      label: 'Global Leaderboard',
      icon: Trophy,
      desc: 'SmartScore & Assignments',
      badge: 'Rank #4',
      highlight: true,
    },
    {
      id: 'achievements' as SidebarTab,
      label: 'My achievements',
      icon: Award,
      desc: 'Stickers & badges',
      badge: badgeCounts.achievements,
    },
    {
      id: 'classroom' as SidebarTab,
      label: 'Classroom & Schedule',
      icon: Calendar,
      desc: 'Homework & timetable',
      badge: badgeCounts.assignments,
    },
    {
      id: 'parent-space' as SidebarTab,
      label: 'Parent space',
      icon: Users,
      desc: 'Insights & weekly rhythm',
    },
    {
      id: 'admin-monitor' as SidebarTab,
      label: 'Support & Admin',
      icon: Shield,
      desc: 'Multi-org & systems status',
    },
  ];

  return (
    <aside className="w-64 bg-white/95 backdrop-blur-md border-r border-slate-200/90 flex flex-col shrink-0 min-h-[calc(100vh-65px)] p-4 justify-between">
      {/* Top Branding Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 px-2">
          <RexyMascot size="sm" className="drop-shadow-xs" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black font-['Fredoka'] text-indigo-950 tracking-tight">
                REXY <span className="text-sky-500">LEARN</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">
              Ontario Curriculum AI
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer group ${
                  isSelected
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isSelected ? 'text-white' : item.highlight ? 'text-sky-500' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Scenic Card */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky-400 via-indigo-600 to-indigo-900 p-3.5 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <RexyMascot size="xs" variant="default" className="drop-shadow-xs" />
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-200 font-mono">
              Rexy Explorer
            </span>
          </div>

          <p className="font-handwriting text-sm font-bold text-amber-200 leading-tight">
            "A kinder, brighter future for every curious mind."
          </p>

          <div className="mt-2.5 pt-1.5 border-t border-white/15 text-[9px] font-black uppercase tracking-widest text-sky-200/90 text-center font-mono">
            BIG CURIOSITY &bull; BRIGHTER TOMORROWS
          </div>
        </div>
      </div>
    </aside>
  );
};
