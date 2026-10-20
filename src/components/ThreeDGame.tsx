import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Trophy, ArrowLeft, Play, Sparkles, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onBack: () => void;
  childName: string;
}

export const ThreeDGame: React.FC<Props> = ({ onBack, childName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'title' | 'playing' | 'victory'>('title');
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentChallenge, setCurrentChallenge] = useState<{
    question: string;
    options: string[];
    correct: string;
  } | null>(null);

  const gameLoopRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    roverGroup?: THREE.Group;
    crystals: THREE.Group[];
    keys: { [key: string]: boolean };
    synthAudioCtx?: AudioContext;
  }>({
    crystals: [],
    keys: {},
  });

  // Sound synthesis
  const playBeep = (freq: number, type: OscillatorType = 'sine', duration: number = 0.15) => {
    if (!soundEnabled) return;
    try {
      const ctx = gameLoopRef.current.synthAudioCtx || new (window.AudioContext || (window as any).webkitAudioContext)();
      gameLoopRef.current.synthAudioCtx = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // AudioContext not available in some sandbox frames
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Studio PBR Lighting
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.FogExp2(0x090d16, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 7, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Warm Directional Key Light & Cool Fill
    const dirLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0x88bbff, 0x112233, 0.9);
    scene.add(hemiLight);

    // 2. Terrain Ground
    const groundGeo = new THREE.PlaneGeometry(80, 80, 40, 40);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1a2130,
      roughness: 0.85,
      metalness: 0.15,
      wireframe: false,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid Floor Accents
    const gridHelper = new THREE.GridHelper(80, 40, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // 3. Composite 7-Part Procedural Hero Rover with Canadarm
    const roverGroup = new THREE.Group();

    // Part 1: Main Chassis
    const chassisGeo = new THREE.BoxGeometry(2.2, 0.7, 3);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.7 });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 0.75;
    chassis.castShadow = true;
    roverGroup.add(chassis);

    // Part 2: Cabin Dome
    const cabinGeo = new THREE.SphereGeometry(0.85, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.9 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 1.1, 0.3);
    roverGroup.add(cabin);

    // Part 3-6: 4 All-Terrain Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const wheelPositions = [
      [-1.3, 0.45, 1.1],
      [1.3, 0.45, 1.1],
      [-1.3, 0.45, -1.1],
      [1.3, 0.45, -1.1],
    ];
    wheelPositions.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, y, z);
      wheel.castShadow = true;
      roverGroup.add(wheel);
    });

    // Part 7: Canadarm Articulated Robotic Arm
    const armBaseGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.5, 12);
    const armMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.6 });
    const armBase = new THREE.Mesh(armBaseGeo, armMat);
    armBase.position.set(0.6, 1.25, -0.8);

    const armUpperGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 8);
    const armUpper = new THREE.Mesh(armUpperGeo, armMat);
    armUpper.position.set(0, 0.8, 0.3);
    armUpper.rotation.x = 0.6;
    armBase.add(armUpper);

    // Canadian Flag Red Stripe
    const flagGeo = new THREE.BoxGeometry(0.04, 0.2, 0.35);
    const flagMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(0.1, 0.3, 0);
    armUpper.add(flag);

    roverGroup.add(armBase);
    scene.add(roverGroup);

    // 4. Procedural Glowing Ontario Crystals to Collect
    const crystals: THREE.Group[] = [];
    const crystalColors = [0x38bdf8, 0xa855f7, 0x10b981, 0xf59e0b, 0xf43f5e];
    const crystalNames = ['Ontario Quartz', 'Canadian Shield Granite', 'Amethyst Cluster', 'Cobalt Ore', 'Lake Superior Agate'];

    for (let i = 0; i < 5; i++) {
      const cGroup = new THREE.Group();
      const cGeo = new THREE.OctahedronGeometry(0.7, 0);
      const cMat = new THREE.MeshStandardMaterial({
        color: crystalColors[i],
        emissive: crystalColors[i],
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.8,
      });
      const crystalMesh = new THREE.Mesh(cGeo, cMat);
      crystalMesh.position.y = 1.2;
      crystalMesh.castShadow = true;
      cGroup.add(crystalMesh);

      // Light glow
      const cLight = new THREE.PointLight(crystalColors[i], 1.2, 5);
      cLight.position.y = 1.2;
      cGroup.add(cLight);

      // Random position in radius
      const angle = (i / 5) * Math.PI * 2;
      const dist = 10 + (i % 2) * 6;
      cGroup.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      cGroup.userData = { name: crystalNames[i], collected: false };

      scene.add(cGroup);
      crystals.push(cGroup);
    }

    gameLoopRef.current = {
      renderer,
      scene,
      camera,
      roverGroup,
      crystals,
      keys: {},
      synthAudioCtx: gameLoopRef.current.synthAudioCtx,
    };

    // Keyboard Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      gameLoopRef.current.keys[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      gameLoopRef.current.keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 5. 60fps Simulation Loop
    let lastTime = performance.now();
    let animationFrameId: number;

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const { keys, roverGroup, camera, crystals } = gameLoopRef.current;

      if (roverGroup && gameState === 'playing') {
        const speed = 7.0;
        const turnSpeed = 2.4;

        if (keys['w'] || keys['arrowup']) {
          roverGroup.translateZ(-speed * dt);
        }
        if (keys['s'] || keys['arrowdown']) {
          roverGroup.translateZ(speed * 0.6 * dt);
        }
        if (keys['a'] || keys['arrowleft']) {
          roverGroup.rotation.y += turnSpeed * dt;
        }
        if (keys['d'] || keys['arrowright']) {
          roverGroup.rotation.y -= turnSpeed * dt;
        }

        // Camera smoothly follows rover with exponential damping
        if (camera) {
          const targetCamPos = roverGroup.position.clone().add(
            new THREE.Vector3(0, 5, 9).applyAxisAngle(new THREE.Vector3(0, 1, 0), roverGroup.rotation.y)
          );
          camera.position.lerp(targetCamPos, 1 - Math.exp(-6 * dt));
          camera.lookAt(roverGroup.position.clone().add(new THREE.Vector3(0, 1, 0)));
        }

        // Rotate crystals & check collisions
        crystals.forEach((c) => {
          if (!c.userData.collected) {
            c.rotation.y += 1.8 * dt;
            const dist = roverGroup.position.distanceTo(c.position);
            if (dist < 2.0) {
              c.userData.collected = true;
              c.visible = false;
              setScore((prev) => {
                const next = prev + 1;
                playBeep(520 + next * 80, 'triangle', 0.2);
                if (next >= 5) {
                  setGameState('victory');
                  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                }
                return next;
              });
            }
          }
        });
      } else if (camera) {
        // Idle camera orbital pan on Title Screen
        const t = now * 0.0004;
        camera.position.x = Math.sin(t) * 14;
        camera.position.z = Math.cos(t) * 14;
        camera.position.y = 8;
        camera.lookAt(0, 1, 0);
      }

      if (scene && camera) {
        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [gameState]);

  const handleStartGame = () => {
    setGameState('playing');
    setScore(0);
    playBeep(440, 'sine', 0.1);
  };

  return (
    <div className="relative w-full h-[620px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-2 border-indigo-900 select-none">
      {/* 3D Canvas Mounting Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <button
          type="button"
          onClick={onBack}
          className="pointer-events-auto bg-slate-900/80 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl border border-white/20 text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-md font-['Fredoka']"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Game Shell</span>
        </button>

        {gameState === 'playing' && (
          <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs font-black text-white font-mono shadow-md">
            <span className="text-amber-400">🍁 Canadarm Lab</span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-400">Crystals: {score} / 5</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="pointer-events-auto bg-slate-900/80 backdrop-blur-md text-white p-2 rounded-2xl border border-white/20 text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-md"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* Title Screen Overlay */}
      {gameState === 'title' && (
        <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 text-white">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-3xl shadow-xl mb-3 animate-bounce">
            🚀
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-indigo-400 font-mono mb-1">
            Ontario Science & Space STEM 3D Game
          </span>

          <h2 className="text-3xl md:text-4xl font-black font-['Fredoka'] text-white tracking-tight mb-2">
            Canadarm Lab & Crystal Explorer
          </h2>

          <p className="text-xs text-indigo-200 max-w-md leading-relaxed mb-6">
            Pilot Canada’s space rover with an authentic Canadarm robotic arm across the planetary terrain. Collect 5 glowing Ontario Shield geological crystals!
          </p>

          <button
            type="button"
            onClick={handleStartGame}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-transform hover:scale-105 cursor-pointer font-['Fredoka'] flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Launch Rover Mission</span>
          </button>

          <div className="mt-4 text-[11px] text-slate-400 font-mono">
            Controls: WASD or Arrow Keys to Drive & Steer
          </div>
        </div>
      )}

      {/* Victory Modal */}
      {gameState === 'victory' && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 text-white animate-scaleUp">
          <div className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-4xl mb-3 shadow-inner">
            <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
          </div>

          <h3 className="text-3xl font-black font-['Fredoka'] text-yellow-300 mb-1">
            Mission Accomplished, {childName}!
          </h3>
          <p className="text-xs text-slate-300 max-w-sm mb-5 leading-relaxed">
            All 5 Ontario Geological Crystals collected and secured by the Canadarm! You've earned the <strong>Ontario Space Explorer Trophy 🚀</strong>!
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleStartGame}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer font-['Fredoka']"
            >
              Play Again
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer font-['Fredoka']"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* On-screen touch D-Pad for Mobile Apps (iPhone/Android Simulation) */}
      {gameState === 'playing' && (
        <div className="absolute bottom-4 left-4 flex flex-col items-center gap-1.5 z-20 opacity-80 hover:opacity-100 transition-opacity md:hidden">
          <button
            type="button"
            onPointerDown={() => (gameLoopRef.current.keys['w'] = true)}
            onPointerUp={() => (gameLoopRef.current.keys['w'] = false)}
            className="w-11 h-11 bg-slate-900/80 border border-white/20 rounded-xl text-white font-bold flex items-center justify-center"
          >
            ▲
          </button>
          <div className="flex gap-1.5">
            <button
              type="button"
              onPointerDown={() => (gameLoopRef.current.keys['a'] = true)}
              onPointerUp={() => (gameLoopRef.current.keys['a'] = false)}
              className="w-11 h-11 bg-slate-900/80 border border-white/20 rounded-xl text-white font-bold flex items-center justify-center"
            >
              ◀
            </button>
            <button
              type="button"
              onPointerDown={() => (gameLoopRef.current.keys['s'] = true)}
              onPointerUp={() => (gameLoopRef.current.keys['s'] = false)}
              className="w-11 h-11 bg-slate-900/80 border border-white/20 rounded-xl text-white font-bold flex items-center justify-center"
            >
              ▼
            </button>
            <button
              type="button"
              onPointerDown={() => (gameLoopRef.current.keys['d'] = true)}
              onPointerUp={() => (gameLoopRef.current.keys['d'] = false)}
              className="w-11 h-11 bg-slate-900/80 border border-white/20 rounded-xl text-white font-bold flex items-center justify-center"
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
