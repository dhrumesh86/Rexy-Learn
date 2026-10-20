import React, { useState } from 'react';
import {
  Shield,
  Server,
  Terminal,
  Activity,
  Layers,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  Play,
  RotateCcw,
  Sliders,
  ChevronRight,
  Database,
  Cpu,
  Key
} from 'lucide-react';
import { RexyMascot } from './RexyMascot';

export const RexyMultiOrgSupportWorkspace: React.FC = () => {
  const [selectedOrg, setSelectedOrg] = useState<'alpha' | 'beta' | 'gamma'>('alpha');
  const [activeTab, setActiveTab] = useState<'cases' | 'orgs' | 'data' | 'metadata' | 'workbench' | 'systems'>('cases');
  const [activeCaseId, setActiveCaseId] = useState<string>('10482');

  // Developer workbench script runner state
  const [apexScript, setApexScript] = useState<string>(
    `// Inspect active session token & user state\nAccount acc = [SELECT Id, Name FROM Account LIMIT 5];\nSystem.debug('Session check: ' + acc);`
  );
  const [scriptOutput, setScriptOutput] = useState<string | null>(null);
  const [isRunningScript, setIsRunningScript] = useState(false);

  const runDiagnosticScript = () => {
    setIsRunningScript(true);
    setTimeout(() => {
      setIsRunningScript(false);
      setScriptOutput(`DEBUG|User: a.smith@clientalpha.com\nDEBUG|SAML Response: Valid Signature\nDEBUG|OAuth Token: Expired at 10:24 AM (Refresh token rotated)\nSUCCESS: Session token refreshed successfully for Client Alpha UAT.`);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Made in Canada Enterprise Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#070e24] via-[#0f1d46] to-[#1a2d6d] text-white p-5 rounded-3xl shadow-lg border border-indigo-900/50">
        <div className="flex items-center gap-3">
          <RexyMascot size="md" className="animate-float" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black font-['Fredoka'] tracking-tight">
                Rexy <span className="text-sky-400">Support Intelligence Workspace</span>
              </h1>
              <span className="text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-400/40 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                🍁 MADE IN CANADA
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              One workspace. Every client org &bull; Unified Tier1 support intelligence for faster, better-informed action
            </p>
          </div>
        </div>

        {/* Chrome Extension Integration Pill */}
        <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs font-bold">
          <span className="text-base">🧩</span>
          <span>Google Chrome Extension &bull; Connected</span>
        </div>
      </div>

      {/* Main Workspace Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Workspace Subtabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'cases', label: 'Cases' },
            { id: 'orgs', label: 'Client Orgs' },
            { id: 'data', label: 'Data' },
            { id: 'metadata', label: 'Metadata' },
            { id: 'workbench', label: 'Workbench' },
            { id: 'systems', label: 'Systems' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Client Org Switcher (from Mockup!) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setSelectedOrg('alpha')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedOrg === 'alpha'
                ? 'bg-white text-sky-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span>Client Alpha &bull; UAT</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedOrg('beta')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedOrg === 'beta'
                ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Client Beta &bull; Production</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedOrg('gamma')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedOrg === 'gamma'
                ? 'bg-white text-purple-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>Client Gamma &bull; Sandbox</span>
          </button>
        </div>
      </div>

      {/* Case Investigation Deck (Matching Mockup 2 & 3!) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Active Case Details (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-lg font-mono">
                Tier1 Case 10482
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
                Open
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Owner: J. Chen &bull; Created: Mar 3, 2025
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Authentication investigation
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mt-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Client Org</span>
                <span className="font-bold text-slate-800">Client Alpha &bull; UAT</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Priority</span>
                <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">High</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Case Type</span>
                <span className="font-bold text-slate-800">Access / Login</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Last Updated</span>
                <span className="font-bold text-slate-800 font-mono">2:17 PM</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Description
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              User is unable to authenticate to the student &amp; parent learning portal. Receiving an invalid session error after entering valid credentials. Issue affects multiple teachers and parents in the UAT environment.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Key Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">User</span>
                <span className="font-bold text-sky-700 truncate block">a.smith@clientalpha.com</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Environment</span>
                <span className="font-bold text-slate-800">UAT</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Login Method</span>
                <span className="font-bold text-slate-800">SSO (SAML 2.0)</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Error Message</span>
                <span className="font-bold text-rose-600 text-[11px] truncate block">Invalid session</span>
              </div>
            </div>
          </div>

          {/* Interactive Developer Workbench Section */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-600" />
                <span>Developer Workbench &bull; Script Diagnostic</span>
              </h3>
              <button
                type="button"
                onClick={runDiagnosticScript}
                disabled={isRunningScript}
                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>{isRunningScript ? 'Executing...' : 'Run Diagnostic Script'}</span>
              </button>
            </div>

            <textarea
              value={apexScript}
              onChange={(e) => setApexScript(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 text-sky-300 font-mono text-xs p-3 rounded-2xl border border-slate-800 focus:outline-hidden"
            />

            {scriptOutput && (
              <div className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800 whitespace-pre-line animate-fadeIn">
                {scriptOutput}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Related Cases, Evidence Logs & Systems Status (from Mockup!) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Related Cases */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Related Cases
              </h3>
              <span className="text-xs text-sky-600 font-bold hover:underline cursor-pointer">
                View all
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { id: '10477', title: 'SSO token expiration', status: 'Closed', tagColor: 'bg-emerald-100 text-emerald-800' },
                { id: '10391', title: 'Intermittent login failures', status: 'Closed', tagColor: 'bg-emerald-100 text-emerald-800' },
                { id: '10234', title: 'Invalid session error', status: 'Open', tagColor: 'bg-sky-100 text-sky-800' },
                { id: '10188', title: 'SAML configuration issue', status: 'Closed', tagColor: 'bg-emerald-100 text-emerald-800' },
              ].map((c) => (
                <div
                  key={c.id}
                  onClick={() => alert(`Inspecting knowledge & history for Case ${c.id}: ${c.title}`)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700">#{c.id}</span>
                    <span className="text-slate-800 font-medium">{c.title}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.tagColor}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Logs Inspection */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Evidence
              </h3>
              <span className="text-xs text-sky-600 font-bold hover:underline cursor-pointer">
                View all
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="font-mono text-slate-700">📄 error_log_2025-03-03.txt</span>
                <span className="text-[10px] text-slate-400 font-mono">2 KB</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="font-mono text-slate-700">🖼️ screenshot_login_error.png</span>
                <span className="text-[10px] text-slate-400 font-mono">428 KB</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="font-mono text-slate-700">🌐 saml_trace.har</span>
                <span className="text-[10px] text-slate-400 font-mono">1.1 MB</span>
              </div>
            </div>
          </div>

          {/* Systems Status (Harmony & Bastion - from Mockup!) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 space-y-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Systems Status
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-black text-emerald-950">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Harmony</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                      Healthy
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700">API &bull; Auth &bull; Data Sync</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">2:12 PM</span>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-black text-emerald-950">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Bastion</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                      Healthy
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700">SSO &bull; Provisioning &bull; Directory</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">2:10 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 5 Feature Cards (from Mockup 2 & 3!) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-sky-300 transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🗄️</span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Multi-org data</h4>
              <p className="text-[10px] text-slate-400">Explore client records</p>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-sky-300 transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🔍</span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Suggestive search</h4>
              <p className="text-[10px] text-slate-400">Find related cases</p>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-sky-300 transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📑</span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Metadata explorer</h4>
              <p className="text-[10px] text-slate-400">Inspect objects & fields</p>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-sky-300 transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚡</span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Workbench</h4>
              <p className="text-[10px] text-slate-400">Run scripts & diagnostic</p>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-sky-300 transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚙️</span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Systems visibility</h4>
              <p className="text-[10px] text-slate-400">Review status & logs</p>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
