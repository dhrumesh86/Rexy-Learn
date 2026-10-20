import React, { useEffect, useState } from 'react';
interface InstallEvent extends Event { prompt(): Promise<void>; userChoice: Promise<{ outcome: string }>; }
export function ReleaseNotice() {
  const [install, setInstall] = useState<InstallEvent | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  useEffect(() => {
    const ready = (event: Event) => { event.preventDefault(); setInstall(event as InstallEvent); };
    const done = () => setInstall(null);
    window.addEventListener('beforeinstallprompt', ready);
    window.addEventListener('appinstalled', done);
    return () => { window.removeEventListener('beforeinstallprompt', ready); window.removeEventListener('appinstalled', done); };
  }, []);
  const installApp = async () => {
    if (!install) { setShowHelp(value => !value); return; }
    try { await install.prompt(); await install.userChoice; } finally { setInstall(null); }
  };
  return <aside className="bg-[#101b46] text-white px-4 py-3 text-xs" aria-label="Preview status">
    <div className="flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto">
      <p className="leading-relaxed flex-1 min-w-[220px]"><strong>Family preview.</strong> Example learner profiles and reports. Progress resets on reload. Tutor responses are scripted; live AI and microphone capture are off.</p>
      <button type="button" onClick={installApp} className="rounded-xl bg-sky-300 text-indigo-950 px-4 py-2 font-bold">{install ? 'Install Rexy Learn' : 'Add to phone'}</button>
    </div>
    {showHelp && <p className="max-w-7xl mx-auto mt-3" role="status">Android: open the browser menu and choose Install app or Add to Home screen. iPhone: open in Safari, tap Share, then Add to Home Screen. Availability depends on your browser.</p>}
  </aside>;
}
