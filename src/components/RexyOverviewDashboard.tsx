import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  Flame,
  TrendingUp,
  Mountain,
  CheckCircle2,
  Circle,
  ArrowRight,
  Send,
  Mic,
  MicOff,
  PenTool,
  Camera,
  RotateCcw,
  Lightbulb,
  HelpCircle,
  Award,
  ChevronDown,
  MapPin,
  Bell,
  Settings,
  Star,
  BookOpen,
  Volume2,
  VolumeX,
  X,
  Trophy
} from 'lucide-react';
import { ChildProfile, CurriculumSkill, GradeLevel, SubjectId } from '../types/learning';
import { RexyMascot } from './RexyMascot';

interface Props {
  currentProfile: ChildProfile;
  profiles: ChildProfile[];
  onSelectProfile: (profile: ChildProfile) => void;
  onSelectGrade: (grade: GradeLevel) => void;
  onStartSkill: (skill: CurriculumSkill) => void;
  onNavigateTab: (tab: 'learning' | 'diagnostic' | 'classroom' | 'game' | 'multimodal' | 'achievements' | 'leaderboard') => void;
  skills: CurriculumSkill[];
}

export const RexyOverviewDashboard: React.FC<Props> = ({
  currentProfile,
  profiles,
  onSelectProfile,
  onSelectGrade,
  onStartSkill,
  onNavigateTab,
  skills,
}) => {
  // Voice & Chat State for "Learn with Rexy" panel
  const [messages, setMessages] = useState<Array<{ sender: 'rexy' | 'student'; text: string; time: string }>>([
    {
      sender: 'rexy',
      text: "Let's make 8! You have 5 stars. How many more do you need?",
      time: 'Just now',
    },
    {
      sender: 'student',
      text: 'Is it 3?',
      time: 'Just now',
    },
    {
      sender: 'rexy',
      text: 'Yes! High five, explorer! Show me how you worked it out with the stars.',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Interactive Stars state for the 5 + 3 = 8 manipulative
  const [filledStarsCount, setFilledStarsCount] = useState<number>(5);
  const targetStars = 8;
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Today's journey checklist
  const [journeySteps, setJourneySteps] = useState([
    { id: '1', title: 'Math explorers', duration: '15 min', desc: 'Build with numbers', done: true, icon: 'math' },
    { id: '2', title: 'Break time', duration: '5 min', desc: 'Move, stretch, breathe', done: true, icon: 'break' },
    { id: '3', title: 'Story seekers', duration: '15 min', desc: 'Read and explore', done: false, active: true, icon: 'story' },
    { id: '4', title: 'Break time', duration: '5 min', desc: 'Quick brain break', done: false, icon: 'break' },
    { id: '5', title: 'Wonder lab', duration: '15 min', desc: 'Ask and discover', done: false, icon: 'science' },
    { id: '6', title: 'Wrap up', duration: '5 min', desc: 'Celebrate progress!', done: false, icon: 'celebrate' },
  ]);

  // Text to speech for Rexy
  const speakRexy = (text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.25; // Youthful and friendly voice
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. You can type your answer below!');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-CA';
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsgs = [...messages, { sender: 'student' as const, text, time: 'Just now' }];
    setMessages(newMsgs);
    setInputText('');

    // Fetch AI response from Rexy server endpoint or fallback
    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'We are making 8 from 5 stars. Equation: 5 + 3 = 8',
          studentAnswer: text,
          isCorrect: text.includes('3') || text.toLowerCase().includes('three'),
          skillTitle: 'Addition within 10 with Star Models',
          curriculumCode: 'B2.2',
          studentQuery: text,
          childGrade: currentProfile.grade,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const rexyReply = data.response || "You're doing awesome! Drag the 3 more stars to complete the set of 8.";
        setMessages((prev) => [...prev, { sender: 'rexy', text: rexyReply, time: 'Just now' }]);
        speakRexy(rexyReply);
      } else {
        throw new Error('Fallback to local');
      }
    } catch {
      let fallback = "Super thoughtful! Count with me: 5... then 6, 7, 8! That makes 3 more stars!";
      if (text.includes('3') || text.toLowerCase().includes('three')) {
        fallback = "Exactly right! 5 + 3 = 8. Drag 3 more stars to see the magic glow!";
      }
      setMessages((prev) => [...prev, { sender: 'rexy', text: fallback, time: 'Just now' }]);
      speakRexy(fallback);
    }
  };

  const toggleStar = (index: number) => {
    if (index >= filledStarsCount) {
      setFilledStarsCount(index + 1);
      if (index + 1 === 8) {
        const winMsg = "Woohoo! All 8 stars are shining! 5 + 3 = 8!";
        setMessages((prev) => [...prev, { sender: 'rexy', text: winMsg, time: 'Just now' }]);
        speakRexy(winMsg);
      }
    } else {
      setFilledStarsCount(index);
    }
  };

  // Find relevant skills for subjects
  const mathSkill = skills.find((s) => s.subject === 'math') || skills[0];
  const storySkill = skills.find((s) => s.subject === 'language') || skills[2];
  const scienceSkill = skills.find((s) => s.subject === 'science') || skills[1];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Learning Intelligence Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-extrabold text-slate-800 tracking-tight">
            Learning Intelligence
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Profile / Grade Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                {currentProfile.name[0]}
              </div>
              <span>Grade {currentProfile.grade} explorer</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                  Switch Explorer
                </p>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSelectProfile(p);
                      onSelectGrade(p.grade);
                      setShowProfileMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      p.id === currentProfile.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      Gr {p.grade}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ontario Curriculum Indicator */}
          <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200/80 px-2.5 py-1 rounded-xl text-xs font-extrabold">
            <MapPin className="w-3 h-3 text-rose-500" />
            <span>Ontario</span>
          </div>

          {/* Sample Data Toggle */}
          <button
            type="button"
            onClick={() => {
              setFilledStarsCount(5);
              alert('Sample progress & diagnostic data refreshed for Grade ' + currentProfile.grade);
            }}
            className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
          >
            Sample data
          </button>

          {/* Bell & Settings */}
          <button
            type="button"
            title="Notifications"
            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Settings"
            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Greeting Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ready for your next discovery?
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">
          New questions. New skills. A brighter you.
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Time */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 leading-tight">
              24 <span className="text-xs font-semibold text-slate-400">/ 60 min</span>
            </div>
            <div className="text-[11px] font-medium text-slate-500">Today's learning</div>
          </div>
        </div>

        {/* Metric 2: Adventures */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Mountain className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 leading-tight">3 adventures</div>
            <div className="text-[11px] font-medium text-slate-500">Completed today</div>
          </div>
        </div>

        {/* Metric 3: Streak */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 leading-tight flex items-center gap-1">
              5-day streak
              <span className="text-xs">🔥</span>
            </div>
            <div className="text-[11px] font-medium text-amber-600 flex items-center gap-0.5">
              <span>Keep going!</span>
              <span className="text-[10px]">🔥🔥🔥🔥🔥</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Growing Confidence */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 leading-tight">Growing confidence</div>
            <div className="text-[11px] font-medium text-slate-500">You're making great progress!</div>
          </div>
        </div>
      </div>

      {/* Featured Cosmic Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#3a0ca3] text-white p-6 sm:p-8 shadow-lg border border-indigo-900/50">
        {/* Starry background sparkles */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,white_1px,transparent_1px),radial-gradient(circle_at_80%_40%,white_1px,transparent_1px),radial-gradient(circle_at_40%_80%,white_1.5px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Rexy Mascot with glowing book */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <RexyMascot size="xl" variant="reading" className="drop-shadow-2xl animate-float" />
              <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md font-mono">
                AI TUTOR
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka'] tracking-tight text-white drop-shadow-sm">
                Your curiosity is a superpower.
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm font-medium mt-1 max-w-md">
                Ask. Explore. Make new connections. There's a whole world waiting for you!
              </p>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onStartSkill(mathSkill)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-white text-xs font-black shadow-md hover:shadow-indigo-500/25 transition-all cursor-pointer flex items-center gap-2 group"
                >
                  <span>Start my adventure</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('multimodal')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer"
                >
                  Discovery Lab
                </button>
              </div>
            </div>
          </div>

          {/* Whimsical Calligraphy */}
          <div className="hidden lg:block text-right self-center">
            <div className="font-handwriting text-2xl text-amber-300 rotate-[-4deg] tracking-wide drop-shadow-sm">
              Same Questions.
            </div>
            <div className="font-handwriting text-3xl font-bold text-sky-300 rotate-[-2deg] tracking-wider drop-shadow-sm">
              Brighter Worlds!
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid (Left content + Right "Learn with Rexy" panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Adventures + Today's Journey + Weekly Progress (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Subject Adventures Cards (Math, Story, Wonder Lab) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Math explorers */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">
                    🔢
                  </div>
                  <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                    Math
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
                  Math explorers
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Play with numbers, patterns and big ideas.
                </p>
                <div className="my-3 flex justify-center">
                  <RexyMascot size="md" variant="blocks" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Lesson 4 of 8</span>
                  <span className="text-sky-600">50%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '50%' }}></div>
                </div>
                <button
                  type="button"
                  onClick={() => onStartSkill(mathSkill)}
                  className="w-full py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Practice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2. Story seekers */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                    📖
                  </div>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    Story
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors">
                  Story seekers
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Discover, read and imagine new worlds.
                </p>
                <div className="my-3 flex justify-center">
                  <RexyMascot size="md" variant="reading" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Lesson 3 of 6</span>
                  <span className="text-rose-600">50%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '50%' }}></div>
                </div>
                <button
                  type="button"
                  onClick={() => onStartSkill(storySkill)}
                  className="w-full py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3. Wonder lab */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    🔬
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Science
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Wonder lab
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Explore science and the amazing world around you.
                </p>
                <div className="my-3 flex justify-center">
                  <RexyMascot size="md" variant="science" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Lesson 2 of 6</span>
                  <span className="text-emerald-600">33%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '33%' }}></div>
                </div>
                <button
                  type="button"
                  onClick={() => onStartSkill(scienceSkill)}
                  className="w-full py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Discover</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Today's Journey Timeline & Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">Today's journey</h3>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  2/6 done
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('classroom')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Edit plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {journeySteps.map((step) => (
                <div key={step.id} className="relative flex items-center gap-3 pl-1">
                  {step.done ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 z-10">
                      <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                    </div>
                  ) : step.active ? (
                    <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 border-2 border-sky-500 flex items-center justify-center shrink-0 z-10">
                      <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 z-10">
                      <Circle className="w-3 h-3" />
                    </div>
                  )}

                  <div className="flex-1 flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 px-3 py-2 rounded-xl border border-slate-100 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{step.title}</span>
                        {step.active && (
                          <span className="text-[9px] uppercase tracking-wider bg-sky-100 text-sky-700 px-1.5 py-0.2 rounded font-black">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">{step.desc}</div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 tabular-nums">
                      {step.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid: Weekly Progress & Latest Achievement & Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weekly Progress Bar Chart */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  My weekly progress
                </h4>
                <span className="text-[11px] font-bold text-sky-600">3.8 hrs total</span>
              </div>

              {/* Bar Chart Mon to Sun */}
              <div className="h-28 flex items-end justify-between gap-2 pt-4 px-1">
                {[
                  { day: 'Mon', mins: 25, star: false },
                  { day: 'Tue', mins: 40, star: false },
                  { day: 'Wed', mins: 30, star: false },
                  { day: 'Thu', mins: 50, star: false },
                  { day: 'Fri', mins: 60, star: true },
                  { day: 'Sat', mins: 35, star: false },
                  { day: 'Sun', mins: 20, star: false },
                ].map((item) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    {item.star && (
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mb-0.5 animate-bounce" />
                    )}
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        item.star
                          ? 'bg-gradient-to-t from-sky-500 to-indigo-500 shadow-xs'
                          : 'bg-sky-200 hover:bg-sky-300'
                      }`}
                      style={{ height: `${(item.mins / 65) * 100}%` }}
                      title={`${item.day}: ${item.mins} mins`}
                    ></div>
                    <span className="text-[10px] font-bold text-slate-500">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Achievement + AI Insights */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                  Latest achievement
                </h4>
                <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center text-lg shadow-sm">
                    🌟
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-950">Question Explorer</div>
                    <p className="text-[10px] text-amber-800 mt-0.5">
                      You asked 10 amazing questions this week!
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                  Sample insights
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-[11px]">You're building confidence in addition!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-[11px]">Your reading time is growing steadily.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-[11px]">You ask thoughtful questions. Keep it up!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Learning Leaderboard Preview Widget */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-5 text-white shadow-md border border-indigo-800/60 relative overflow-hidden">
            {/* Shimmer background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center text-lg shadow-inner">
                    🏆
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black font-['Fredoka'] text-white">
                        Global Learning Leaderboard
                      </h4>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-300/30 px-2 py-0.2 rounded-full font-mono">
                        Rank #{currentProfile.id === 'child-2' ? '8' : '4'}
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-200">
                      Celebrating SmartScore mastery &amp; completed assignments across Ontario!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab('leaderboard')}
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-white/20"
                >
                  <span>Full Board</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Top Performers Cards */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* 1st Place */}
                <div className="bg-gradient-to-b from-amber-500/20 to-amber-900/30 border border-amber-400/40 rounded-2xl p-3 text-center space-y-1 relative">
                  <div className="text-xl">🥇</div>
                  <div className="text-xs font-black text-amber-200 font-['Fredoka'] truncate">
                    Aria M.
                  </div>
                  <div className="text-[10px] text-amber-300/80 font-bold">1,240 pts</div>
                  <span className="inline-block text-[9px] bg-amber-400/30 text-amber-200 px-1.5 py-0.2 rounded font-mono">
                    14 x 100s
                  </span>
                </div>

                {/* 2nd Place */}
                <div className="bg-white/10 border border-white/20 rounded-2xl p-3 text-center space-y-1">
                  <div className="text-xl">🥈</div>
                  <div className="text-xs font-black text-slate-200 font-['Fredoka'] truncate">
                    Kai T.
                  </div>
                  <div className="text-[10px] text-slate-300 font-bold">1,190 pts</div>
                  <span className="inline-block text-[9px] bg-white/15 text-slate-200 px-1.5 py-0.2 rounded font-mono">
                    12 x 100s
                  </span>
                </div>

                {/* 3rd Place */}
                <div className="bg-amber-900/20 border border-amber-700/40 rounded-2xl p-3 text-center space-y-1">
                  <div className="text-xl">🥉</div>
                  <div className="text-xs font-black text-amber-200 font-['Fredoka'] truncate">
                    Zoe T.
                  </div>
                  <div className="text-[10px] text-amber-300/80 font-bold">1,145 pts</div>
                  <span className="inline-block text-[9px] bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded font-mono">
                    11 x 100s
                  </span>
                </div>
              </div>

              {/* Student's Rank & Nudge */}
              <div className="bg-sky-500/20 border border-sky-400/30 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{currentProfile.avatar}</span>
                  <div>
                    <div className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>{currentProfile.name} is Rank #{currentProfile.id === 'child-2' ? '8' : '4'}</span>
                      <span className="text-[9px] uppercase bg-sky-400 text-sky-950 font-black px-1.5 py-0.2 rounded">
                        You
                      </span>
                    </div>
                    <p className="text-[10px] text-sky-200">
                      Only 25 SmartScore points away from overtaking Rank 3! 🚀
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab('leaderboard')}
                  className="px-3 py-1.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-sky-950 font-black text-xs transition-colors shadow-xs font-['Fredoka'] cursor-pointer"
                >
                  Cheer &amp; Compete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: "Learn with Rexy" Live Interactive AI Panel (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-5 flex flex-col h-full sticky top-20">
            {/* Header of Learn with Rexy */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <RexyMascot size="sm" mood={isSpeaking ? 'speaking' : 'happy'} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-slate-900 font-['Fredoka']">
                      Learn with Rexy
                    </h3>
                    <span className="text-[9px] font-black uppercase bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-mono">
                      Beta
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Ready to explore</span>
                  </div>
                </div>
              </div>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  soundEnabled ? 'text-sky-600 bg-sky-50' : 'text-slate-400 bg-slate-50'
                }`}
                title={soundEnabled ? 'Mute Rexy Voice' : 'Enable Rexy Voice'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Chat History */}
            <div className="space-y-3 py-3 overflow-y-auto max-h-56 pr-1">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 ${m.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'rexy' && (
                    <RexyMascot size="xs" className="mt-0.5" />
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-medium leading-relaxed ${
                      m.sender === 'student'
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-sky-50 text-slate-800 rounded-bl-xs border border-sky-100'
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.sender === 'student' && (
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      {currentProfile.name[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Interactive Manipulative Star Workspace (from Mockup!) */}
            <div className="bg-gradient-to-b from-sky-50/70 to-white rounded-2xl border border-sky-100 p-4 my-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 mb-2">
                <span>Drag or tap the stars to show:</span>
                <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg text-xs font-black">
                  5 + 3 = 8
                </span>
              </div>

              {/* Star Manipulative Row */}
              <div className="flex items-center justify-center gap-2 py-3 bg-white rounded-xl border border-sky-100 shadow-inner">
                {Array.from({ length: targetStars }).map((_, i) => {
                  const isFilled = i < filledStarsCount;
                  const isFirstFive = i < 5;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleStar(i)}
                      className="group cursor-pointer transition-transform hover:scale-125 focus:outline-hidden"
                      title={isFilled ? `Star ${i + 1} (Filled)` : `Click to add star ${i + 1}`}
                    >
                      <Star
                        className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                          isFilled
                            ? isFirstFive
                              ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                              : 'text-sky-500 fill-sky-400 drop-shadow-xs animate-bounce'
                            : 'text-slate-300 hover:text-amber-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons: Hint, Draw, Explain */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    const h = 'Start from 5 in your mind, then count up: 6, 7, 8! That is 3 steps!';
                    setHintMessage(h);
                    speakRexy(h);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Give me a hint</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCanvas(!showCanvas)}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <PenTool className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Draw it</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const exp = 'Think of 8 as two friendly parts: 5 on the left hand, and 3 on the right hand!';
                    setHintMessage(exp);
                    speakRexy(exp);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                  <span>Explain another way</span>
                </button>
              </div>

              {hintMessage && (
                <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] font-semibold text-amber-900 flex items-start justify-between gap-2">
                  <span>{hintMessage}</span>
                  <button onClick={() => setHintMessage(null)}>
                    <X className="w-3.5 h-3.5 text-amber-700" />
                  </button>
                </div>
              )}
            </div>

            {/* Optional Sketch Drawer */}
            {showCanvas && (
              <div className="mb-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>Scratchpad: Sketch your math thinking</span>
                  <button onClick={() => setShowCanvas(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="w-full h-24 bg-white rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
                  ✏️ Draw on this canvas to show your steps!
                </div>
              </div>
            )}

            {/* Audio Waveform & Speech Input Visualizer */}
            <div className="mt-auto pt-2">
              <div className="flex items-center justify-center gap-1 h-5 mb-2">
                {[12, 24, 16, 32, 20, 28, 14, 22, 10, 18].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all ${
                      isSpeaking || isListening ? 'bg-sky-500 animate-pulse' : 'bg-slate-200'
                    }`}
                    style={{ height: isSpeaking || isListening ? `${h}px` : '4px' }}
                  ></div>
                ))}
              </div>

              {/* Input Form with Mic, Sketch, Camera, Send */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-sky-400 focus-within:bg-white transition-all"
              >
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-white text-sky-600 hover:bg-sky-50 border border-slate-200 shadow-xs'
                  }`}
                  title={isListening ? 'Stop listening' : 'Speak to Rexy'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setShowCanvas(true)}
                  className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white flex items-center justify-center transition-colors"
                  title="Draw / sketch"
                >
                  <PenTool className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => alert('Camera vision activated: Show Rexy your notebook or worksheet!')}
                  className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white flex items-center justify-center transition-colors"
                  title="Take photo of homework"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask, speak, or sketch..."
                  className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden px-1"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-8 h-8 rounded-xl bg-indigo-600 disabled:opacity-40 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
