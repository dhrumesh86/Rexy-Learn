import React, { useState, useEffect } from 'react';
import { CurriculumSkill, Question } from '../types/learning';
import { InteractiveManipulative } from './InteractiveManipulative';
import { AITutorLumi } from './AITutorLumi';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Volume2,
  ChevronLeft,
  Award
} from 'lucide-react';

interface Props {
  skill: CurriculumSkill;
  childName: string;
  onBack: () => void;
  onSkillMastered: (skillId: string) => void;
}

export const PracticeArena: React.FC<Props> = ({ skill, childName, onBack, onSkillMastered }) => {
  const [smartScore, setSmartScore] = useState(skill.smartScore ?? 65);
  const [questionsAnswered, setQuestionsAnswered] = useState(skill.questionsAnswered ?? 0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(2);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastAnswerResult, setLastAnswerResult] = useState<{
    isCorrect: boolean;
    studentAnswer: string;
  } | null>(null);

  const questionList = skill.questions;
  const currentQ: Question = questionList[currentQuestionIndex % questionList.length];

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;

    const correct = selectedOption.trim() === currentQ.correctAnswer.trim();
    setIsAnswerSubmitted(true);
    setIsCorrect(correct);
    setQuestionsAnswered((prev) => prev + 1);

    setLastAnswerResult({
      isCorrect: correct,
      studentAnswer: selectedOption,
    });

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      // SmartScore calculation: gains 4 to 8 points based on bracket
      let gain = 8;
      if (smartScore >= 90) gain = 3; // Challenge zone gains
      else if (smartScore >= 80) gain = 5;

      const newScore = Math.min(100, smartScore + gain);
      setSmartScore(newScore);

      if (newScore === 100) {
        setShowCelebration(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        onSkillMastered(skill.id);
      } else if (newStreak % 3 === 0) {
        // Small celebratory burst on streaks
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
        });
      }
    } else {
      setStreak(0);
      // SmartScore drop (gentle penalty)
      const penalty = smartScore >= 90 ? 5 : 3;
      setSmartScore(Math.max(10, smartScore - penalty));
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  // Color scheme for SmartScore progress bar
  const getScoreColor = () => {
    if (smartScore === 100) return 'from-amber-400 via-yellow-400 to-amber-500';
    if (smartScore >= 90) return 'from-purple-600 to-pink-500'; // Challenge Zone
    if (smartScore >= 75) return 'from-emerald-500 to-teal-500';
    return 'from-blue-500 to-cyan-500';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 select-none">
      {/* Top Navigation & Skill Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Curriculum Map
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-900 font-mono">
            Grade {skill.grade} • {skill.curriculumCode}
          </span>
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">
            {skill.strand}
          </span>
        </div>
      </div>

      {/* IXL Metric Bar: Questions, Time, SmartScore */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-6">
        <div className="grid grid-cols-3 gap-3 divide-x divide-slate-100 text-center">
          {/* Questions Answered */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Questions
            </span>
            <span className="text-2xl font-black text-slate-800 font-['Fredoka']">
              {questionsAnswered}
            </span>
          </div>

          {/* Time Elapsed */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3" /> Time
            </span>
            <span className="text-2xl font-black text-slate-800 font-mono">
              {formatTime(elapsedSeconds)}
            </span>
          </div>

          {/* SmartScore (0-100) */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                SmartScore
              </span>
              {smartScore >= 90 && smartScore < 100 && (
                <span className="text-[10px] font-extrabold bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-full uppercase tracking-tighter animate-pulse">
                  Challenge
                </span>
              )}
              {smartScore === 100 && (
                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                  Mastered
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-black font-['Fredoka'] ${smartScore >= 90 ? 'text-purple-600' : 'text-emerald-600'}`}>
                {smartScore}
              </span>
              <span className="text-xs text-slate-400 font-bold">/100</span>
            </div>
          </div>
        </div>

        {/* SmartScore Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getScoreColor()} transition-all duration-500 shadow-sm`}
            style={{ width: `${smartScore}%` }}
          />
        </div>

        {/* Streak Pill */}
        {streak > 1 && (
          <div className="mt-2 flex items-center justify-center gap-1 text-xs font-bold text-amber-600">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{streak} in a row! Super momentum!</span>
          </div>
        )}
      </div>

      {/* Main Practice & AI Tutor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Question Card (8 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 relative overflow-hidden">
            {/* Challenge Zone banner if 90+ */}
            {smartScore >= 90 && smartScore < 100 && (
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-xl mb-4 flex items-center justify-between shadow-sm">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  Ontario Challenge Zone - Reach 100 to Master!
                </span>
                <Trophy className="w-4 h-4 text-yellow-300" />
              </div>
            )}

            {/* Title / prompt */}
            <div className="mb-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-1">
                Question {currentQuestionIndex + 1}
              </div>
              <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-snug">
                {currentQ.prompt}
              </h2>
            </div>

            {/* Optional Manipulative Component */}
            {currentQ.visual && (
              <InteractiveManipulative visual={currentQ.visual} interactive={!isAnswerSubmitted} />
            )}

            {/* Answer Options */}
            <div className="space-y-2.5 my-5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                let optionStyle = 'border-slate-200 bg-white hover:border-indigo-300 text-slate-800';

                if (isAnswerSubmitted) {
                  if (option.trim() === currentQ.correctAnswer.trim()) {
                    optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-400';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'border-red-400 bg-red-50 text-red-950 ring-2 ring-red-400';
                  } else {
                    optionStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-indigo-600 bg-indigo-50/60 text-indigo-950 ring-2 ring-indigo-500 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer shadow-xs ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold border ${
                        isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm md:text-base">{option}</span>
                    </div>

                    {isAnswerSubmitted && option.trim() === currentQ.correctAnswer.trim() && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOption}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-40 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-['Fredoka']"
                >
                  Submit Answer
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-['Fredoka']"
                >
                  Next Question
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Status pill after submission */}
              {isAnswerSubmitted && (
                <div className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${
                  isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isCorrect ? '🌟 Superb! Correct answer!' : '💡 Let’s learn from this step!'}
                </div>
              )}
            </div>
          </div>

          {/* Explanation drawer if incorrect */}
          {isAnswerSubmitted && !isCorrect && (
            <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-5 text-slate-800 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2 font-black text-amber-900 text-sm mb-2 font-['Fredoka']">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Step-by-Step Ontario Concept Breakdown:
              </div>
              <p className="text-sm leading-relaxed mb-3 text-slate-700">
                {currentQ.explanation}
              </p>
              <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                🎯 <strong>Key Ontario Takeaway:</strong> You’ve got the power to master this! Lumi broke down the misconception on the right.
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Lumi AI Real-Time Tutor (5 cols) */}
        <div className="lg:col-span-5 sticky top-4">
          <AITutorLumi
            skill={skill}
            currentQuestion={currentQ}
            lastAnswerResult={lastAnswerResult}
            childName={childName}
          />
        </div>
      </div>

      {/* Celebration Modal on Mastery */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border-4 border-amber-300 animate-scaleUp">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Trophy className="w-10 h-10 text-amber-500 animate-bounce" />
            </div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              Ontario Curriculum Mastery Unlocked!
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-['Fredoka'] mt-1">
              SmartScore 100 Achieved!
            </h2>
            <p className="text-xs text-slate-600 mt-2">
              Congratulations, {childName}! You fully mastered <strong>{skill.title}</strong> according to the Ontario Curriculum standards.
            </p>

            <div className="bg-amber-50 rounded-2xl p-3 my-4 border border-amber-200 text-xs font-semibold text-amber-900 flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Earned Badge: <strong>Ontario Math Champion 🍁</strong></span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCelebration(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Keep Practicing
              </button>
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer font-['Fredoka']"
              >
                Next Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
