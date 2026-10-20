/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ReleaseNotice } from './components/ReleaseNotice';
import { PortalRole, DeviceView, GradeLevel, SubjectId, CurriculumSkill, ChildProfile } from './types/learning';
import { StreakData } from './types/classroom';
import { ONTARIO_SKILLS, INITIAL_CHILD_PROFILES } from './data/ontarioCurriculum';
import {
  INITIAL_STREAK_MAYA,
  INITIAL_STREAK_LIAM,
  GOOGLE_CLASSROOM_COURSES,
  INITIAL_ASSIGNMENTS_MAYA,
  INITIAL_SCHEDULE_MAYA
} from './data/classroomData';
import { auth, signInWithGoogle, logOut } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

import { HeaderNavigation } from './components/HeaderNavigation';
import { RexySidebar, SidebarTab } from './components/RexySidebar';
import { RexyOverviewDashboard } from './components/RexyOverviewDashboard';
import { RexyMobileAppView } from './components/RexyMobileAppView';
import { RexyLearningPath } from './components/RexyLearningPath';
import { RexyLiveTutorWhiteboard } from './components/RexyLiveTutorWhiteboard';
import { RexyStoryStudio } from './components/RexyStoryStudio';
import { RexyDiscoveryLabSimulation } from './components/RexyDiscoveryLabSimulation';
import { RexyParentInsightsWeeklyRhythm } from './components/RexyParentInsightsWeeklyRhythm';
import { RexyMultiOrgSupportWorkspace } from './components/RexyMultiOrgSupportWorkspace';
import { GlobalLearningLeaderboard } from './components/GlobalLearningLeaderboard';

import { CurriculumMap } from './components/CurriculumMap';
import { PracticeArena } from './components/PracticeArena';
import { DiagnosticArena } from './components/DiagnosticArena';
import { ClassroomScheduleHub } from './components/ClassroomScheduleHub';
import { AdminPortal } from './components/AdminPortal';
import { ThreeDGame } from './components/ThreeDGame';
import { MultimodalHub } from './components/MultimodalHub';
import { DeviceFrame } from './components/DeviceFrame';
import { StudentAwardsModal } from './components/StudentAwardsModal';

