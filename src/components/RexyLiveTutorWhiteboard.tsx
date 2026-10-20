import { VOICE_CAPTURE_ENABLED } from '../lib/release';
import { apiFetch } from '../lib/release';
import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  PenTool,
  RotateCcw,
  Trash2,
  Lightbulb,
  Box,
  Layers,
  Volume2,
  VolumeX,
  Send,
  Camera,
  Play,
  Pause,
  Heart,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Undo2,
  Redo2,
  ArrowRight
} from 'lucide-react';
import { RexyMascot } from './RexyMascot';

interface Props {
  childName?: string;
  grade?: string;
  onBack?: () => void;
}

export const RexyLiveTutorWhiteboard: React.FC<Props> = ({
  childName = 'Young Explorer',
  grade = 'Grade 2',
  onBack,
}) => {
  // Voice & Chat State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeHelper, setActiveHelper] = useState<'ten-frame' | 'number-line' | 'number-bonds' | 'draw'>('ten-frame');
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  // Ten-Frame interactive counters state
  // Frame 1: 10 blue circles (representing the "10" in 12)
  const [frame1Counters, setFrame1Counters] = useState<number>(10);
  // Frame 2: 2 blue + 6 pink circles (representing 2 + 6)
  const [frame2Blue, setFrame2Blue] = useState<number>(2);
  const [frame2Pink, setFrame2Pink] = useState<number>(6);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#2563eb');
  const [toolMode, setToolMode] = useState<'pen' | 'highlighter' | 'eraser'>('pen');

  // Conversation history
  const [messages, setMessages] = useState<Array<{ sender: 'rexy' | 'student'; text: string }>>([
    { sender: 'rexy', text: 'Can we make a ten first?' },
    { sender: 'student', text: 'I think 12 can be 10 and 2!' },
    { sender: 'rexy', text: 'Great strategy! Tell me what you tried.' },
  ]);
  const [inputQuery, setInputQuery] = useState('');

  // Socratic Rexy speech
  const speakRexy = (text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.pitch = 1.25;
    utt.rate = 1.0;
    setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  // Web Speech recognition
  const toggleListening = () => {
    if (!VOICE_CAPTURE_ENABLED) { setHintMessage('Microphone capture is off in this preview. Type or draw your answer instead.'); return; }
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      const msg = "Try breaking 12 into 10 + 2, then add the 6!";
      setMessages((prev) => [...prev, { sender: 'rexy', text: msg }]);
      speakRexy(msg);
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
        const spoken = e.results[0][0].transcript;
        handleSendMessage(spoken);
        setIsListening(false);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    setMessages((prev) => [...prev, { sender: 'student', text }]);
    setInputQuery('');

    try {
      const res = await apiFetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Solve 12 + 6 using making ten strategy (10 + 2 + 6 = 18)',
          studentAnswer: text,
          isCorrect: text.includes('18') || text.includes('ten') || text.includes('10'),
          skillTitle: 'Addition within 20 by making ten',
          curriculumCode: 'B2.2',
          grade: '2',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.tutorMessage || "Brilliant thinking! 10 + 2 + 6 gives us 18!";
        setMessages((prev) => [...prev, { sender: 'rexy', text: reply }]);
        speakRexy(reply);
      } else {
        throw new Error('Local fallback');
      }
    } catch {
      const reply = /\b18\b|\beighteen\b/i.test(text)
        ? 'Yes! 12 + 6 = 18. We made ten, then added 2 + 6.'
        : 'This practice example is 12 + 6. Split 12 into 10 and 2, then count 2 + 6. How many do you add to ten?';
      setMessages((prev) => [...prev, { sender: 'rexy', text: reply }]);
      speakRexy(reply);
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    if (toolMode === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 20;
    } else if (toolMode === 'highlighter') {
      ctx.strokeStyle = drawColor + '55'; // translucent
      ctx.lineWidth = 14;
    } else {
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = 3;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur-md px-6 py-3.5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 font-['Fredoka']">
                Rexy Live
              </h1>
              <span className="text-[10px] uppercase font-bold bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-mono">
                Math explorers &bull; {grade}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Live tutoring with a curious friend &bull; Socratic guidance & interactive whiteboards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200/60">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>No pressure. We can try again.</span>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
              soundEnabled ? 'bg-sky-50 text-sky-600 border-sky-200' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Split: Left Avatar & Dialogue (3 cols) + Center Whiteboard (6 cols) + Right Tools (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Rexy Avatar & Live Socratic Dialogue (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between space-y-4">
          <div className="flex flex-col items-center text-center">
            <div className="relative my-2">
              <RexyMascot size="xl" mood={isSpeaking ? 'speaking' : 'happy'} className="animate-float" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase font-mono">
                {isSpeaking ? 'Speaking...' : 'Ready when you are'}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Ready when you are</span>
            </div>
          </div>

          {/* Socratic Dialogue Chat History */}
          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-60 pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-1.5 ${m.sender === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'rexy' && <RexyMascot size="xs" className="mt-0.5 shrink-0" />}
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs font-semibold leading-relaxed ${
                    m.sender === 'student'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-sky-50 text-slate-800 rounded-bl-xs border border-sky-100'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 font-medium text-center">
            Rexy listens and asks guided questions to help you think!
          </div>
        </div>

        {/* Center Column: Interactive Whiteboard & Math Canvas (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between relative overflow-hidden">
          {/* Top Whiteboard Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            {/* Tool selectors */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setToolMode('pen')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  toolMode === 'pen' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Pen"
              >
                <PenTool className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setToolMode('highlighter')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  toolMode === 'highlighter' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Highlighter"
              >
                🖍️
              </button>
              <button
                type="button"
                onClick={() => setToolMode('eraser')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  toolMode === 'eraser' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Eraser"
              >
                🧹
              </button>
            </div>

            {/* Color Palette Dots */}
            <div className="flex items-center gap-1.5">
              {['#2563eb', '#06b6d4', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setDrawColor(c)}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    drawColor === c ? 'scale-125 ring-2 ring-slate-400' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Canvas Actions (Clear, Undo) */}
            <button
              type="button"
              onClick={clearCanvas}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors"
              title="Clear drawings"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Canvas & Interactive Manipulatives Area */}
          <div className="relative my-3 min-h-[300px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-4">
            {/* Formula Header on Board */}
            <div className="text-3xl font-black text-slate-900 font-mono tracking-wider mb-4 select-none">
              12 + 6 = 18
            </div>

            {/* Interactive Ten-Frame Workspace */}
            {activeHelper === 'ten-frame' && (
              <div className="space-y-4 w-full max-w-md">
                <div className="grid grid-cols-2 gap-4">
                  {/* Frame 1: Full 10 Blue Counters */}
                  <div className="bg-white p-2.5 rounded-xl border-2 border-sky-400 shadow-xs">
                    <div className="text-[10px] font-black text-sky-700 uppercase mb-1.5 font-mono">
                      Ten Frame 1: [10]
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-[10px] font-bold shadow-xs transition-transform hover:scale-110"
                        >
                          ●
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Frame 2: 2 Blue + 6 Pink Counters */}
                  <div className="bg-white p-2.5 rounded-xl border-2 border-indigo-400 shadow-xs">
                    <div className="text-[10px] font-black text-indigo-700 uppercase mb-1.5 font-mono">
                      Ten Frame 2: [2 + 6 = 8]
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {Array.from({ length: 10 }).map((_, i) => {
                        const isBlue = i < frame2Blue;
                        const isPink = i >= frame2Blue && i < frame2Blue + frame2Pink;
                        return (
                          <div
                            key={i}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-xs transition-transform hover:scale-110 ${
                              isBlue
                                ? 'bg-sky-500'
                                : isPink
                                ? 'bg-rose-500'
                                : 'bg-slate-100 border border-dashed border-slate-300'
                            }`}
                          >
                            {isBlue || isPink ? '●' : ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Sub-addition Formula Connection */}
                <div className="text-center font-mono font-black text-xl text-indigo-700">
                  10 + 2 + 6 = 18
                </div>
              </div>
            )}

            {/* Drawing Canvas Layer */}
            <canvas
              ref={canvasRef}
              width={520}
              height={300}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 w-full h-full cursor-crosshair z-20 pointer-events-auto"
            />
          </div>

          {/* Bottom Bar: Waveform & Input Form */}
          <div className="pt-2 border-t border-slate-100">
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
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-white text-sky-600 hover:bg-sky-50 border border-slate-200 shadow-xs'
                }`}
                title="Speak to Rexy"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask, speak, or sketch your step..."
                className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden px-2"
              />

              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="w-9 h-9 rounded-xl bg-indigo-600 disabled:opacity-40 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Thinking Tools & Math Helpers (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* My thinking tools */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 space-y-2.5">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
              My thinking tools
            </h3>

            <button
              type="button"
              onClick={() => {
                const h = "Look at the first ten frame: it has 10! The second has 2 + 6 = 8. What is 10 + 8?";
                setHintMessage(h);
                speakRexy(h);
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/70 text-xs font-bold transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Give me a hint</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveHelper('ten-frame');
                speakRexy("Let's look at the blocks and ten frames together!");
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200/70 text-xs font-bold transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-sky-600" />
                <span>Try with blocks</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
            </button>

            <button
              type="button"
              onClick={() => {
                const alt = "You can also start at 12 and count up 6 times: 13, 14, 15, 16, 17, 18!";
                setHintMessage(alt);
                speakRexy(alt);
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/70 text-xs font-bold transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Show another way</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
            </button>

            <button
              type="button"
              onClick={() => {
                const slow = "Step 1: Notice 12 is made of 10 and 2. Step 2: Add 2 and 6 to get 8. Step 3: Put 10 and 8 together!";
                setHintMessage(slow);
                speakRexy(slow);
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/70 text-xs font-bold transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>🐌</span>
                <span>Slow it down</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
            </button>

            {hintMessage && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] font-semibold text-amber-900 animate-fadeIn">
                {hintMessage}
              </div>
            )}
          </div>

          {/* Math helpers buttons */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 space-y-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
              Math helpers
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveHelper('ten-frame')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeHelper === 'ten-frame'
                    ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🧮</span>
                <span>Ten frame</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveHelper('number-line');
                  speakRexy("A number line lets us jump 6 steps forward from 12!");
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeHelper === 'number-line'
                    ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>📏</span>
                <span>Number line</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveHelper('number-bonds');
                  speakRexy("Number bonds show how 12 splits into 10 and 2!");
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  activeHelper === 'number-bonds'
                    ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🔗</span>
                <span>Number bonds</span>
              </button>

              <button
                type="button"
                onClick={() => setToolMode('pen')}
                className="p-2.5 rounded-xl border bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all"
              >
                <span>✏️</span>
                <span>Draw it</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
