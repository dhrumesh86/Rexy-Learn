import React, { useState } from 'react';
import {
  Sun,
  Droplets,
  Play,
  RotateCcw,
  Sparkles,
  Lightbulb,
  PenTool,
  Mic,
  MicOff,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  FlaskConical,
  Trees,
  Compass
} from 'lucide-react';
import { RexyMascot } from './RexyMascot';

interface Props {
  childName?: string;
  grade?: string;
  onBack?: () => void;
}

export const RexyDiscoveryLabSimulation: React.FC<Props> = ({
  childName = 'Young Explorer',
  grade = 'Grade 2',
  onBack,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('plants');
  const [sunlightLevel, setSunlightLevel] = useState<number>(3); // 1 to 5
  const [waterLevel, setWaterLevel] = useState<number>(3); // 1 to 5
  const [selectedPrediction, setSelectedPrediction] = useState<string>('taller');
  const [simulationTested, setSimulationTested] = useState<boolean>(false);
  const [simulationDay, setSimulationDay] = useState<number>(10);
  const [rexyFeedback, setRexyFeedback] = useState<string | null>(null);

  // Active activity: 'grow-world' | 'habitat' | 'shape' | 'weather'
  const [activeActivity, setActiveActivity] = useState<'grow-world' | 'habitat' | 'shape' | 'weather'>('grow-world');

  const runSimulation = () => {
    setSimulationTested(true);
    let outcome = '';
    if (sunlightLevel >= 3 && waterLevel >= 3) {
      outcome = 'Splendid! With balanced sunlight and water, your plant sprouted strong roots, tall stem, and 6 new leaves!';
      setSimulationDay(15);
    } else if (waterLevel < 2) {
      outcome = 'The soil is a bit thirsty! Without enough water, the leaves curl up gently to save moisture.';
      setSimulationDay(4);
    } else if (sunlightLevel < 2) {
      outcome = 'The plant is in deep shade! It stretches tall and thin looking for sunlight rays!';
      setSimulationDay(7);
    } else {
      outcome = 'Great observation! The plant adjusts to its environment steadily.';
      setSimulationDay(10);
    }
    setRexyFeedback(outcome);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(outcome);
      utt.pitch = 1.2;
      window.speechSynthesis.speak(utt);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 font-['Fredoka']">
                Discovery Lab
              </h1>
              <span className="text-[10px] uppercase font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
                Science &amp; Tech &bull; {grade}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Ask. Explore. Create. See what happens! &bull; Interactive botanical & physical simulations
            </p>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All activities' },
            { id: 'plants', label: 'Plants & living things' },
            { id: 'matter', label: 'Matter & materials' },
            { id: 'weather', label: 'Weather & earth' },
            { id: 'design', label: 'Design & make' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage: "Grow your own little world" */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Simulation Canvas & Sliders (Left 8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-['Fredoka']">
                Grow your own little world
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Explore how plants grow. Change the sunlight and water conditions and see what happens!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                Ontario Science B1.2
              </span>
            </div>
          </div>

          {/* Botanical Visual Stage */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-50 p-6 min-h-[280px] flex flex-col justify-between border border-emerald-100">
            {/* Sun / Sky conditions */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs">
                <Sun className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '12s' }} />
                <span className="text-xs font-bold text-slate-700">
                  Sunlight: {sunlightLevel}/5
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-sky-200 shadow-xs">
                <Droplets className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-bold text-slate-700">
                  Water: {waterLevel}/5
                </span>
              </div>
            </div>

            {/* Central Animated Plant & Rexy Scientist */}
            <div className="flex items-end justify-center gap-8 my-4 z-10">
              <RexyMascot size="xl" variant="science" className="animate-float" />

              {/* Plant Pot Simulation Visual */}
              <div className="flex flex-col items-center">
                {/* Sprout / Flower based on conditions & tested state */}
                <div className="relative flex flex-col items-center transition-all duration-500">
                  {simulationDay >= 15 ? (
                    <div className="text-center animate-bounce">
                      <span className="text-5xl">🌻</span>
                      <div className="text-4xl -mt-2">🌿</div>
                    </div>
                  ) : simulationDay >= 10 ? (
                    <div className="text-center">
                      <span className="text-4xl">🌱</span>
                      <div className="text-3xl -mt-1">🌿</div>
                    </div>
                  ) : simulationDay >= 4 ? (
                    <div className="text-center">
                      <span className="text-3xl">🌱</span>
                    </div>
                  ) : (
                    <div className="text-center text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      🌰 Tiny Seed
                    </div>
                  )}
                </div>

                {/* Pot */}
                <div className="w-24 h-16 bg-gradient-to-b from-amber-700 to-amber-900 rounded-b-3xl border-t-4 border-amber-600 shadow-md flex items-center justify-center text-white text-[10px] font-bold">
                  Day {simulationDay}
                </div>
              </div>
            </div>

            {/* Growth Stages Timeline */}
            <div className="grid grid-cols-3 gap-2 bg-white/90 backdrop-blur-sm rounded-2xl p-2.5 border border-slate-200 text-center z-10">
              <div className={`p-1.5 rounded-xl ${simulationDay <= 4 ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-500'}`}>
                <div className="text-xs">Day 1</div>
                <div className="text-[10px]">A tiny seed</div>
              </div>
              <div className={`p-1.5 rounded-xl ${simulationDay > 4 && simulationDay < 15 ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-500'}`}>
                <div className="text-xs">Day 4</div>
                <div className="text-[10px]">A sprout appears</div>
              </div>
              <div className={`p-1.5 rounded-xl ${simulationDay >= 15 ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-500'}`}>
                <div className="text-xs">Day 15</div>
                <div className="text-[10px]">Tall flower blooms!</div>
              </div>
            </div>
          </div>

          {/* Condition Sliders (Sunlight & Water) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sunlight Slider */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs font-extrabold text-amber-900 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-600" />
                  Sunlight Level
                </span>
                <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-amber-200">
                  {sunlightLevel === 1 ? 'Shade' : sunlightLevel === 5 ? 'Full Sun' : 'Moderate'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={sunlightLevel}
                onChange={(e) => {
                  setSunlightLevel(Number(e.target.value));
                  setSimulationTested(false);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Water Slider */}
            <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs font-extrabold text-sky-900 mb-2">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  Water Moisture
                </span>
                <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-sky-200">
                  {waterLevel === 1 ? 'Dry' : waterLevel === 5 ? 'Very Wet' : 'Optimal'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={waterLevel}
                onChange={(e) => {
                  setWaterLevel(Number(e.target.value));
                  setSimulationTested(false);
                }}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>
          </div>

          {/* What happens next? Prediction Multiple Choice */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
              What happens next? (Make your hypothesis)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'taller', label: 'The plant gets taller', icon: '🌱' },
                { id: 'leaves', label: 'More leaves grow', icon: '🌿' },
                { id: 'yellow', label: 'The leaves turn yellow', icon: '🍂' },
                { id: 'same', label: 'It stays the same', icon: '⏸️' },
              ].map((hypo) => (
                <button
                  key={hypo.id}
                  type="button"
                  onClick={() => setSelectedPrediction(hypo.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedPrediction === hypo.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-lg">{hypo.icon}</span>
                  <span className="text-[11px] font-bold leading-tight">{hypo.label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={runSimulation}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Test my idea</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Curious Rexy Dialogue & More Activities (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Curious Rexy Prompt Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 space-y-3">
            <div className="flex items-center gap-2">
              <RexyMascot size="xs" variant="science" />
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Curious Rexy
              </span>
            </div>

            <p className="text-xs font-medium text-slate-700 bg-sky-50 p-3 rounded-2xl border border-sky-100">
              {rexyFeedback || "What do you notice about the leaves when the sunlight increases? Do they turn deeper green?"}
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setRexyFeedback("Clue: Green leaves act like tiny solar panels, turning sunlight, water, and air into plant food!");
                }}
                className="w-full text-left px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between"
              >
                <span>💡 Give me a clue</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => alert('Drawing canvas opened! Sketch your botanical drawing.')}
                className="w-full text-left px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between"
              >
                <span>✏️ Draw my idea</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* More Discovery Lab Activities (from Mockup!) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 space-y-3">
            <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
              More discovery lab activities
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => alert('Launching Canadian Animal Habitat Simulator: Design shelter, food, and water for an owl or beaver!')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🦉</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Build a habitat</h4>
                    <p className="text-[10px] text-slate-500">Design a home for an animal</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => alert('Launching Shape Detective: Spot 2D and 3D geometric shapes across architecture and nature!')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔷</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Shape detective</h4>
                    <p className="text-[10px] text-slate-500">Find shapes in the world around you</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => alert('Launching Weather Watcher: Explore how temperature, clouds, and wind shape storms!')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌧️</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Weather watcher</h4>
                    <p className="text-[10px] text-slate-500">Explore rain, wind and sun</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