import {
  Award,
  Compass,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowLeft,
  Gamepad2,
  Cpu,
  Layers,
  FlaskConical,
  Trees,
  Mic
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<PortalRole>('student');
  const [deviceView, setDeviceView] = useState<DeviceView>(() => window.matchMedia('(max-width: 640px)').matches ? 'iphone' : 'desktop');
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('overview');
  const [activeSkill, setActiveSkill] = useState<CurriculumSkill | null>(null);

  const [profiles, setProfiles] = useState<ChildProfile[]>(INITIAL_CHILD_PROFILES);
  const [currentProfile, setCurrentProfile] = useState<ChildProfile>(INITIAL_CHILD_PROFILES[0]);
  const [skills, setSkills] = useState<CurriculumSkill[]>(ONTARIO_SKILLS);
  const [streakData, setStreakData] = useState<StreakData>(INITIAL_STREAK_MAYA);

  const [activeGrade, setActiveGrade] = useState<GradeLevel>(currentProfile.grade);
  const [activeSubject, setActiveSubject] = useState<SubjectId>('math');
  const [showAwardsModal, setShowAwardsModal] = useState(false);

  // Discovery Lab View Mode: 'simulation' | '3d-game' | 'multimodal-ai'
  const [discoveryView, setDiscoveryView] = useState<'simulation' | '3d-game' | 'multimodal-ai'>('simulation');

  // Support / Admin View Mode: 'multi-org' | 'telemetry'
  const [adminViewMode, setAdminViewMode] = useState<'multi-org' | 'telemetry'>('multi-org');

  // Firebase User
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setFirebaseUser(u);
    });
    return () => unsubscribe();
  }, []);

  // When switching child profile, align active grade and streak
  const handleSelectProfile = (profile: ChildProfile) => {
    setCurrentProfile(profile);
    setActiveGrade(profile.grade);
    setStreakData(profile.id === 'child-2' ? INITIAL_STREAK_LIAM : INITIAL_STREAK_MAYA);
  };

  // Handle skill mastery update
  const handleSkillMastered = (skillId: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === skillId ? { ...s, smartScore: 100, isMastered: true } : s))
    );
    setCurrentProfile((prev) => ({
      ...prev,
      masteredSkillsCount: prev.masteredSkillsCount + 1,
      totalQuestions: prev.totalQuestions + 1,
    }));
  };

  // Sync role with navigation
  const handleSelectRole = (role: PortalRole) => {
    setCurrentRole(role);
    setActiveSkill(null);
    if (role === 'parent') {
      setSidebarTab('parent-space');
    } else if (role === 'admin') {
      setSidebarTab('admin-monitor');
    } else {
      setSidebarTab('overview');
    }
  };

  const handleSelectSidebarTab = (tab: SidebarTab) => {
    setSidebarTab(tab);
    setActiveSkill(null);
    if (tab === 'parent-space') {
      setCurrentRole('parent');
    } else if (tab === 'admin-monitor') {
      setCurrentRole('admin');
    } else if (tab === 'achievements') {
      setShowAwardsModal(true);
    } else {
      setCurrentRole('student');
    }
  };

  // RENDER MAIN APPLICATION CONTENT (DESKTOP & TABLETS)
  const renderMainContent = () => {
    // 1. Practicing an active skill
    if (activeSkill) {
      return (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <PracticeArena
            skill={activeSkill}
            childName={currentProfile.name}
            onBack={() => setActiveSkill(null)}
            onSkillMastered={handleSkillMastered}
          />
        </div>
      );
    }

    // 2. Learning Path (Fantasy Islands: Number Island, Story Forest, Wonder Valley)
    if (sidebarTab === 'learning-path') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <RexyLearningPath
            currentProfile={currentProfile}
            skills={skills}
            onStartSkill={(skill) => setActiveSkill(skill)}
            onOpenStoryStudio={() => setSidebarTab('story-studio')}
            onOpenDiscoveryLab={() => setSidebarTab('discovery-lab')}
          />
        </div>
      );
    }

    // 3. Rexy Live (Socratic Tutoring & Interactive Whiteboard)
    if (sidebarTab === 'rexy-live') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <RexyLiveTutorWhiteboard
            childName={currentProfile.name}
            grade={`Grade ${currentProfile.grade}`}
            onBack={() => setSidebarTab('overview')}
          />
        </div>
      );
    }

    // 4. Story Studio ("The Seed That Wouldn't Give Up", Vocabulary Popover, Story Creator)
    if (sidebarTab === 'story-studio') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <RexyStoryStudio
            childName={currentProfile.name}
            grade={`Grade ${currentProfile.grade}`}
            onBack={() => setSidebarTab('overview')}
          />
        </div>
      );
    }

    // 5. Discovery Lab (Botanical plant simulation with Sunlight/Water sliders, 3D Rover, Gemini Studio)
    if (sidebarTab === 'discovery-lab') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
          {/* Subview Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-black text-slate-800 font-['Fredoka']">
                Discovery Lab Mode:
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setDiscoveryView('simulation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  discoveryView === 'simulation'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌱 Plant Botanical Simulation
              </button>
              <button
                type="button"
                onClick={() => setDiscoveryView('3d-game')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  discoveryView === '3d-game'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎮 3D Canadarm Rover
              </button>
              <button
                type="button"
                onClick={() => setDiscoveryView('multimodal-ai')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  discoveryView === 'multimodal-ai'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔮 Gemini AI Studio
              </button>
            </div>
          </div>

          {discoveryView === 'simulation' ? (
            <RexyDiscoveryLabSimulation
              childName={currentProfile.name}
              grade={`Grade ${currentProfile.grade}`}
              onBack={() => setSidebarTab('overview')}
            />
          ) : discoveryView === '3d-game' ? (
            <ThreeDGame onBack={() => setDiscoveryView('simulation')} childName={currentProfile.name} />
          ) : (
            <MultimodalHub childName={currentProfile.name} grade={currentProfile.grade} />
          )}
        </div>
      );
    }

    // 6. Parent Space (Parent Insights & Weekly Rhythm)
    if (sidebarTab === 'parent-space' || currentRole === 'parent') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <RexyParentInsightsWeeklyRhythm
            currentProfile={currentProfile}
            profiles={profiles}
            onSelectProfile={handleSelectProfile}
          />
        </div>
      );
    }

    // 7. Support & Admin Monitor (Multi-Org Support Workspace & Systems Telemetry)
    if (sidebarTab === 'admin-monitor' || currentRole === 'admin') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛠️</span>
              <span className="text-sm font-black text-slate-800 font-['Fredoka']">
                Support &amp; Admin Workspace:
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAdminViewMode('multi-org')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  adminViewMode === 'multi-org'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏢 Multi-Org Support Intelligence
              </button>
              <button
                type="button"
                onClick={() => setAdminViewMode('telemetry')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  adminViewMode === 'telemetry'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📊 Platform Telemetry &amp; Logs
              </button>
            </div>
          </div>

          {adminViewMode === 'multi-org' ? (
            <RexyMultiOrgSupportWorkspace />
          ) : (
            <AdminPortal />
          )}
        </div>
      );
    }

    // 8. Classroom & Schedule Hub
    if (sidebarTab === 'classroom') {
      return (
        <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-['Fredoka']">
                Google Classroom &amp; Daily Schedule
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Assignments, Homework Tracker, Timetable &amp; Extracurricular Sync
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarTab('overview')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
            >
              Back to Overview
            </button>
          </div>

          <ClassroomScheduleHub
            childName={currentProfile.name}
            grade={currentProfile.grade}
            courses={GOOGLE_CLASSROOM_COURSES}
            initialAssignments={INITIAL_ASSIGNMENTS_MAYA}
            initialSchedule={INITIAL_SCHEDULE_MAYA}
            onOpenPracticeWithSkill={(skillCode) => {
              const matched = skills.find((s) => s.curriculumCode === skillCode || s.id === skillCode);
              if (matched) setActiveSkill(matched);
              else setSidebarTab('learning-path');
            }}
          />
        </div>
      );
    }

    // 9. Default: Rexy Overview Dashboard (The main daily dashboard from mockup 1)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <RexyOverviewDashboard
          currentProfile={currentProfile}
          profiles={profiles}
          onSelectProfile={handleSelectProfile}
          onSelectGrade={setActiveGrade}
          onStartSkill={(skill) => setActiveSkill(skill)}
          onNavigateTab={(tab) => {
            if (tab === 'learning') setSidebarTab('learning-path');
            else if (tab === 'diagnostic') setActiveSkill(skills[0]);
            else if (tab === 'classroom') setSidebarTab('classroom');
            else if (tab === 'game') {
              setSidebarTab('discovery-lab');
              setDiscoveryView('3d-game');
            } else if (tab === 'multimodal') {
              setSidebarTab('discovery-lab');
              setDiscoveryView('multimodal-ai');
            } else if (tab === 'achievements') {
              setShowAwardsModal(true);
            }
          }}
          skills={skills}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f6fc] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      <ReleaseNotice />
      {/* Top Header & Simulation Controls */}
      <HeaderNavigation
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        deviceView={deviceView}
        onSelectDevice={setDeviceView}
        activeProfile={currentProfile}
        user={firebaseUser}
        onSignIn={signInWithGoogle}
        onSignOut={logOut}
        onOpenGame={() => {
          setSidebarTab('discovery-lab');
          setDiscoveryView('3d-game');
          setCurrentRole('student');
          setActiveSkill(null);
        }}
        onOpenAiHub={() => {
          setSidebarTab('discovery-lab');
          setDiscoveryView('multimodal-ai');
          setCurrentRole('student');
          setActiveSkill(null);
        }}
      />

      {/* Conditional Rendering by Device View */}
      {deviceView === 'iphone' || deviceView === 'android' ? (
        /* Mobile Phone Experience (iPhone & Android) */
        <DeviceFrame
          deviceView={deviceView}
          onSwitchToDesktop={() => setDeviceView('desktop')}
        >
          {activeSkill ? (
            <div className="p-3">
              <PracticeArena
                skill={activeSkill}
                childName={currentProfile.name}
                onBack={() => setActiveSkill(null)}
                onSkillMastered={handleSkillMastered}
              />
            </div>
          ) : (
            <RexyMobileAppView
              currentProfile={currentProfile}
              skills={skills}
              onStartSkill={(skill) => setActiveSkill(skill)}
              onOpenDiscover={() => {
                setSidebarTab('discovery-lab');
                setDeviceView('desktop');
              }}
              onOpenAchievements={() => setShowAwardsModal(true)}
              onOpenClassroom={() => {
                setSidebarTab('classroom');
                setDeviceView('desktop');
              }}
              onOpenParent={() => {
                setSidebarTab('parent-space');
                setDeviceView('desktop');
              }}
              onOpenDiagnostic={() => {
                setActiveSkill(skills[0]);
              }}
            />
          )}
        </DeviceFrame>
      ) : deviceView === 'ipad' || deviceView === 'tablet' ? (
        /* Tablet & iPad Pro Experience (Landscape Ergonomics with Touch Sidebar) */
        <DeviceFrame
          deviceView={deviceView}
          onSwitchToDesktop={() => setDeviceView('desktop')}
        >
          <div className="flex h-full">
            <RexySidebar
              activeTab={sidebarTab}
              onSelectTab={handleSelectSidebarTab}
              badgeCounts={{
                achievements: currentProfile.stickersEarned.length,
                assignments: 3,
              }}
            />
            <div className="flex-1 min-w-0 overflow-y-auto">
              {renderMainContent()}
            </div>
          </div>
        </DeviceFrame>
      ) : (
        /* Full Desktop Web Experience */
        <div className="flex">
          <RexySidebar
            activeTab={sidebarTab}
            onSelectTab={handleSelectSidebarTab}
            badgeCounts={{
              achievements: currentProfile.stickersEarned.length,
              assignments: 3,
            }}
          />

          <main className="flex-1 min-w-0 overflow-y-auto">
            {renderMainContent()}
          </main>
        </div>
      )}

      {/* Awards & Stickers Modal */}
      <StudentAwardsModal
        profile={currentProfile}
        isOpen={showAwardsModal}
        onClose={() => setShowAwardsModal(false)}
      />
    </div>
  );
}
