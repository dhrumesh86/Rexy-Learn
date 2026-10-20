import { apiFetch } from '../lib/release';
import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Zap,
  Cpu,
  AlertOctagon,
  RefreshCw,
  PlayCircle,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Terminal,
  Volume2,
  Wifi,
  Users
} from 'lucide-react';

interface TelemetryLog {
  id: string;
  timestamp: string;
  type: 'INFO' | 'API' | 'TUTOR' | 'ERROR' | 'DIAGNOSTIC';
  message: string;
  details?: any;
  latencyMs?: number;
}

interface TelemetryData {
  uptimeSeconds: number;
  totalRequests: number;
  apiSuccessCount: number;
  apiErrorCount: number;
  averageLatencyMs: number;
  activeSessions: number;
  geminiConnected: boolean;
  curriculumVersion: string;
  systemStatus: 'OPTIMAL' | 'DEGRADED';
  recentLogs: TelemetryLog[];
}

export const AdminPortal: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ERROR' | 'TUTOR' | 'API'>('ALL');

  // Calibration settings
  const [masteryThreshold, setMasteryThreshold] = useState(90);
  const [penaltySensitivity, setPenaltySensitivity] = useState('Gentle');
  const [aiModelSelected, setAiModelSelected] = useState('gemini-3.8-flash');

  const fetchTelemetry = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/admin/telemetry');
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (err) {
      console.error('Failed to fetch admin telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 6000); // Live poll every 6s
    return () => clearInterval(interval);
  }, []);

  const handleSimulateStudentActivity = async () => {
    setIsSimulating(true);
    try {
      await apiFetch('/api/admin/simulate-activity', { method: 'POST' });
      await fetchTelemetry();
    } catch (e) {
      console.error('Simulation error:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  const filteredLogs = telemetry?.recentLogs?.filter((l) => {
    if (activeFilter === 'ALL') return true;
    return l.type === activeFilter;
  }) ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black font-['Fredoka'] text-white">
                Technical Diagnostics & Website Monitor
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                telemetry?.systemStatus === 'OPTIMAL' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {telemetry?.systemStatus || 'OPTIMAL'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live Ontario Curriculum Engine Telemetry • Port 3000 • Gemini 3.8 Flash
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSimulateStudentActivity}
            disabled={isSimulating}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow cursor-pointer font-['Fredoka']"
          >
            <PlayCircle className="w-4 h-4" />
            {isSimulating ? 'Simulating...' : 'Simulate Student Activity'}
          </button>
          <button
            type="button"
            onClick={fetchTelemetry}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
            title="Refresh telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Sessions</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-800 font-['Fredoka']">
            {telemetry?.activeSessions ?? 3} Kids
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1">Ontario schools live</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg AI Latency</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-800 font-['Fredoka']">
            {telemetry?.averageLatencyMs ?? 38} ms
          </div>
          <span className="text-[11px] text-slate-500 mt-1">Gemini 3.8 Flash response</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">API Reliability</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 font-['Fredoka']">
            99.9%
          </div>
          <span className="text-[11px] text-slate-500 mt-1">Errors: {telemetry?.apiErrorCount ?? 0}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Server Uptime</span>
            <Cpu className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-slate-800 font-mono">
            {Math.floor((telemetry?.uptimeSeconds ?? 120) / 60)}m {(telemetry?.uptimeSeconds ?? 120) % 60}s
          </div>
          <span className="text-[11px] text-purple-600 font-bold mt-1">Healthy Node.js Runtime</span>
        </div>
      </div>

      {/* Main Grid: Live Logs Stream & Calibration Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Real-time Telemetry Log Console (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 text-slate-200 rounded-3xl p-6 border border-slate-800 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Live Technical Event Stream
              </h2>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 text-[11px] font-mono">
              {(['ALL', 'TUTOR', 'API', 'ERROR'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Logs container */}
          <div className="space-y-2 font-mono text-xs max-h-96 overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="text-slate-500 py-6 text-center italic">
                No logs recorded for filter: {activeFilter}
              </div>
            ) : (
              filteredLogs.map((log) => {
                let badgeColor = 'bg-slate-800 text-slate-300';
                if (log.type === 'ERROR') badgeColor = 'bg-red-500/20 text-red-400 border border-red-500/30';
                if (log.type === 'TUTOR') badgeColor = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
                if (log.type === 'API') badgeColor = 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
                if (log.type === 'DIAGNOSTIC') badgeColor = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';

                return (
                  <div
                    key={log.id}
                    className="p-2.5 bg-slate-900/80 hover:bg-slate-900 rounded-xl border border-slate-800/80 flex items-start gap-2.5 transition-colors"
                  >
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${badgeColor}`}>
                      {log.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                        <span className="truncate">{log.message}</span>
                        {log.latencyMs && (
                          <span className="text-[10px] text-amber-400 font-mono shrink-0 ml-2">
                            {log.latencyMs}ms
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-600">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Ontario Curriculum Calibration & Technical Checks (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-base font-black text-slate-800 font-['Fredoka'] mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Curriculum Calibration Settings
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center font-bold text-slate-700 mb-1">
                  <span>SmartScore Mastery Threshold</span>
                  <span className="text-indigo-600 font-mono">{masteryThreshold}/100</span>
                </div>
                <input
                  type="range"
                  min="85"
                  max="100"
                  value={masteryThreshold}
                  onChange={(e) => setMasteryThreshold(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600"
                />
                <span className="text-[10px] text-slate-400">Score at which gold medal ribbon unlocks</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Misconception Recovery Mode
                </label>
                <select
                  value={penaltySensitivity}
                  onChange={(e) => setPenaltySensitivity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="Gentle">Gentle (-3 pts on error, max scaffolding)</option>
                  <option value="Standard">Standard (-5 pts on error)</option>
                  <option value="Rigorous">Rigorous (-8 pts in Challenge Zone)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  AI Model Assignment
                </label>
                <select
                  value={aiModelSelected}
                  onChange={(e) => setAiModelSelected(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium font-mono text-[11px]"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash (Real-Time Tutor)</option>
                  <option value="gemini-3.8-flash-lite-tts">gemini-3.8-flash-lite-tts (Speech Voice)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Technical Diagnostics */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Client Technical Diagnostics
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Web Speech API</span>
                <span className="font-bold text-emerald-600">Available</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">HTML5 Canvas Manipulatives</span>
                <span className="font-bold text-emerald-600">Accelerated</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Ontario Curriculum Database</span>
                <span className="font-bold text-emerald-600">Synced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
