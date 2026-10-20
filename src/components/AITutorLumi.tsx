import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, MessageCircle, HelpCircle, Lightbulb, ChevronRight, RefreshCw, Wand2 } from 'lucide-react';
import { RexyMascot } from './RexyMascot';
import { Question, CurriculumSkill } from '../types/learning';

interface Props {
  skill: CurriculumSkill;
  currentQuestion?: Question;
  lastAnswerResult?: {
    isCorrect: boolean;
    studentAnswer: string;
  } | null;
  childName: string;
}

export const AITutorLumi: React.FC<Props> = ({ skill, currentQuestion, lastAnswerResult, childName }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hintLevel, setHintLevel] = useState(0); // 0 = none, 1 = gentle, 2 = visual clue, 3 = full walkthrough
  const [tutorMessage, setTutorMessage] = useState<string>(
    `Hi ${childName}! I'm Rexy, your personal learning explorer. I'm right here with you as we master ${skill.title}!`
  );
  const [conceptTip, setConceptTip] = useState<string | null>(null);
  const [misconceptionNote, setMisconceptionNote] = useState<string | null>(null);
  const [customQuestionInput, setCustomQuestionInput] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Trigger real-time mind-reading when student answers
  useEffect(() => {
    if (!lastAnswerResult || !currentQuestion) return;

    const fetchTutorGuidance = async () => {
      setIsLoadingAI(true);
      try {
        const res = await fetch('/api/tutor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: currentQuestion.prompt,
            studentAnswer: lastAnswerResult.studentAnswer,
            isCorrect: lastAnswerResult.isCorrect,
            skillTitle: skill.title,
            curriculumCode: skill.curriculumCode,
            grade: skill.grade,
            childName,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setTutorMessage(data.tutorMessage || (lastAnswerResult.isCorrect ? 'Fantastic job!' : 'Let’s check this together!'));
          setConceptTip(data.conceptTip || null);
          setMisconceptionNote(data.misconceptionNote || null);

          if (soundEnabled) {
            speakText(data.tutorMessage);
          }
        }
      } catch (e) {
        console.error('Tutor chat error:', e);
      } finally {
        setIsLoadingAI(false);
      }
    };

    fetchTutorGuidance();
    setHintLevel(0); // reset hints for new question
  }, [lastAnswerResult]);

  // Audio Speech synthesis using Web Speech API with fallback
  const speakText = (text: string) => {
    if (!window.speechSynthesis || !soundEnabled) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Friendly cadence for elementary students
    utterance.pitch = 1.1; // Warm and inviting

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleAskLumi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestionInput.trim()) return;

    const userPrompt = customQuestionInput;
    setCustomQuestionInput('');
    setIsLoadingAI(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion?.prompt || skill.title,
          studentAnswer: `Child asked: "${userPrompt}"`,
          isCorrect: true,
          skillTitle: skill.title,
          curriculumCode: skill.curriculumCode,
          grade: skill.grade,
          childName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTutorMessage(data.tutorMessage);
        setConceptTip(data.conceptTip || null);
        setMisconceptionNote(null);
        if (soundEnabled) speakText(data.tutorMessage);
      }
    } catch (e) {
      setTutorMessage(`That's such a curious thought! In ${skill.title}, thinking about the big picture and drawing a diagram always brings clarity.`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white rounded-3xl p-5 shadow-xl border border-indigo-700/50 relative overflow-hidden transition-all">
      {/* Decorative ambient glowing circles */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          {/* Animated Rexy Avatar */}
          <div className="relative">
            <RexyMascot size="sm" mood={isSpeaking ? 'speaking' : 'happy'} className="animate-float" />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-indigo-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base tracking-tight text-yellow-300 flex items-center gap-1 font-['Fredoka']">
                Rexy AI Tutor
              </h3>
              <span className="text-[10px] bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded-full font-mono uppercase">
                Ontario {skill.curriculumCode}
              </span>
            </div>
            <p className="text-xs text-indigo-200">Real-time Socratic Guidance</p>
          </div>
        </div>

        {/* Audio voice toggle */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                speakText(tutorMessage);
              }
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-amber-400 text-slate-900 shadow-md font-bold'
                : 'bg-indigo-800/80 hover:bg-indigo-700 text-indigo-200'
            }`}
            title={isSpeaking ? 'Pause reading voice' : 'Read Lumi’s message aloud'}
          >
            {isSpeaking ? <Volume2 className="w-4 h-4 animate-bounce" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (isSpeaking) stopSpeaking();
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              !soundEnabled ? 'bg-red-950 text-red-300' : 'bg-indigo-800/80 hover:bg-indigo-700 text-indigo-200'
            }`}
            title={soundEnabled ? 'Mute AI speech' : 'Enable AI speech'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Tutor Speech Bubble */}
      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-3 relative z-10 text-sm leading-relaxed text-indigo-50 shadow-inner">
        {isLoadingAI ? (
          <div className="flex items-center gap-3 py-2 text-indigo-200">
            <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
            <span className="italic">Lumi is thinking through your learning steps...</span>
          </div>
        ) : (
          <p className="font-medium text-slate-100">{tutorMessage}</p>
        )}

        {/* Misconception Alert if error happened */}
        {misconceptionNote && (
          <div className="mt-3 p-3 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-200 text-xs">
            <div className="font-bold flex items-center gap-1.5 text-amber-300 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Lumi's Mind-Reading Clue:
            </div>
            {misconceptionNote}
          </div>
        )}

        {/* Concept Golden Rule */}
        {conceptTip && (
          <div className="mt-2 p-2.5 bg-teal-500/20 border border-teal-400/30 rounded-xl text-teal-200 text-xs flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-teal-300 shrink-0" />
            <span>{conceptTip}</span>
          </div>
        )}
      </div>

      {/* Progressive Hint Ladder */}
      {currentQuestion && (
        <div className="relative z-10 mb-3 bg-indigo-950/60 p-3 rounded-2xl border border-indigo-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              Socratic Hint Ladder
            </span>
            <span className="text-[11px] text-indigo-400 font-mono">
              Step {hintLevel} of 3
            </span>
          </div>

          {hintLevel === 0 && (
            <button
              type="button"
              onClick={() => {
                setHintLevel(1);
                speakText(currentQuestion.hint || "Take a look at the key words in the question!");
              }}
              className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              Need a gentle nudge? (Hint 1)
            </button>
          )}

          {hintLevel >= 1 && (
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-amber-500/10 border border-amber-400/30 rounded-xl text-amber-100">
                <span className="font-bold text-amber-300">💡 Hint 1: </span>
                {currentQuestion.hint}
              </div>

              {hintLevel === 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setHintLevel(2);
                    speakText("Let's look at the visual pattern! Notice how each part connects together.");
                  }}
                  className="w-full py-1.5 px-3 bg-indigo-800 hover:bg-indigo-700 text-indigo-200 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5 text-pink-300" />
                  Show visual explanation (Hint 2)
                </button>
              )}

              {hintLevel >= 2 && (
                <div className="p-2.5 bg-pink-500/10 border border-pink-400/30 rounded-xl text-pink-100">
                  <span className="font-bold text-pink-300">🎨 Visual Clue: </span>
                  {currentQuestion.explanation.slice(0, 100)}...
                </div>
              )}

              {hintLevel === 2 && (
                <button
                  type="button"
                  onClick={() => {
                    setHintLevel(3);
                    speakText(currentQuestion.explanation);
                  }}
                  className="w-full py-1.5 px-3 bg-indigo-800 hover:bg-indigo-700 text-indigo-200 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
                  Show full step-by-step solution (Hint 3)
                </button>
              )}

              {hintLevel === 3 && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-400/30 rounded-xl text-emerald-100">
                  <span className="font-bold text-emerald-300">✅ Complete Solution: </span>
                  {currentQuestion.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ask Lumi anything input */}
      <form onSubmit={handleAskLumi} className="relative z-10 flex gap-2">
        <input
          type="text"
          value={customQuestionInput}
          onChange={(e) => setCustomQuestionInput(e.target.value)}
          placeholder={`Ask Lumi a question ("Explain like I'm 7...")`}
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-indigo-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
        />
        <button
          type="submit"
          disabled={!customQuestionInput.trim() || isLoadingAI}
          className="px-3 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-900 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Ask
        </button>
      </form>
    </div>
  );
};

export const AITutorRexy = AITutorLumi;
