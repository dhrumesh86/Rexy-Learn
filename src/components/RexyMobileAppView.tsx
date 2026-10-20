import React, { useState } from 'react';
import {
  Bell,
  Star,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Home,
  BookOpen,
  Compass,
  Award,
  MoreHorizontal,
  ArrowLeft,
  Lightbulb,
  PenTool,
  Mic,
  MicOff,
  Camera,
  Keyboard,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ChildProfile, CurriculumSkill, GradeLevel } from '../types/learning';
import { RexyMascot } from './RexyMascot';

interface Props {
  currentProfile: ChildProfile;
  skills: CurriculumSkill[];
  onStartSkill: (skill: CurriculumSkill) => void;
  onOpenDiscover: () => void;
  onOpenAchievements: () => void;
  onOpenClassroom: () => void;
  onOpenParent: () => void;
  onOpenDiagnostic: () => void;
}

export const RexyMobileAppView: React.FC<Props> = ({
  currentProfile,
  skills,
  onStartSkill,
  onOpenDiscover,
  onOpenAchievements,
  onOpenClassroom,
  onOpenParent,
  onOpenDiagnostic,
}) => {
  // Mobile sub-mode: 'home' vs 'live'
  const [mobileMode, setMobileMode] = useState<'home' | 'live'>('home');
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'discover' | 'achievements' | 'more'>('home');

  // Live Mode Interactive State
  const [filledStars, setFilledStars] = useState(5);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hint, setHint] = useState<string | null>(null);

  const [liveMessages, setLiveMessages] = useState([
    { sender: 'rexy', text: "Let's make 8! You have 5 stars. How many more do you need?" },
    { sender: 'student', text: "Is it 3?" },
    { sender: 'rexy', text: "Yes! Show me how you worked it out." },
  ]);

  const speak = (text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.pitch = 1.25;
    setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const handleVoiceTap = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      const nextMsg = "High five! 5 + 3 = 8. Tap the stars to light them up!";
      setLiveMessages((prev) => [...prev, { sender: 'rexy', text: nextMsg }]);
      speak(nextMsg);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRec();
      rec.lang = 'en-CA';
      rec.onstart = () => setIsListening(true);
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setLiveMessages((prev) => [...prev, { sender: 'student', text }]);
        setIsListening(false);
        const reply = `I heard you say "${text}"! You are doing amazing. Let's finish the 8 stars together!`;
        setLiveMessages((prev) => [...prev, { sender: 'rexy', text: reply }]);
        speak(reply);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const mathSkill = skills.find((s) => s.subject === 'math') || skills[0];
  const storySkill = skills.find((s) => s.subject === 'language') || skills[2];
  const scienceSkill = skills.find((s) => s.subject === 'science') || skills[1];

  // REXY LIVE MODE SCREEN (Far Right Phone in mockup)
  if (mobileMode === 'live') {
    return (
      <div className="flex flex-col min-h-full bg-gradient-to-b from-sky-50 via-white to-sky-50 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
        {/* Rexy Live Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white/90 backdrop-blur-sm sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setMobileMode('home')}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h2 className="text-sm font-black text-slate-900 font-['Fredoka']">Rexy Live</h2>
            <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Voice AI Active</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Live Stage with Rexy Avatar */}
        <div className="p-4 flex flex-col items-center flex-1">
          <div className="relative my-2">
            <RexyMascot size="xl" mood={isSpeaking ? 'speaking' : 'happy'} className="animate-float" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
              {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Listening to you'}
            </div>
          </div>

          {/* Conversation Bubbles */}
          <div className="w-full space-y-2.5 my-3">
            {liveMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs font-semibold leading-relaxed ${
                    msg.sender === 'student'
                      ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-sky-100 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Math Manipulative Star Equation Card */}
          <div className="w-full bg-white rounded-2xl border border-sky-100 p-4 shadow-sm my-2 text-center">
            <div className="text-base font-black text-slate-900 font-mono tracking-wider mb-2">
              5 + 3 = 8
            </div>

            {/* Stars Row */}
            <div className="flex items-center justify-center gap-2 py-2">
              {Array.from({ length: 8 }).map((_, i) => {
                const filled = i < filledStars;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setFilledStars(i + 1);
                      if (i + 1 === 8) {
                        speak('Hooray! 8 stars completed! You are brilliant!');
                      }
                    }}
                    className="cursor-pointer transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        filled
                          ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Quick Action buttons */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => {
                  const h = 'Start from 5, then count 3 more: 6, 7, 8!';
                  setHint(h);
                  speak(h);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center gap-1"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Hint</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Drawing canvas opened! Sketch your math solution.')}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center gap-1"
              >
                <PenTool className="w-3.5 h-3.5 text-indigo-500" />
                <span>Draw</span>
              </button>
            </div>

            {hint && (
              <p className="mt-2 text-[11px] font-semibold text-amber-800 bg-amber-50 p-2 rounded-xl">
                {hint}
              </p>
            )}
          </div>

          {/* Voice Orb Controls (from Mockup) */}
          <div className="w-full mt-auto pt-3 pb-2 flex flex-col items-center gap-2">
            <div className="flex items-center justify-between w-full px-6">
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-xs"
              >
                <Keyboard className="w-4 h-4" />
              </button>

              {/* Large Pulsing Voice Button */}
              <button
                type="button"
                onClick={handleVoiceTap}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
                  isListening
                    ? 'bg-rose-500 animate-ping ring-8 ring-rose-200'
                    : 'bg-gradient-to-tr from-sky-500 via-indigo-600 to-sky-400 ring-4 ring-sky-200'
                }`}
              >
                {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>

              <button
                type="button"
                onClick={() => alert('Show homework to Rexy with camera')}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-xs"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[11px] font-medium text-slate-400">Ask, speak, or sketch...</span>
          </div>
        </div>
      </div>
    );
  }

  // PHONE HOME SCREEN (Center-Right Phone in mockup)
  return (
    <div className="flex flex-col min-h-full bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      {/* Top Bar: REXY LEARN + Bell */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <RexyMascot size="xs" />
          <span className="text-base font-black text-indigo-950 font-['Fredoka'] tracking-tight">
            REXY <span className="text-sky-500">LEARN</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMode('live')}
            className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-black flex items-center gap-1 animate-pulse"
          >
            <Sparkles className="w-3 h-3 text-sky-600" />
            <span>Rexy Live</span>
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-200"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-4 space-y-4 flex-1 pb-20">
        {/* Welcome Greeting */}
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Hi {currentProfile.name}!
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Ready for a new adventure today?
          </p>
        </div>

        {/* Mascot Card with Callout Bubble */}
        <div className="relative overflow-hidden bg-gradient-to-tr from-sky-400 via-sky-300 to-indigo-200 rounded-3xl p-4 shadow-sm flex items-center justify-between">
          <RexyMascot size="lg" className="drop-shadow-md" />
          <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xs border border-white/60 max-w-[55%]">
            <p className="font-handwriting text-base font-bold text-indigo-900 leading-tight">
              Little questions.
              <br />
              Big possibilities!
            </p>
          </div>
        </div>

        {/* Today's Learning Progress Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500">Today's learning</div>
              <div className="text-sm font-black text-slate-900">
                24 <span className="text-xs text-slate-400 font-medium">/ 60 min</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Today's Adventure Section */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Today's adventure
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab('learn')}
              className="text-[11px] font-bold text-sky-600 hover:text-sky-800"
            >
              See all &gt;
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Card 1: Math explorers */}
            <div
              onClick={() => onStartSkill(mathSkill)}
              className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs hover:border-sky-300 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-base">
                  🔢
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                    Math explorers
                  </h4>
                  <p className="text-[11px] text-slate-500">Build with numbers</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RexyMascot size="xs" variant="blocks" />
                <div className="w-7 h-7 rounded-xl bg-slate-50 group-hover:bg-sky-50 text-slate-400 group-hover:text-sky-600 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Card 2: Story seekers */}
            <div
              onClick={() => onStartSkill(storySkill)}
              className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs hover:border-rose-300 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 font-bold text-base">
                  📖
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                    Story seekers
                  </h4>
                  <p className="text-[11px] text-slate-500">Read and imagine</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RexyMascot size="xs" variant="reading" />
                <div className="w-7 h-7 rounded-xl bg-slate-50 group-hover:bg-rose-50 text-slate-400 group-hover:text-rose-600 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Card 3: Wonder lab */}
            <div
              onClick={() => onStartSkill(scienceSkill)}
              className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs hover:border-emerald-300 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-base">
                  🔬
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Wonder lab
                  </h4>
                  <p className="text-[11px] text-slate-500">Ask and discover</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RexyMascot size="xs" variant="science" />
                <div className="w-7 h-7 rounded-xl bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launch into Rexy Live Button */}
        <button
          type="button"
          onClick={() => setMobileMode('live')}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Start Real-Time Voice Session with Rexy</span>
        </button>
      </div>

      {/* Native App Bottom Tab Bar (Home, Learn, Discover, Achievements, More) */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 flex items-center justify-around z-40">
        <button
          type="button"
          onClick={() => {
            setActiveTab('home');
            setMobileMode('home');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'home' ? 'text-sky-600' : 'text-slate-400'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('learn');
            onStartSkill(mathSkill);
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'learn' ? 'text-sky-600' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Learn</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('discover');
            onOpenDiscover();
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'discover' ? 'text-sky-600' : 'text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Discover</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('achievements');
            onOpenAchievements();
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'achievements' ? 'text-sky-600' : 'text-slate-400'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Badges</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('more');
            onOpenParent();
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === 'more' ? 'text-sky-600' : 'text-slate-400'
          }`}
        >
          <MoreHorizontal className="w-4 h-4" />
          <span>More</span>
        </button>
      </div>
    </div>
  );
};
