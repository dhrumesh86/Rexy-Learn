import React, { useState } from 'react';
import { VisualManipulativeData } from '../types/learning';
import { Eye, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  visual: VisualManipulativeData;
  interactive?: boolean;
}

export const InteractiveManipulative: React.FC<Props> = ({ visual, interactive = true }) => {
  const { type, data } = visual;

  // Fraction Bar State
  const [fractionAShaded, setFractionAShaded] = useState(data.fractionA?.num ?? 1);
  const [fractionBShaded, setFractionBShaded] = useState(data.fractionB?.num ?? 1);

  // Base-Ten State
  const [userHundreds, setUserHundreds] = useState(data.hundreds ?? 0);
  const [userTens, setUserTens] = useState(data.tens ?? 0);
  const [userOnes, setUserOnes] = useState(data.ones ?? 0);

  // Balance Scale State
  const [scaleLeft, setScaleLeft] = useState(12);

  if (type === 'fraction_bar') {
    const fA = data.fractionA || { num: 3, den: 4, label: '3/4' };
    const fB = data.fractionB || { num: 2, den: 4, label: '2/4' };

    return (
      <div className="bg-slate-50 border-2 border-emerald-100 rounded-2xl p-4 my-3 select-none">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Interactive Fraction Strips
          </span>
          <span className="text-slate-500 font-normal">Click blocks to explore shaded parts</span>
        </div>

        {/* Fraction A Strip */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm font-bold text-slate-700 mb-1">
            <span>Fraction 1: {fA.label || `${fractionAShaded}/${fA.den}`}</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
              {fractionAShaded} of {fA.den} parts
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-10 p-1 bg-slate-200 rounded-xl border border-slate-300">
            {Array.from({ length: fA.den }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => interactive && setFractionAShaded(idx + 1)}
                className={`h-full rounded-lg font-bold text-xs transition-all flex items-center justify-center cursor-pointer ${
                  idx < fractionAShaded
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm ring-1 ring-emerald-600'
                    : 'bg-white text-slate-400 hover:bg-slate-100'
                }`}
              >
                1/{fA.den}
              </button>
            ))}
          </div>
        </div>

        {/* Fraction B Strip */}
        <div>
          <div className="flex justify-between items-center text-sm font-bold text-slate-700 mb-1">
            <span>Fraction 2: {fB.label || `${fractionBShaded}/${fB.den}`}</span>
            <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full font-mono">
              {fractionBShaded} of {fB.den} parts
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-10 p-1 bg-slate-200 rounded-xl border border-slate-300">
            {Array.from({ length: fB.den }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => interactive && setFractionBShaded(idx + 1)}
                className={`h-full rounded-lg font-bold text-xs transition-all flex items-center justify-center cursor-pointer ${
                  idx < fractionBShaded
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm ring-1 ring-cyan-600'
                    : 'bg-white text-slate-400 hover:bg-slate-100'
                }`}
              >
                1/{fB.den}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'base_ten') {
    const total = userHundreds * 100 + userTens * 10 + userOnes;

    return (
      <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4 my-3">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-amber-900 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Ontario Base-Ten Place Value Mat
          </span>
          <span className="font-mono bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
            Total Value: {total}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Hundreds Flats */}
          <div className="bg-white p-3 rounded-xl border border-amber-200 flex flex-col items-center">
            <span className="text-xs font-bold text-blue-700 mb-2">Hundreds (100)</span>
            <div className="flex flex-wrap gap-1.5 justify-center min-h-[60px] items-center">
              {Array.from({ length: userHundreds }).map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-blue-100 border-2 border-blue-400 rounded grid grid-cols-5 grid-rows-5 gap-0.5 p-0.5 shadow-sm"
                  title="Hundred Flat"
                >
                  {Array.from({ length: 25 }).map((_, j) => (
                    <div key={j} className="bg-blue-300 rounded-[1px]" />
                  ))}
                </div>
              ))}
              {userHundreds === 0 && <span className="text-xs text-slate-400 italic">None</span>}
            </div>
            {interactive && (
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setUserHundreds(Math.max(0, userHundreds - 1))}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold font-mono">{userHundreds}</span>
                <button
                  type="button"
                  onClick={() => setUserHundreds(userHundreds + 1)}
                  className="p-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Tens Rods */}
          <div className="bg-white p-3 rounded-xl border border-amber-200 flex flex-col items-center">
            <span className="text-xs font-bold text-emerald-700 mb-2">Tens (10)</span>
            <div className="flex flex-wrap gap-2 justify-center min-h-[60px] items-center">
              {Array.from({ length: userTens }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-14 bg-emerald-100 border-2 border-emerald-500 rounded flex flex-col gap-0.5 p-0.5 shadow-sm"
                  title="Ten Rod"
                >
                  {Array.from({ length: 10 }).map((_, j) => (
                    <div key={j} className="h-1 bg-emerald-400 rounded-[1px]" />
                  ))}
                </div>
              ))}
              {userTens === 0 && <span className="text-xs text-slate-400 italic">None</span>}
            </div>
            {interactive && (
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setUserTens(Math.max(0, userTens - 1))}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold font-mono">{userTens}</span>
                <button
                  type="button"
                  onClick={() => setUserTens(userTens + 1)}
                  className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Ones Units */}
          <div className="bg-white p-3 rounded-xl border border-amber-200 flex flex-col items-center">
            <span className="text-xs font-bold text-amber-700 mb-2">Ones (1)</span>
            <div className="flex flex-wrap gap-1.5 justify-center min-h-[60px] items-center max-w-[120px]">
              {Array.from({ length: userOnes }).map((_, i) => (
                <div
                  key={i}
                  className="w-3.5 h-3.5 bg-amber-200 border border-amber-600 rounded-sm shadow-xs"
                  title="One Unit"
                />
              ))}
              {userOnes === 0 && <span className="text-xs text-slate-400 italic">None</span>}
            </div>
            {interactive && (
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setUserOnes(Math.max(0, userOnes - 1))}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold font-mono">{userOnes}</span>
                <button
                  type="button"
                  onClick={() => setUserOnes(userOnes + 1)}
                  className="p-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'balance_scale') {
    const isLevel = scaleLeft === (data.target ?? 12);
    const tilt = isLevel ? 0 : scaleLeft < (data.target ?? 12) ? -8 : 8;

    return (
      <div className="bg-indigo-50/70 border-2 border-indigo-200 rounded-2xl p-4 my-3 text-center">
        <div className="flex items-center justify-between mb-2 text-xs font-semibold text-indigo-900 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Algebraic Balance Scale
          </span>
          <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${isLevel ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {isLevel ? '⚖️ Balanced (Equal)' : '⚖️ Unbalanced'}
          </span>
        </div>

        {/* SVG Scale */}
        <div className="py-2 flex flex-col items-center">
          <svg width="280" height="130" viewBox="0 0 280 130" className="transition-transform duration-300">
            {/* Base and Fulcrum */}
            <polygon points="140,40 125,115 155,115" fill="#64748b" />
            <rect x="110" y="115" width="60" height="8" rx="3" fill="#334155" />
            <circle cx="140" cy="40" r="5" fill="#0f172a" />

            {/* Tilting Beam */}
            <g transform={`rotate(${tilt} 140 40)`} className="transition-all duration-300">
              <rect x="40" y="37" width="200" height="6" rx="3" fill="#475569" />

              {/* Left Pan Chains and Plate */}
              <line x1="50" y1="40" x2="35" y2="85" stroke="#94a3b8" strokeWidth="2" />
              <line x1="50" y1="40" x2="65" y2="85" stroke="#94a3b8" strokeWidth="2" />
              <ellipse cx="50" cy="85" rx="30" ry="6" fill="#0284c7" />

              {/* Right Pan Chains and Plate */}
              <line x1="230" y1="40" x2="215" y2="85" stroke="#94a3b8" strokeWidth="2" />
              <line x1="230" y1="40" x2="245" y2="85" stroke="#94a3b8" strokeWidth="2" />
              <ellipse cx="230" cy="85" rx="30" ry="6" fill="#0284c7" />

              {/* Pan Contents Labels */}
              <text x="50" y="78" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="bold">
                {data.leftLabel || `x + 7`}
              </text>
              <text x="230" y="78" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="bold">
                {data.rightLabel || '19 kg'}
              </text>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  if (type === 'canadian_currency') {
    return (
      <div className="bg-red-50/70 border-2 border-red-200 rounded-2xl p-4 my-3">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-red-900 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="text-base">🍁</span>
            Canadian Cash Register
          </span>
          <span className="font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">
            Paid: ${data.paid?.toFixed(2)} | Cost: ${data.itemCost?.toFixed(2)}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Canadian $5 Bill */}
          <div className="w-28 h-14 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-sm border border-blue-400 p-1 flex flex-col justify-between text-white">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span>CANADA</span>
              <span>$5</span>
            </div>
            <div className="text-[9px] opacity-80 text-center font-mono">POLYMER BILL</div>
            <div className="text-[10px] font-bold text-right">$5.00</div>
          </div>

          {/* Loonie */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 border-2 border-amber-600 flex flex-col items-center justify-center shadow-sm text-amber-950 font-bold text-xs" title="Canadian 1 Dollar (Loonie)">
            <span>$1</span>
            <span className="text-[8px] -mt-1">LOON</span>
          </div>

          {/* Toonie */}
          <div className="w-13 h-13 rounded-full bg-slate-300 border-2 border-slate-400 p-1.5 flex items-center justify-center shadow-sm" title="Canadian 2 Dollar (Toonie)">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-amber-500 border border-amber-600 flex items-center justify-center text-amber-950 font-bold text-xs">
              $2
            </div>
          </div>

          {/* Quarter */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 border border-slate-500 flex items-center justify-center text-slate-800 font-bold text-[10px] shadow-xs" title="Canadian 25 Cents (Quarter)">
            25¢
          </div>
        </div>
      </div>
    );
  }

  if (type === 'geometry_shape') {
    const { length = 8, width = 5, unit = 'm' } = data;
    return (
      <div className="bg-purple-50/70 border-2 border-purple-200 rounded-2xl p-4 my-3 text-center">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-purple-900 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            2D Shape Spatial Dimension
          </span>
          <span className="text-purple-700 text-xs">Ice Rink Blueprint</span>
        </div>

        <div className="flex justify-center items-center py-2">
          <div className="relative border-4 border-dashed border-purple-500 bg-purple-100/60 rounded-xl w-56 h-36 flex flex-col items-center justify-center shadow-sm">
            {/* Top dimension */}
            <span className="absolute -top-3 bg-purple-600 text-white px-2 py-0.5 rounded text-xs font-bold">
              Length: {length} {unit}
            </span>
            {/* Right dimension */}
            <span className="absolute -right-4 bg-purple-600 text-white px-1.5 py-0.5 rounded text-xs font-bold rotate-90">
              Width: {width} {unit}
            </span>
            {/* Bottom dimension */}
            <span className="absolute -bottom-3 bg-purple-200 text-purple-900 px-2 py-0.5 rounded text-xs font-bold">
              {length} {unit}
            </span>
            {/* Left dimension */}
            <span className="absolute -left-4 bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded text-xs font-bold -rotate-90">
              {width} {unit}
            </span>

            <div className="text-purple-800 text-xs font-medium">
              Perimeter = All 4 boundary sides
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Science Cell or Space view
  return (
    <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-4 my-3">
      <div className="flex items-center justify-between mb-2 text-xs font-semibold text-teal-900 uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-teal-600" />
          Ontario Science Explorer View
        </span>
        <span className="text-teal-700">{data.topic || data.organ || 'STEM Inquiry'}</span>
      </div>

      <div className="flex items-center justify-center gap-3 py-3">
        <div className="text-4xl">{data.flag || (data.organ === 'heart' ? '🫀' : '🔬')}</div>
        <div className="text-left text-sm text-teal-900">
          <div className="font-bold text-base">{data.topic || 'Canadian Scientific Discovery'}</div>
          <div className="text-xs text-teal-700">Hands-on Canadian Curriculum Investigation</div>
        </div>
      </div>
    </div>
  );
};
