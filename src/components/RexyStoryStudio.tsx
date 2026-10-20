import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  PenTool,
  Mic,
  MicOff,
  Star,
  CheckCircle2,
  Bookmark,
  Share2
} from 'lucide-react';
import { RexyMascot } from './RexyMascot';

interface Props {
  childName?: string;
  grade?: string;
  onBack?: () => void;
}

export const RexyStoryStudio: React.FC<Props> = ({
  childName = 'Young Explorer',
  grade = 'Grade 2',
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'read' | 'tell' | 'words'>('read');
  const [currentPage, setCurrentPage] = useState<number>(3);
  const totalPages = 8;

  // Selected vocabulary popup state
  const [showVocab, setShowVocab] = useState<boolean>(true);
  const [activeVocabWord, setActiveVocabWord] = useState({
    word: 'sprout',
    phonetic: '/spraʊt/',
    def: 'a young plant that begins to grow out of a seed',
  });

  // Comprehension question state
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(0);
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [userExplanation, setUserExplanation] = useState<string>('');
  const [rexyComment, setRexyComment] = useState<string | null>(null);

  // Creative "Create your own version" state
  const [chosenCharacter, setChosenCharacter] = useState<'fox' | 'bunny' | 'dragon'>('dragon');
  const [isRecordingEnding, setIsRecordingEnding] = useState<boolean>(false);
  const [recordedEndingText, setRecordedEndingText] = useState<string | null>(null);

  const speakText = (text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.95;
    utt.pitch = 1.15;
    setIsReadingAloud(true);
    utt.onend = () => setIsReadingAloud(false);
    utt.onerror = () => setIsReadingAloud(false);
    window.speechSynthesis.speak(utt);
  };

  const handlePredict = (index: number) => {
    setSelectedPrediction(index);
    const answers = [
      "I love that prediction! With enough sunshine and water, that sprout will reach for the sky!",
      "A gentle robin or chickadee stopping by to say hello! How friendly!",
      "Spring rain showers bring the best nourishment for roots to spread deep!",
    ];
    setRexyComment(answers[index]);
    speakText(answers[index]);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 font-['Fredoka']">
                Story Studio
              </h1>
              <span className="text-[10px] uppercase font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-mono">
                Language Arts &bull; {grade}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Read, create, and bring ideas to life &bull; Interactive vocabulary and audio read-along
            </p>
          </div>
        </div>

        {/* Sub-Tabs: Read with Rexy, Tell my story, New words */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('read')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'read'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📖</span>
            <span>Read with Rexy</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tell')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'tell'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>✍️</span>
            <span>Tell my story</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('words')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'words'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>✨</span>
            <span>New words</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Story Book Reader (Left 8 cols) + Comprehension & Creative Deck (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Story Book Reader Canvas (Left 8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-5 relative">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-2xl font-black text-slate-900 font-['Fredoka'] tracking-tight">
              The Seed That Wouldn't Give Up
            </h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Bookmark className="w-4 h-4 text-rose-500" />
              <span>Chapter 1: The Secret Soil</span>
            </div>
          </div>

          {/* Illustrated Scene Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-amber-100 via-emerald-100 to-sky-100 p-6 min-h-[260px] flex items-center justify-between border border-amber-200/60 shadow-inner">
            <div className="space-y-2 z-10 max-w-sm">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/80 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                Garden Discovery
              </span>
              <p className="text-sm font-semibold text-emerald-950 leading-relaxed">
                Lily and Rexy crouched close to the rich brown earth. "Do you think it's awake yet, Rexy?" whispered Lily.
              </p>
            </div>

            {/* Rexy Mascot in garden */}
            <div className="relative z-10">
              <RexyMascot size="2xl" variant="science" className="animate-float drop-shadow-lg" />
            </div>

            {/* Interactive Vocabulary Definition Popover */}
            {showVocab && (
              <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-emerald-200 max-w-xs animate-scaleUp">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black text-emerald-900 font-mono">
                      {activeVocabWord.word}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {activeVocabWord.phonetic}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakText(activeVocabWord.word)}
                    className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center hover:bg-emerald-200"
                    title="Pronounce word"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  {activeVocabWord.def}
                </p>
              </div>
            )}
          </div>

          {/* Story Text Box with Clickable Vocabulary Words */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 text-base sm:text-lg leading-relaxed text-slate-800 font-medium font-['Plus_Jakarta_Sans',sans-serif]">
            Lily planted a tiny seed in her garden. Days went by. The soil was dark and quiet. Then, a little{' '}
            <button
              type="button"
              onClick={() => {
                setShowVocab(true);
                speakText('sprout. A young plant that begins to grow out of a seed.');
              }}
              className="font-black text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-lg underline cursor-pointer transition-colors"
            >
              sprout
            </button>{' '}
            peeked out into the warm morning sunshine!
          </div>

          {/* Story Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-600 font-mono">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Read Aloud & Read Together Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  speakText(
                    "Lily planted a tiny seed in her garden. Days went by. The soil was dark and quiet. Then, a little sprout peeked out into the warm morning sunshine!"
                  )
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isReadingAloud
                    ? 'bg-rose-500 text-white animate-pulse shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs'
                }`}
              >
                <Volume2 className="w-4 h-4 text-rose-500" />
                <span>Listen to Page</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  speakText("Your turn! Read along with me: Lily planted a tiny seed...");
                }}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Read together</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Comprehension Question & Create Your Own Version (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Comprehension Quiz: "What might happen next?" (from Mockup!) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>What might happen next?</span>
            </div>

            <div className="space-y-2">
              {[
                { id: 0, text: 'The sprout keeps growing into a tall flower.', icon: '🌻' },
                { id: 1, text: 'A bird comes to visit the sprout.', icon: '🐦' },
                { id: 2, text: 'It starts to rain and the sprout gets bigger.', icon: '🌧️' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handlePredict(item.id)}
                  className={`w-full text-left p-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    selectedPrediction === item.id
                      ? 'bg-rose-50 text-rose-900 border-rose-300 shadow-xs ring-1 ring-rose-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <span className="leading-tight">{item.text}</span>
                </button>
              ))}
            </div>

            {rexyComment && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <RexyMascot size="xs" className="mt-0.5 shrink-0" />
                <span className="font-semibold">{rexyComment}</span>
              </div>
            )}
          </div>

          {/* Create your own version (from Mockup!) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 space-y-3">
            <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Create your own version
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChosenCharacter('dragon')}
                className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all ${
                  chosenCharacter === 'dragon'
                    ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl">🐉</span>
                <span className="text-[10px] font-bold">Rexy</span>
              </button>

              <button
                type="button"
                onClick={() => setChosenCharacter('fox')}
                className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all ${
                  chosenCharacter === 'fox'
                    ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl">🦊</span>
                <span className="text-[10px] font-bold">Fox</span>
              </button>

              <button
                type="button"
                onClick={() => setChosenCharacter('bunny')}
                className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all ${
                  chosenCharacter === 'bunny'
                    ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl">🐰</span>
                <span className="text-[10px] font-bold">Bunny</span>
              </button>
            </div>

            {/* Voice record ending */}
            <button
              type="button"
              onClick={() => {
                if (isRecordingEnding) {
                  setIsRecordingEnding(false);
                  setRecordedEndingText("And then the magical flower gave a tiny golden leaf to Rexy!");
                  speakText("What an imaginative ending! You are a true story maker!");
                } else {
                  setIsRecordingEnding(true);
                  speakText("I'm listening! Tell me how your story ends.");
                }
              }}
              className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isRecordingEnding
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
              }`}
            >
              {isRecordingEnding ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-rose-500" />}
              <span>{isRecordingEnding ? 'Recording... Tap to stop' : 'Record my ending'}</span>
            </button>

            {recordedEndingText && (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                <span className="font-bold">Your ending: </span>
                {recordedEndingText}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
