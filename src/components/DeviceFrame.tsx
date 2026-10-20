import React from 'react';
import { DeviceView } from '../types/learning';
import { Wifi, Battery, Signal, Tablet, Smartphone, Monitor } from 'lucide-react';

interface Props {
  deviceView: DeviceView;
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onSwitchToDesktop?: () => void;
}

export const DeviceFrame: React.FC<Props> = ({
  deviceView,
  children,
  activeTab = 'overview',
  onTabChange,
  onSwitchToDesktop,
}) => {
  if (deviceView === 'desktop') {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  // IPAD PRO SIMULATION (11" / 12.9" Landscape Tablet)
  if (deviceView === 'ipad') {
    return (
      <div className="py-6 px-4 flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-slate-200 via-sky-100/60 to-slate-200">
        <div className="mb-3 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-slate-300 shadow-sm text-xs font-bold text-slate-700">
          <Tablet className="w-4 h-4 text-sky-600" />
          <span>Simulating Apple iPad Pro 12.9" (iPadOS Touch Experience)</span>
          <span className="text-slate-300">&bull;</span>
          <button
            type="button"
            onClick={onSwitchToDesktop}
            className="text-sky-600 hover:text-sky-800 underline cursor-pointer"
          >
            Switch to Desktop
          </button>
        </div>

        {/* iPad Pro Chassis */}
        <div className="relative w-full max-w-[1020px] h-[720px] bg-slate-950 p-4 shadow-2xl ring-12 ring-slate-800/80 border-4 border-slate-700 rounded-[38px] flex flex-col overflow-hidden">
          {/* Top Front Camera */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800 z-50" />

          {/* iPadOS Status Bar */}
          <div className="h-7 w-full flex items-center justify-between px-6 pt-0.5 text-slate-800 z-40 text-xs font-semibold select-none">
            <span className="text-[11px] font-bold text-slate-800 font-mono">9:41 AM</span>
            <div className="flex items-center gap-2 text-slate-800">
              <span className="text-[10px] font-bold bg-slate-200/90 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                iPadOS 18
              </span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-slate-800" />
            </div>
          </div>

          {/* iPad Screen Area */}
          <div className="flex-1 w-full bg-slate-50 overflow-y-auto rounded-[26px] relative z-20 pb-4">
            {children}
          </div>

          {/* iPad Home Indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-48 h-1 bg-slate-400 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    );
  }

  // ANDROID TABLET SIMULATION (Pixel Tablet / Galaxy Tab)
  if (deviceView === 'tablet') {
    return (
      <div className="py-6 px-4 flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-slate-200 via-sky-100/60 to-slate-200">
        <div className="mb-3 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-slate-300 shadow-sm text-xs font-bold text-slate-700">
          <Tablet className="w-4 h-4 text-indigo-600" />
          <span>Simulating Android Tablet (Google Pixel Tablet)</span>
          <span className="text-slate-300">&bull;</span>
          <button
            type="button"
            onClick={onSwitchToDesktop}
            className="text-sky-600 hover:text-sky-800 underline cursor-pointer"
          >
            Switch to Desktop
          </button>
        </div>

        {/* Android Tablet Chassis */}
        <div className="relative w-full max-w-[980px] h-[700px] bg-slate-900 p-3.5 shadow-2xl ring-10 ring-slate-800 border-4 border-slate-700 rounded-[32px] flex flex-col overflow-hidden">
          {/* Top Camera */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full border border-slate-800 z-50" />

          {/* Android Status Bar */}
          <div className="h-6 w-full flex items-center justify-between px-6 pt-0.5 text-slate-800 z-40 text-xs font-semibold select-none">
            <span className="text-[11px] font-bold text-slate-800 font-mono">10:00</span>
            <div className="flex items-center gap-2 text-slate-800">
              <span className="text-[10px] font-bold bg-slate-200 px-1.5 py-0.5 rounded font-mono">
                Android 15
              </span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-slate-800" />
            </div>
          </div>

          {/* Tablet Screen Area */}
          <div className="flex-1 w-full bg-slate-50 overflow-y-auto rounded-[22px] relative z-20 pb-4">
            {children}
          </div>

          {/* Android Gesture Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-500 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    );
  }

  const isIphone = deviceView === 'iphone';

  // MOBILE PHONES (iPhone 16 Pro & Google Pixel 9)
  return (
    <div className="py-8 px-2 flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-slate-200 via-sky-100/60 to-slate-200">
      {/* Device Mode Switcher Banner */}
      <div className="mb-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-300 shadow-sm text-xs font-bold text-slate-700">
        <span>Simulating {isIphone ? 'Apple iPhone 16 Pro' : 'Google Pixel 9 Android'}</span>
        <span className="text-slate-300">&bull;</span>
        <button
          type="button"
          onClick={onSwitchToDesktop}
          className="text-sky-600 hover:text-sky-800 underline cursor-pointer"
        >
          Switch back to Desktop Web
        </button>
      </div>

      {/* Phone Hardware Shell */}
      <div
        className={`relative w-full max-w-[420px] h-[870px] bg-slate-950 p-3 shadow-2xl ring-12 ring-slate-800 border-4 border-slate-700 flex flex-col overflow-hidden ${
          isIphone ? 'rounded-[56px]' : 'rounded-[48px]'
        }`}
      >
        {/* Top Camera / Notch / Dynamic Island */}
        {isIphone ? (
          /* iPhone 16 Pro Dynamic Island */
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-full z-50 flex items-center justify-between px-3 border border-slate-900 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-sky-300 font-extrabold font-['Fredoka']">Rexy Live</span>
            </div>
          </div>
        ) : (
          /* Android Punch-hole Camera */
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 border border-slate-800" />
        )}

        {/* Status Bar */}
        <div className="h-9 w-full flex items-center justify-between px-7 pt-1 text-slate-700 z-40 text-xs font-semibold select-none">
          <span className="text-[11px] font-bold text-slate-800 font-mono">9:41</span>
          <div className="flex items-center gap-1.5 text-slate-800">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-slate-800" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 w-full bg-slate-50 overflow-y-auto rounded-[42px] relative z-20 pb-4">
          {children}
        </div>

        {/* Bottom Hardware Indicator */}
        {isIphone ? (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400 rounded-full z-50 pointer-events-none" />
        ) : (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-500 rounded-full z-50 pointer-events-none" />
        )}
      </div>
    </div>
  );
};
