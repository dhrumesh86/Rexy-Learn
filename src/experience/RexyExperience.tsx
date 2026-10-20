import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  Home,
  Compass,
  FlaskConical,
  Trophy,
  Users,
  BookOpen,
  Headphones,
  CalendarDays,
  Sparkles,
  Bell,
  Settings,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  Clock3,
  Flame,
  BarChart3,
  Star,
  Lightbulb,
  Pencil,
  Mic,
  Camera,
  Keyboard,
  Volume2,
  VolumeX,
  X,
  Menu,
  Plus,
  Leaf,
  Sun,
  Droplets,
  ShieldCheck,
  LockKeyhole,
  Play,
  RotateCcw,
  Trash2,
  Undo2,
  HelpCircle,
  Mountain,
  Gamepad2,
  Heart,
  WandSparkles,
  Send,
  Download,
  Info,
  Target,
  Sprout,
  CloudSun,
  Blocks,
  Palette,
  Bookmark,
  Smile,
} from "lucide-react";
import {
  defaultPlan,
  planActivities,
  plantOutcome,
  questions,
  storyPages,
  subjects,
  tutorReply,
} from "./learning";
import type { Page, Plan, Subject } from "./learning";
import "./rexy.css";
const RoverGame = lazy(() =>
  import("../components/ThreeDGame").then((module) => ({
    default: module.ThreeDGame,
  })),
);
const art = "/assets/rexy-v3/";
const navigation: { id: Page; label: string; icon: typeof Home }[] = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "path", label: "Learning path", icon: Compass },
  { id: "live", label: "Rexy Live", icon: Headphones },
  { id: "story", label: "Story Studio", icon: BookOpen },
  { id: "lab", label: "Discovery lab", icon: FlaskConical },
  { id: "achievements", label: "My achievements", icon: Trophy },
  { id: "parent", label: "Parent space", icon: Users },
  { id: "planner", label: "Weekly planner", icon: CalendarDays },
];
const titles: Record<Page, [string, string]> = {
  overview: [
    "Ready for your next discovery?",
    "New questions. New skills. A brighter you.",
  ],
  path: ["My Learning Path", "Ontario Grade 2 · Your learning adventure"],
  lab: ["Discovery Lab", "Ask. Explore. Create. See what happens!"],
  live: ["Rexy Live", "A practice buddy who helps you think."],
  story: ["Story Studio", "Read, create, and bring ideas to life."],
  achievements: [
    "Little steps. Wonderful discoveries.",
    "Celebrate curiosity, effort, and the joy of trying.",
  ],
  parent: [
    "Parent Insights",
    "See what they’re exploring, celebrate progress, and plan what’s next.",
  ],
  planner: [
    "Our Weekly Rhythm",
    "A calm plan for steady progress, curious discoveries, and time to be themselves.",
  ],
  games: ["The Play Lab", "Big ideas start with a little play."],
};
function localRead<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function localSave(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
function currentPage(): Page {
  if (typeof window === "undefined") return "overview";
  const key = new URLSearchParams(window.location.search).get("page");
  return key && Object.hasOwn(titles, key) ? (key as Page) : "overview";
}
function Mascot({
  className = "",
  alt = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      className={`rx-mascot ${className}`}
      src={`${art}mascot.webp`}
      alt={alt}
      {...props}
    />
  );
}
function SubjectIcon({
  subject,
  size = 19,
}: {
  subject: Subject;
  size?: number;
}) {
  const Icon =
    subject === "math"
      ? Blocks
      : subject === "reading"
        ? BookOpen
        : FlaskConical;
  return <Icon size={size} />;
}
function Progress({
  value,
  color = "blue",
}: {
  value: number;
  color?: string;
}) {
  return (
    <span className={`rx-progress ${color}`}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </span>
  );
}
function Wave({ small = false }: { small?: boolean }) {
  return (
    <div className={`rx-wave ${small ? "small" : ""}`} aria-hidden="true">
      {Array.from({ length: 29 }, (_, i) => (
        <i
          key={i}
          style={{
            height: `${7 + Math.round(Math.sin(i * 1.7) ** 2 * (16 - Math.abs(i - 14)) * 2)}px`,
            animationDelay: `${i * 0.06}s`,
          }}
        />
      ))}
    </div>
  );
}
function Primary({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`rx-primary ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      <ArrowRight size={17} />
    </button>
  );
}
function Stats({ parent = false }: { parent?: boolean }) {
  return (
    <div className="rx-stats">
      <div className="rx-stat">
        <span className="rx-stat-icon purple">
          <Clock3 />
        </span>
        <div>
          <strong>
            {parent ? "4.2" : "24"} <small>{parent ? "h" : "/ 60 min"}</small>
          </strong>
          <p>{parent ? "explored this week" : "Today’s learning"}</p>
          {!parent && <Progress value={40} color="purple" />}
        </div>
      </div>
      <div className="rx-stat">
        <span className="rx-stat-icon blue">
          {parent ? <CalendarDays /> : <Mountain />}
        </span>
        <div>
          <strong>
            {parent ? "5" : "3"} <small>{parent ? "" : "adventures"}</small>
          </strong>
          <p>{parent ? "learning days" : "Completed today"}</p>
          <span className="rx-stat-foot">
            {parent ? "Out of 7 days" : "▲ ▲ ▲ △"}
          </span>
        </div>
      </div>
      <div className="rx-stat">
        <span className={`rx-stat-icon ${parent ? "green" : "amber"}`}>
          {parent ? <BookOpen /> : <Flame />}
        </span>
        <div>
          <strong>
            {parent ? "3" : "5-day"} <small>{parent ? "" : "streak"}</small>
          </strong>
          <p>{parent ? "subjects" : "Keep going!"}</p>
          <span className="rx-stat-foot warm">
            {parent ? "Math · Reading · Science" : "● ● ● ● ● ◌ ◌"}
          </span>
        </div>
      </div>
      <div className="rx-stat confidence">
        <span className="rx-stat-icon teal">
          <BarChart3 />
        </span>
        <div>
          <strong>Growing confidence</strong>
          <p>
            {parent
              ? "More initiative and effort"
              : "You’re making great progress!"}
          </p>
        </div>
        <Sparkles className="rx-confidence-spark" />
      </div>
    </div>
  );
}
function WeeklyChart({ parent = false }: { parent?: boolean }) {
  const values = [44, 65, 50, 75, 57, 32, 60];
  return (
    <div
      className={`rx-chart ${parent ? "tall" : ""}`}
      role="img"
      aria-label="Example weekly activity: Monday 44, Tuesday 65, Wednesday 50, Thursday 75, Friday 57, Saturday 32, Sunday 60 relative activity units. Sample data."
    >
      <div className="rx-chart-grid">
        <span>{parent ? "3h" : "60 min"}</span>
        <span>{parent ? "2h" : "30 min"}</span>
        <span>0</span>
      </div>
      <div className="rx-chart-bars">
        {values.slice(0, parent ? 5 : 7).map((height, i) => (
          <div key={i}>
            <div className="rx-chart-bar" style={{ height: `${height}%` }}>
              {parent ? (
                <>
                  <i />
                  <i />
                  <i />
                </>
              ) : (
                <i />
              )}
            </div>
            <span>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function TutorRail({
  onNavigate,
  speak,
  notify,
}: {
  onNavigate: (page: Page) => void;
  speak: (text: string) => void;
  notify: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [messages, setMessages] = useState([
    {
      role: "rexy",
      text: "Let’s make 8! You have 5 stars. How many more do you need?",
    },
  ]);
  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const reply = tutorReply(text);
    setMessages((p) => [
      ...p.slice(-5),
      { role: "student", text },
      { role: "rexy", text: reply },
    ]);
    setText("");
    speak(reply);
  }
  return (
    <aside className="rx-tutor-rail">
      <div className="rx-tutor-heading">
        <Mascot />
        <div>
          <h2>
            Learn with Rexy <span>Practice</span>
          </h2>
          <small>
            <i />
            Ready to explore
          </small>
        </div>
        <button
          className="rx-icon-button"
          aria-label="Open Rexy practice room"
          onClick={() => onNavigate("live")}
        >
          <Headphones size={18} />
        </button>
      </div>
      <div className="rx-tutor-content">
        <div className="rx-conversation" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`rx-message ${m.role}`}>
              {m.role === "rexy" && <Mascot />}
              <p>{m.text}</p>
              {m.role === "student" && (
                <span className="rx-child-avatar">🧑🏻</span>
              )}
            </div>
          ))}
        </div>
        <div className="rx-counter-card">
          <p>
            Tap the stars to show <strong>5 + 3 = 8</strong>
          </p>
          <div className="rx-stars">
            {Array.from({ length: 8 }, (_, i) => (
              <button
                key={i}
                aria-label={`Star ${i + 1}${i < stars ? " filled" : ""}`}
                aria-pressed={i < stars}
                onClick={() => {
                  setStars(i + 1);
                  if (i === 7)
                    speak("You made eight! Five and three more make eight.");
                }}
              >
                <Star className={i < stars ? "filled" : ""} />
              </button>
            ))}
          </div>
          <div className="rx-helper-actions">
            <button
              onClick={() => {
                const hint = tutorReply("hint");
                setMessages((p) => [...p, { role: "rexy", text: hint }]);
                speak(hint);
              }}
            >
              <Lightbulb size={15} />
              Give me a hint
            </button>
            <button onClick={() => onNavigate("live")}>
              <Pencil size={15} />
              Draw it
            </button>
          </div>
          <button
            className="rx-soft-button full"
            onClick={() => onNavigate("live")}
          >
            <BookOpen size={15} />
            Explain another way
          </button>
        </div>
        <div className="rx-voice-card">
          <Wave />
          <p>Ask, think, or sketch…</p>
          <div className="rx-voice-actions">
            <button
              className="rx-mic"
              aria-label="Voice service availability"
              onClick={() =>
                notify(
                  "Voice conversations are not connected. Type a message or try the drawing board.",
                )
              }
            >
              <Mic size={26} />
            </button>
            <button
              className="rx-round"
              aria-label="Open drawing board"
              onClick={() => onNavigate("live")}
            >
              <Pencil size={18} />
            </button>
            <button
              className="rx-round"
              aria-label="Camera service availability"
              onClick={() =>
                notify("Camera uploads are not connected in this preview.")
              }
            >
              <Camera size={18} />
            </button>
          </div>
        </div>
      </div>
      <form className="rx-chat-input" onSubmit={send}>
        <input
          aria-label="Message Rexy"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Try “3” or “give me a hint”…"
          maxLength={300}
        />
        <button aria-label="Send message">
          <ArrowUp size={18} />
        </button>
      </form>
      <small className="rx-tutor-disclosure">
        Authored practice · No live AI or recording
      </small>
    </aside>
  );
}
function SubjectCards({ onStart }: { onStart: (subject: Subject) => void }) {
  return (
    <div className="rx-subject-grid">
      {subjects.map((s, i) => (
        <button
          key={s.id}
          className={`rx-subject-card ${s.color}`}
          onClick={() => onStart(s.id)}
        >
          <div className="rx-subject-copy">
            <span className={`rx-square-icon ${s.color}`}>
              <SubjectIcon subject={s.id} />
            </span>
            <div>
              <h3>{s.name}</h3>
              <p>{s.detail}</p>
            </div>
          </div>
          <div
            className={`rx-subject-art panel-${i}`}
            role="img"
            aria-label={`Rexy exploring ${s.name.toLowerCase()}`}
          />
          <div className="rx-subject-bottom">
            <Progress value={s.progress} color={s.color} />
            <div>
              <span>Lesson {i === 2 ? "2 of 6" : "3 of 6"}</span>
              <span>{s.progress}%</span>
              <span className="rx-arrow-orb">
                <ArrowRight size={16} />
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
function Journey({
  onNavigate,
  onStart,
}: {
  onNavigate: (p: Page) => void;
  onStart: (s: Subject) => void;
}) {
  return (
    <section className="rx-panel rx-journey">
      <div className="rx-panel-title">
        <h3>Today’s journey</h3>
        <button onClick={() => onNavigate("planner")}>
          <Pencil size={12} />
          Edit plan
        </button>
      </div>
      <div className="rx-timeline">
        {[
          {
            name: "Math explorers",
            sub: "Build with numbers",
            time: "15 min",
            color: "pink",
            icon: Blocks,
            done: true,
            page: "math",
          },
          {
            name: "Break time",
            sub: "Move, stretch, breathe",
            time: "5 min",
            color: "amber",
            icon: Smile,
            done: true,
            page: "break",
          },
          {
            name: "Story seekers",
            sub: "Read and explore",
            time: "15 min",
            color: "blue",
            icon: BookOpen,
            active: true,
            page: "story",
          },
          {
            name: "Break time",
            sub: "Quick brain break",
            time: "5 min",
            color: "amber",
            icon: Smile,
            page: "break",
          },
          {
            name: "Wonder lab",
            sub: "Ask and discover",
            time: "15 min",
            color: "green",
            icon: FlaskConical,
            page: "lab",
          },
          {
            name: "Wrap up",
            sub: "Celebrate progress!",
            time: "5 min",
            color: "purple",
            icon: Check,
            page: "achievements",
          },
        ].map((a, i) => (
          <button
            key={i}
            className={`rx-timeline-row ${a.active ? "active" : ""}`}
            onClick={() =>
              a.page === "math"
                ? onStart("math")
                : a.page === "break"
                  ? onNavigate("planner")
                  : onNavigate(a.page as Page)
            }
          >
            <span className="rx-timeline-dot" />
            <span className={`rx-square-icon ${a.color}`}>
              <a.icon size={17} />
            </span>
            <span>
              <strong>{a.name}</strong>
              <small>{a.time}</small>
              <em>{a.sub}</em>
            </span>
            {a.done ? (
              <CheckCircle2 className="rx-complete" size={16} />
            ) : (
              <span className="rx-empty-circle" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
function Overview({
  navigate,
  start,
}: {
  navigate: (p: Page) => void;
  start: (s: Subject) => void;
}) {
  return (
    <>
      <Stats />
      <div className="rx-dashboard-grid">
        <div className="rx-dashboard-main">
          <section className="rx-hero">
            <div className="rx-hero-copy">
              <span className="rx-eyebrow">
                A little wonder goes a long way
              </span>
              <h2>
                Your curiosity
                <br />
                is a superpower.
              </h2>
              <p>
                Ask. Explore. Make new connections.
                <br />
                There’s a whole world waiting for you!
              </p>
              <Primary onClick={() => start("math")}>
                Start my adventure
              </Primary>
            </div>
            <span className="rx-handwritten">
              Same questions.
              <br />
              Brighter worlds!
            </span>
          </section>
          <SubjectCards onStart={start} />
          <div className="rx-bottom-grid">
            <section className="rx-panel">
              <h3>
                My weekly progress{" "}
                <span className="rx-sample-inline">Example</span>
              </h3>
              <WeeklyChart />
            </section>
            <button
              className="rx-panel rx-achievement-mini"
              onClick={() => navigate("achievements")}
            >
              <h3>Latest achievement</h3>
              <div>
                <span className="rx-medal">
                  <Star fill="currentColor" />
                </span>
                <span>
                  <strong>Question Explorer</strong>
                  <small>You asked 10 amazing questions this week!</small>
                </span>
                <Sparkles className="rx-spark" />
              </div>
            </button>
          </div>
        </div>
        <div className="rx-dashboard-side">
          <Journey onNavigate={navigate} onStart={start} />
          <section className="rx-panel rx-sample-insights">
            <h3>Sample insights</h3>
            {[
              "You’re building confidence in addition!",
              "Your reading time is growing steadily.",
              "You ask thoughtful questions. Keep it up!",
            ].map((x) => (
              <p key={x}>
                <Check size={13} />
                {x}
              </p>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
function LearningPath({
  start,
  navigate,
}: {
  start: (s: Subject) => void;
  navigate: (p: Page) => void;
}) {
  const [selected, setSelected] = useState<Subject>("math");
  const s = subjects.find((s) => s.id === selected)!;
  return (
    <div className="rx-learning-layout">
      <section className="rx-world-map" aria-label="Choose a learning island">
        <div className="rx-map-glow" />
        {subjects.map((subject, i) => (
          <div className={`rx-island island-${i}`} key={subject.id}>
            <button
              className={`rx-island-label ${subject.color} ${selected === subject.id ? "selected" : ""}`}
              onClick={() => setSelected(subject.id)}
            >
              <span>
                <SubjectIcon subject={subject.id} />
              </span>
              {subject.land}
              <ChevronRight size={18} />
            </button>
            <div className="rx-island-nodes">
              {[0, 1, 2, 3].map((n) => (
                <button
                  key={n}
                  aria-label={`${subject.land} activity ${n + 1}${n === 3 ? " locked" : ""}`}
                  className={n === 3 ? "locked" : ""}
                  disabled={n === 3}
                  onClick={() => {
                    setSelected(subject.id);
                    start(subject.id);
                  }}
                >
                  {n === 3 ? <LockKeyhole size={17} /> : <Check size={21} />}
                </button>
              ))}
            </div>
            <span className={`rx-island-subject ${subject.color}`}>
              {subject.id === "math"
                ? "MATH"
                : subject.id === "reading"
                  ? "READING"
                  : "SCIENCE"}
            </span>
          </div>
        ))}
        <div className="rx-map-caption">
          <Compass size={16} />
          Every path leads to a new possibility.
        </div>
      </section>
      <aside className="rx-path-side">
        <div className="rx-map-stats">
          <div className="green">
            <BookOpen />
            <strong>3</strong>
            <small>pathways</small>
          </div>
          <div className="amber">
            <Star />
            <strong>8</strong>
            <small>discoveries</small>
          </div>
          <div className="purple">
            <BarChart3 />
            <strong>Keep</strong>
            <small>growing</small>
          </div>
        </div>
        <section className="rx-panel rx-next-discovery">
          <span className="rx-eyebrow">Your next discovery</span>
          <p>
            {selected === "math"
              ? "Math"
              : selected === "reading"
                ? "Reading"
                : "Science"}{" "}
            · {s.land}
          </p>
          <div className={`rx-subject-art panel-${subjects.indexOf(s)}`} />
          <h2>{s.lesson}</h2>
          <span className="rx-inline-meta">
            <Clock3 size={16} />
            15 minutes
          </span>
          <p>Skills you’ll practise:</p>
          <div className="rx-tags">
            <span>
              {selected === "math"
                ? "Count on"
                : selected === "reading"
                  ? "Find clues"
                  : "Observe"}
            </span>
            <span>
              {selected === "math"
                ? "Make ten"
                : selected === "reading"
                  ? "Imagine"
                  : "Test an idea"}
            </span>
          </div>
          <Primary
            onClick={() =>
              selected === "reading"
                ? navigate("story")
                : selected === "science"
                  ? navigate("lab")
                  : start("math")
            }
          >
            Start adventure
          </Primary>
          <button
            className="rx-soft-button full"
            onClick={() => start(selected)}
          >
            <Play size={15} />
            Try a sample
          </button>
        </section>
        <div className="rx-gentle-note">
          <Mascot />
          <div>
            <strong>Go at my pace</strong>
            <p>Take your time. You can always come back and explore more.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
function Plant({
  height = 75,
  healthy = true,
  tiny = false,
}: {
  height?: number;
  healthy?: boolean;
  tiny?: boolean;
}) {
  return (
    <div
      className={`rx-plant ${healthy ? "" : "thirsty"} ${tiny ? "tiny" : ""}`}
      style={{ "--plant-height": `${height}px` } as React.CSSProperties}
    >
      <span className="rx-plant-stem" />
      <span className="rx-plant-leaf l1" />
      <span className="rx-plant-leaf l2" />
      <span className="rx-plant-leaf l3" />
      <span className="rx-plant-leaf l4" />
      <span className="rx-plant-soil" />
      <span className="rx-plant-pot" />
    </div>
  );
}
function DiscoveryLab({
  notify,
  speak,
  start,
}: {
  notify: (t: string) => void;
  speak: (t: string) => void;
  start: (s: Subject) => void;
}) {
  const [sun, setSun] = useState(65),
    [water, setWater] = useState(55),
    [prediction, setPrediction] = useState(0),
    [tested, setTested] = useState(false),
    [filter, setFilter] = useState("All activities");
  const outcome = plantOutcome(sun, water);
  return (
    <>
      <div className="rx-tabs" role="tablist" aria-label="Discovery categories">
        {[
          "All activities",
          "Plants & living things",
          "Matter & materials",
          "Weather & earth",
          "Design & make",
        ].map((t) => (
          <button
            role="tab"
            aria-selected={filter === t}
            key={t}
            className={t === filter ? "active" : ""}
            onClick={() => {
              setFilter(t);
              if (t !== "All activities" && t !== "Plants & living things")
                notify(
                  `${t}: try the sample science questions below. The plant experiment stays open.`,
                );
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="rx-lab-layout">
        <section className="rx-panel rx-experiment">
          <div className="rx-lab-scene">
            <div>
              <h2>Grow your own little world</h2>
              <p>
                Explore how plants grow. Change the conditions and see what
                happens!
              </p>
            </div>
            <Mascot className="rx-scientist" />
            <div className="rx-plant-stages">
              <div>
                <Plant tiny height={30} />
                <span>
                  <strong>Day 1</strong>A tiny seed
                </span>
              </div>
              <ArrowRight />
              <div>
                <Plant height={60} />
                <span>
                  <strong>Day 4</strong>A sprout appears
                </span>
              </div>
              <ArrowRight />
              <div>
                <Plant
                  height={tested ? outcome.height : 100}
                  healthy={!tested || outcome.healthy}
                />
                <span>
                  <strong>Day 10</strong>
                  {tested ? outcome.title : "Bigger leaves!"}
                </span>
              </div>
            </div>
          </div>
          <div className="rx-lab-sliders">
            <label>
              <Sun />
              <strong>Sunlight</strong>
              <input
                aria-label="Sunlight"
                type="range"
                min="0"
                max="100"
                value={sun}
                onChange={(e) => {
                  setSun(+e.target.value);
                  setTested(false);
                }}
              />
              <span>{sun}%</span>
            </label>
            <label>
              <Droplets />
              <strong>Water</strong>
              <input
                aria-label="Water"
                type="range"
                min="0"
                max="100"
                value={water}
                onChange={(e) => {
                  setWater(+e.target.value);
                  setTested(false);
                }}
              />
              <span>{water}%</span>
            </label>
          </div>
          <div className="rx-prediction">
            <h3>What happens next?</h3>
            <div className="rx-prediction-options">
              {[
                "The plant gets taller",
                "More leaves grow",
                "The leaves turn yellow",
                "It stays the same",
              ].map((p, i) => (
                <button
                  key={p}
                  className={prediction === i ? "selected" : ""}
                  aria-pressed={prediction === i}
                  onClick={() => {
                    setPrediction(i);
                    setTested(false);
                  }}
                >
                  <span>{["🌱", "🌿", "🍂", "🪴"][i]}</span>
                  {p}
                  {prediction === i && <CheckCircle2 size={15} />}
                </button>
              ))}
              <Primary onClick={() => setTested(true)}>Test my idea</Primary>
            </div>
            {tested && (
              <div className="rx-lab-result" role="status">
                <Sprout />
                <div>
                  <strong>{outcome.title}</strong>
                  <p>
                    {outcome.detail} Your prediction:{" "}
                    {
                      [
                        "the plant gets taller",
                        "more leaves grow",
                        "leaves turn yellow",
                        "it stays the same",
                      ][prediction]
                    }
                    .
                  </p>
                </div>
              </div>
            )}
          </div>
          <small className="rx-model-note">
            A simplified learning simulation, not a prediction of a real plant’s
            growth.
          </small>
        </section>
        <aside className="rx-panel rx-curious-rexy">
          <div className="rx-curious-heading">
            <Mascot />
            <strong>Curious Rexy</strong>
          </div>
          <p className="rx-thought-bubble">
            What do you notice about the leaves?
          </p>
          <button
            className="rx-soft-button"
            onClick={() =>
              speak(
                "Look at the leaves. Can you describe their colour, shape and size?",
              )
            }
          >
            <Lightbulb />
            Give me a clue
          </button>
          <button
            className="rx-soft-button"
            onClick={() =>
              notify("Try drawing the plant on the Rexy Live whiteboard.")
            }
          >
            <Pencil />
            Draw my idea
          </button>
          <button
            className="rx-soft-button"
            onClick={() =>
              speak(
                "What changes when you adjust only the water? Try keeping sunlight the same.",
              )
            }
          >
            <BookOpen />
            Ask another question
          </button>
          <Wave />
          <button
            className="rx-mic"
            aria-label="Voice is not connected"
            onClick={() =>
              notify(
                "Voice conversations are not connected. Use the experiment controls or read the prompts.",
              )
            }
          >
            <Mic />
          </button>
          <small>
            Little questions.
            <br />
            Wonderful discoveries.
          </small>
        </aside>
      </div>
      <div className="rx-panel rx-lab-more">
        <h3>More discovery lab activities</h3>
        <div>
          {[
            {
              title: "Build a habitat",
              desc: "Design a home for an animal",
              icon: Leaf,
              color: "green",
            },
            {
              title: "Shape detective",
              desc: "Find shapes in the world around you",
              icon: Blocks,
              color: "purple",
            },
            {
              title: "Weather watcher",
              desc: "Explore rain, wind and clouds",
              icon: CloudSun,
              color: "blue",
            },
          ].map((item, i) => (
            <button key={item.title} onClick={() => start("science")}>
              <div className={`rx-mini-landscape scene-${i}`}>
                <item.icon />
              </div>
              <span>
                <item.icon size={18} />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.desc}</small>
                </span>
                <ChevronRight />
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
function DrawingBoard({
  color,
  tool,
  clearToken,
  undoToken,
}: {
  color: string;
  tool: "pen" | "eraser";
  clearToken: number;
  undoToken: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null),
    drawing = useRef(false),
    history = useRef<ImageData[]>([]);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    history.current = [];
  }, [clearToken]);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const last = history.current.pop();
    if (ctx && last) ctx.putImageData(last, 0, 0);
  }, [undoToken]);
  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const c = event.currentTarget;
    const r = c.getBoundingClientRect();
    return {
      x: ((event.clientX - r.left) * c.width) / r.width,
      y: ((event.clientY - r.top) * c.height) / r.height,
    };
  }
  return (
    <canvas
      ref={ref}
      width={1000}
      height={680}
      aria-label="Drawing whiteboard. Use a pointer or touch to sketch your solution."
      onPointerDown={(e) => {
        const ctx = e.currentTarget.getContext("2d");
        if (!ctx) return;
        history.current.push(ctx.getImageData(0, 0, 1000, 680));
        if (history.current.length > 12) history.current.shift();
        const p = point(e);
        drawing.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
        ctx.lineWidth = tool === "eraser" ? 35 : 6;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }}
      onPointerMove={(e) => {
        if (!drawing.current) return;
        const ctx = e.currentTarget.getContext("2d");
        const p = point(e);
        ctx?.lineTo(p.x, p.y);
        ctx?.stroke();
      }}
      onPointerUp={() => (drawing.current = false)}
      onPointerCancel={() => (drawing.current = false)}
    />
  );
}
function LiveTutor({
  speak,
  notify,
}: {
  speak: (t: string) => void;
  notify: (t: string) => void;
}) {
  const [helper, setHelper] = useState("Ten frame"),
    [color, setColor] = useState("#4530c5"),
    [tool, setTool] = useState<"pen" | "eraser">("pen"),
    [clear, setClear] = useState(0),
    [undo, setUndo] = useState(0),
    [text, setText] = useState(""),
    [mode, setMode] = useState("Text"),
    [messages, setMessages] = useState([
      { role: "rexy", text: "Can we make a ten first?" },
      { role: "student", text: "I think 12 can be 10 and 2!" },
      { role: "rexy", text: "Great strategy! Tell me what you tried." },
    ]);
  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const reply = tutorReply(text, "ten");
    setMessages((p) => [
      ...p.slice(-5),
      { role: "student", text },
      { role: "rexy", text: reply },
    ]);
    setText("");
    speak(reply);
  }
  return (
    <div className="rx-live-layout">
      <aside className="rx-live-chat">
        <div className="rx-portrait">
          <Mascot alt="Rexy, your blue dinosaur practice buddy" />
          <button
            onClick={() =>
              speak("Let’s make a ten first. Twelve can be ten and two.")
            }
            aria-label="Read Rexy's example aloud"
          >
            <Volume2 size={17} />
          </button>
        </div>
        <span className="rx-ready">
          <i />
          Ready when you are
        </span>
        <div className="rx-conversation" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`rx-message ${m.role}`}>
              {m.role === "rexy" ? (
                <Mascot />
              ) : (
                <span className="rx-child-avatar">🧑🏻</span>
              )}
              <p>{m.text}</p>
            </div>
          ))}
        </div>
        <span className="rx-live-typing" aria-hidden="true">
          •••
        </span>
      </aside>
      <div className="rx-whiteboard">
        <div className="rx-draw-toolbar">
          <span className="rx-draw-grip">⁙</span>
          <button
            className={tool === "pen" ? "active" : ""}
            aria-label="Draw with pen"
            aria-pressed={tool === "pen"}
            onClick={() => setTool("pen")}
          >
            <Pencil />
          </button>
          <button
            className={tool === "eraser" ? "active" : ""}
            aria-label="Use eraser"
            aria-pressed={tool === "eraser"}
            onClick={() => setTool("eraser")}
          >
            <span className="rx-eraser-icon" />
          </button>
          <span className="rx-tool-divider" />
          {["#ec4899", "#6236ed", "#20c7d4", "#8aa8de", "#41bd92"].map((c) => (
            <button
              key={c}
              className={`rx-color ${color === c ? "selected" : ""}`}
              style={{ background: c }}
              aria-label={`Pen colour ${c}`}
              aria-pressed={color === c}
              onClick={() => {
                setColor(c);
                setTool("pen");
              }}
            />
          ))}
          <span className="rx-tool-divider" />
          <button
            aria-label="Undo last drawing stroke"
            onClick={() => setUndo((v) => v + 1)}
          >
            <Undo2 />
          </button>
          <button
            aria-label="Clear whiteboard"
            onClick={() => setClear((v) => v + 1)}
          >
            <Trash2 />
          </button>
        </div>
        <div className="rx-board-surface">
          <div className="rx-math-example">
            <div className="rx-hand-equation">
              12 + 6 = <span>18</span>
            </div>
            {helper === "Ten frame" ? (
              <div className="rx-tenframes">
                {[10, 8].map((n, i) => (
                  <div className="rx-tenframe" key={i}>
                    {Array.from({ length: 10 }, (_, j) => (
                      <span key={j}>
                        {j < n && (
                          <i className={i === 1 && j >= 2 ? "pink" : ""} />
                        )}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            ) : helper === "Number line" ? (
              <div className="rx-number-line">
                {Array.from({ length: 9 }, (_, i) => (
                  <span
                    key={i}
                    className={i === 0 || i === 8 ? "selected" : ""}
                  >
                    {10 + i}
                  </span>
                ))}
              </div>
            ) : helper === "Number bonds" ? (
              <div className="rx-number-bonds">
                <span>18</span>
                <div>
                  <i>10</i>
                  <i>8</i>
                </div>
              </div>
            ) : (
              <p className="rx-draw-prompt">Show your thinking here…</p>
            )}
            <div className="rx-hand-working">10 + 2 + 6</div>
          </div>
          <DrawingBoard
            color={color}
            tool={tool}
            clearToken={clear}
            undoToken={undo}
          />
        </div>
      </div>
      <aside className="rx-thinking-tools rx-panel">
        <h3>My thinking tools</h3>
        {[
          {
            label: "Give me a hint",
            icon: Lightbulb,
            text: tutorReply("hint", "ten"),
          },
          {
            label: "Try it with blocks",
            icon: Blocks,
            text: "Try making one group of ten blocks and another group of eight.",
          },
          {
            label: "Show another way",
            icon: BookOpen,
            text: "Start at twelve on a number line. Make six jumps forward. Where do you land?",
          },
          {
            label: "Slow it down",
            icon: Heart,
            text: "Take a breath. There is no rush. Start with ten, then count the extra counters.",
          },
        ].map((item) => (
          <button
            className="rx-soft-button"
            key={item.label}
            onClick={() => {
              setMessages((p) => [...p, { role: "rexy", text: item.text }]);
              speak(item.text);
            }}
          >
            <item.icon />
            {item.label}
            <ChevronRight size={14} />
          </button>
        ))}
        <hr />
        <h3>Math helpers</h3>
        {["Ten frame", "Number line", "Number bonds", "Draw it"].map((h, i) => (
          <button
            key={h}
            className={`rx-soft-button ${helper === h ? "selected" : ""}`}
            onClick={() => {
              setHelper(h);
              if (i === 3) setMode("Draw");
            }}
          >
            {[<Blocks />, <ArrowRight />, <Plus />, <Pencil />][i]}
            {h}
          </button>
        ))}
      </aside>
      <form className="rx-live-composer" onSubmit={send}>
        <button
          type="button"
          className="rx-mic"
          aria-label="Voice is not connected"
          onClick={() =>
            notify(
              "Live voice is not connected. Use Text or Draw to explore this practice example.",
            )
          }
        >
          <Mic />
        </button>
        <div className="rx-mode-switch">
          {["Voice", "Text", "Draw"].map((m) => (
            <button
              key={m}
              type="button"
              className={mode === m ? "active" : ""}
              onClick={() => {
                if (m === "Voice") {
                  notify("Voice is not connected in this preview.");
                  return;
                }
                setMode(m);
                if (m === "Draw") setHelper("Draw it");
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <input
          aria-label="Ask Rexy about the example"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={300}
          placeholder="Ask, think, or sketch…"
        />
        <button className="rx-send" aria-label="Send your answer">
          <ArrowUp />
        </button>
      </form>
      <p className="rx-live-disclosure">
        Guided example · Authored responses · No live AI or microphone recording
      </p>
    </div>
  );
}
function StoryStudio({
  speak,
  notify,
}: {
  speak: (t: string) => void;
  notify: (t: string) => void;
}) {
  const [page, setPage] = useState(2),
    [tab, setTab] = useState("Read with Rexy"),
    [vocab, setVocab] = useState(false),
    [prediction, setPrediction] = useState<number | null>(null),
    [ending, setEnding] = useState(() => localRead("rexy-story-ending", "")),
    [character, setCharacter] = useState("Lily & Rexy");
  return (
    <>
      <div className="rx-tabs" role="tablist" aria-label="Story mode">
        {["Read with Rexy", "Tell my story", "New words"].map((t, i) => (
          <button
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? "active" : ""}
            key={t}
            onClick={() => setTab(t)}
          >
            {[<BookOpen />, <WandSparkles />, <Bookmark />][i]}
            {t}
          </button>
        ))}
      </div>
      {tab === "Read with Rexy" ? (
        <div className="rx-story-layout">
          <section className="rx-book">
            <div className="rx-story-picture">
              <img
                src={`${art}story.webp`}
                alt="Lily and Rexy gently planting a small sprout in a sunlit garden"
              />
              <h2>The Seed That Wouldn’t Give Up</h2>
              <div className="rx-story-caption">
                <p>
                  {storyPages[page].split(/(sprout)/gi).map((part, i) =>
                    part.toLowerCase() === "sprout" ? (
                      <button
                        key={i}
                        onClick={() => setVocab((v) => !v)}
                        aria-expanded={vocab}
                      >
                        {part}
                      </button>
                    ) : (
                      part
                    ),
                  )}
                </p>
              </div>
              {vocab && (
                <div className="rx-vocabulary">
                  <button
                    className="rx-icon-button"
                    onClick={() =>
                      speak("Sprout. A young plant that begins to grow.")
                    }
                    aria-label="Hear sprout pronounced"
                  >
                    <Volume2 />
                  </button>
                  <h3>sprout</h3>
                  <small>/spraʊt/</small>
                  <p>A young plant that begins to grow.</p>
                  <Plant tiny height={40} />
                </div>
              )}
            </div>
            <div className="rx-book-controls">
              <button
                className="rx-round"
                disabled={page === 0}
                aria-label="Previous story page"
                onClick={() => {
                  setPage((p) => p - 1);
                  setVocab(false);
                }}
              >
                <ChevronLeft />
              </button>
              <strong>
                Page {page + 1} of {storyPages.length}
              </strong>
              <button
                className="rx-round"
                disabled={page === storyPages.length - 1}
                aria-label="Next story page"
                onClick={() => {
                  setPage((p) => p + 1);
                  setVocab(false);
                }}
              >
                <ChevronRight />
              </button>
              <span />
              <button
                className="rx-soft-button"
                onClick={() => speak(storyPages[page])}
              >
                <Volume2 />
                Listen
              </button>
              <button
                className="rx-soft-button"
                onClick={() => {
                  setVocab(true);
                  speak(
                    "Take turns reading a sentence. What do you think Lily is feeling?",
                  );
                }}
              >
                <BookOpen />
                Read together
              </button>
            </div>
          </section>
          <aside className="rx-story-side">
            <section className="rx-panel">
              <h3>What might happen next?</h3>
              <div className="rx-story-predictions">
                {[
                  {
                    icon: "🌻",
                    text: "The sprout keeps growing into a tall flower.",
                  },
                  { icon: "🐦", text: "A bird comes to visit the sprout." },
                  {
                    icon: "🌦️",
                    text: "It starts to rain and the sprout gets bigger.",
                  },
                ].map((p, i) => (
                  <button
                    key={p.text}
                    className={prediction === i ? "selected" : ""}
                    onClick={() => setPrediction(i)}
                  >
                    <span>{p.icon}</span>
                    {p.text}
                    <i>{prediction === i && <Check size={12} />}</i>
                  </button>
                ))}
              </div>
              <button
                className="rx-soft-button full"
                onClick={() =>
                  notify(
                    prediction === null
                      ? "Choose a prediction first. What clues helped you?"
                      : "Lovely prediction! Tell someone which clues in the picture helped you think of it.",
                  )
                }
              >
                <Send />
                Explain my idea
              </button>
            </section>
            <section className="rx-panel">
              <h3>Create your own version</h3>
              <div className="rx-create-options">
                <button onClick={() => setTab("Tell my story")}>
                  <span>🦊</span>Choose a character
                  <ChevronRight />
                </button>
                <button
                  onClick={() => {
                    setTab("Tell my story");
                    notify("Use the story builder to imagine a new scene.");
                  }}
                >
                  <Palette />
                  Imagine a scene
                  <ChevronRight />
                </button>
                <button onClick={() => setTab("Tell my story")}>
                  <Pencil />
                  Write my ending
                  <ChevronRight />
                </button>
              </div>
            </section>
          </aside>
        </div>
      ) : tab === "Tell my story" ? (
        <section className="rx-story-builder rx-panel">
          <div>
            <span className="rx-eyebrow">Your imagination, your adventure</span>
            <h2>What happens in your story?</h2>
            <p>
              Choose a character, imagine a place, and write a new ending for
              Lily and Rexy.
            </p>
            <label>
              My main character
              <select
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
              >
                <option>Lily & Rexy</option>
                <option>A curious fox</option>
                <option>A brave little butterfly</option>
                <option>A tiny talking seed</option>
              </select>
            </label>
            <p className="rx-story-character">Starring: {character}</p>
            <label>
              My story ending
              <textarea
                value={ending}
                onChange={(e) => setEnding(e.target.value)}
                maxLength={1200}
                placeholder="One sunny morning, Rexy noticed…"
              />
            </label>
            <Primary
              onClick={() =>
                notify(
                  localSave("rexy-story-ending", ending)
                    ? "Your story is saved on this device."
                    : "This browser could not save your story. Copy it before leaving.",
                )
              }
            >
              Save my story
            </Primary>
            <small>
              Saved only in this browser. No image or voice generation.
            </small>
          </div>
          <img src={`${art}story.webp`} alt="Rexy and Lily in their garden" />
        </section>
      ) : (
        <div className="rx-word-grid">
          {[
            {
              word: "sprout",
              meaning: "A young plant that has just begun to grow.",
              icon: "🌱",
            },
            {
              word: "curious",
              meaning: "Wanting to find out or learn something.",
              icon: "🔎",
            },
            {
              word: "patient",
              meaning: "Able to wait calmly while something takes time.",
              icon: "⏳",
            },
            {
              word: "observe",
              meaning: "To look carefully and notice details.",
              icon: "👀",
            },
          ].map((w) => (
            <button
              className="rx-panel"
              key={w.word}
              onClick={() => speak(`${w.word}. ${w.meaning}`)}
            >
              <span>{w.icon}</span>
              <h2>{w.word}</h2>
              <p>{w.meaning}</p>
              <Volume2 size={20} />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
function ParentInsights({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <>
      <Stats parent />
      <div className="rx-parent-layout">
        <section className="rx-panel rx-parent-chart">
          <div className="rx-panel-title">
            <h3>Sample weekly activity</h3>
            <div className="rx-chart-legend">
              <span className="blue">Math</span>
              <span className="purple">Reading</span>
              <span className="green">Science</span>
            </div>
          </div>
          <WeeklyChart parent />
          <div className="rx-chart-flourish" />
        </section>
        <section className="rx-panel rx-reflection">
          <h3>Rexy’s weekly reflection</h3>
          <div className="rx-reflection-scene">
            <Mascot />
            <p>
              Your explorer is explaining how they solve addition problems. Try
              counting everyday objects together.
            </p>
          </div>
          <button className="rx-next-step" onClick={() => navigate("story")}>
            <BookOpen />
            <span>
              <small>Suggested next step</small>
              <strong>10-minute family reading ritual</strong>
              <p>
                Read a short story together and talk about what the characters
                think and feel.
              </p>
            </span>
            <ChevronRight />
          </button>
        </section>
        <section className="rx-panel rx-skill-focus">
          <h3>Skill focus this week</h3>
          {[
            {
              title: "Addition strategies",
              desc: "Using different ways to find the answer",
              color: "blue",
              status: "Growing",
              value: 65,
              icon: Plus,
            },
            {
              title: "Reading comprehension",
              desc: "Understanding and talking about stories",
              color: "purple",
              status: "Practising",
              value: 53,
              icon: BookOpen,
            },
            {
              title: "Plant needs",
              desc: "Identifying what helps plants to grow",
              color: "green",
              status: "Exploring",
              value: 74,
              icon: Leaf,
            },
          ].map((s) => (
            <div className="rx-skill-row" key={s.title}>
              <span className={`rx-square-icon ${s.color}`}>
                <s.icon />
              </span>
              <div>
                <strong>{s.title}</strong>
                <small>{s.desc}</small>
              </div>
              <Progress value={s.value} color={s.color} />
              <span className={s.color}>{s.status}</span>
            </div>
          ))}
        </section>
        <section className="rx-panel rx-learning-notes">
          <div className="rx-panel-title">
            <h3>What my child learned</h3>
            <button onClick={() => navigate("planner")}>See all</button>
          </div>
          {[
            {
              day: "Today",
              text: "Read a story about ocean animals and shared their favourite part.",
              icon: BookOpen,
              color: "purple",
            },
            {
              day: "Yesterday",
              text: "Practised addition using groups of objects.",
              icon: Plus,
              color: "blue",
            },
            {
              day: "Thu",
              text: "Explored how plants grow and what they need.",
              icon: Leaf,
              color: "green",
            },
          ].map((n) => (
            <div className="rx-note-row" key={n.day}>
              <span className={`rx-square-icon ${n.color}`}>
                <n.icon />
              </span>
              <small>{n.day}</small>
              <p>{n.text}</p>
            </div>
          ))}
          <button
            className="rx-soft-button full"
            onClick={() => navigate("planner")}
          >
            <BookOpen />
            Review learning plan
            <ChevronRight />
          </button>
        </section>
      </div>
      <p className="rx-page-disclosure">
        <Info size={14} />
        These are example insights to demonstrate the parent dashboard, not a
        report about your child.
      </p>
    </>
  );
}
function Planner({
  plan,
  setPlan,
  notify,
}: {
  plan: Plan;
  setPlan: React.Dispatch<React.SetStateAction<Plan>>;
  notify: (t: string) => void;
}) {
  const [day, setDay] = useState(1);
  const names = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  function toggle(key: "reminders" | "readAloud" | "breaks" | "review") {
    setPlan((p) => ({ ...p, [key]: !p[key] }));
  }
  return (
    <>
      <div className="rx-planner-layout">
        <section className="rx-panel rx-week-plan">
          <div className="rx-panel-title">
            <h3>Weekly plan</h3>
            <span className="rx-week-label">
              <CalendarDays size={15} />
              My usual school week
            </span>
          </div>
          <div className="rx-week-columns">
            {names.map((name, i) => (
              <div
                className={`rx-day ${day === i ? "selected" : ""}`}
                key={name}
              >
                <button className="rx-day-title" onClick={() => setDay(i)}>
                  <strong>{name}</strong>
                  <span>{60 + plan.extras[i] * 5} min</span>
                </button>
                {planActivities.map((a, j) => (
                  <button
                    className={`rx-plan-block ${a.color}`}
                    key={j}
                    onClick={() =>
                      notify(
                        `${name}: ${a.label} · ${a.minutes} minutes. Add a short activity using the button below.`,
                      )
                    }
                  >
                    {
                      [
                        <Sparkles />,
                        <Blocks />,
                        <BookOpen />,
                        <Flame />,
                        <FlaskConical />,
                        <Compass />,
                      ][j]
                    }
                    <span>
                      {a.label}
                      <small>{a.minutes} min</small>
                    </span>
                  </button>
                ))}
                {Array.from({ length: plan.extras[i] }, (_, j) => (
                  <button
                    key={j}
                    className="rx-plan-block green"
                    onClick={() =>
                      setPlan((p) => ({
                        ...p,
                        extras: p.extras.map((n, k) => (k === i ? n - 1 : n)),
                      }))
                    }
                  >
                    <Leaf />
                    <span>
                      Free choice<small>5 min · tap to remove</small>
                    </span>
                  </button>
                ))}
                <button
                  className="rx-add-activity"
                  disabled={plan.extras[i] >= 3}
                  onClick={() =>
                    setPlan((p) => ({
                      ...p,
                      extras: p.extras.map((n, k) =>
                        k === i ? Math.min(3, n + 1) : n,
                      ),
                    }))
                  }
                >
                  <Plus size={13} />
                  Add activity
                </button>
              </div>
            ))}
          </div>
          <p className="rx-model-note">
            Warm-up, focused activities, a movement break, and time to reflect.
            Tap a day to focus on it.
          </p>
        </section>
        <aside className="rx-family-controls">
          <section className="rx-panel">
            <div className="rx-control-row">
              <Bell />
              <div>
                <h3>Schedule reminders</h3>
                <p>Keep your preferred reminder setting.</p>
              </div>
              <button
                role="switch"
                aria-checked={plan.reminders}
                aria-label="Schedule reminders"
                className="rx-toggle"
                onClick={() => toggle("reminders")}
              />
            </div>
            <small>
              Preference only. Push notifications are not connected.
            </small>
          </section>
          <section className="rx-panel">
            <div className="rx-panel-title">
              <h3>
                <Settings size={17} />
                Family controls
              </h3>
              <span className="rx-sample-inline">On this device</span>
            </div>
            {[
              {
                key: "readAloud" as const,
                title: "Read-aloud",
                desc: "Let Rexy read content aloud",
                icon: Volume2,
                color: "blue",
              },
              {
                key: "breaks" as const,
                title: "Break reminders",
                desc: "Include gentle movement breaks",
                icon: Flame,
                color: "amber",
              },
              {
                key: "review" as const,
                title: "Parent review",
                desc: "Keep review in the family routine",
                icon: BookOpen,
                color: "pink",
              },
            ].map((c) => (
              <div className="rx-control-row" key={c.key}>
                <span className={`rx-square-icon ${c.color}`}>
                  <c.icon />
                </span>
                <div>
                  <strong>{c.title}</strong>
                  <p>{c.desc}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={plan[c.key]}
                  aria-label={c.title}
                  className="rx-toggle"
                  onClick={() => toggle(c.key)}
                />
              </div>
            ))}
            <div className="rx-control-row">
              <Mic />
              <div>
                <strong>Microphone</strong>
                <p>Not connected. No recording.</p>
              </div>
              <LockKeyhole size={17} />
            </div>
          </section>
          <section className="rx-control-assurance">
            <ShieldCheck />
            <div>
              <strong>You’re in control</strong>
              <p>
                Your plan stays in this browser. Cloud accounts and cross-device
                sync are not connected yet.
              </p>
            </div>
          </section>
        </aside>
        <section className="rx-panel rx-daily-goal">
          <Target />
          <div>
            <h3>Daily goal</h3>
            <p>Set a comfortable goal for focused learning time.</p>
            <label>
              <input
                aria-label="Daily learning goal"
                type="range"
                min="15"
                max="90"
                step="5"
                value={plan.goal}
                onChange={(e) =>
                  setPlan((p) => ({ ...p, goal: +e.target.value }))
                }
              />
              <strong>
                {plan.goal} min<small>per day</small>
              </strong>
            </label>
            <span>
              15 min <span>30 min</span>
              <span>60 min</span>
              <span>90 min</span>
            </span>
          </div>
        </section>
        <section className="rx-panel rx-session-time">
          <Clock3 />
          <div>
            <h3>Session time</h3>
            <p>When do you usually like to learn?</p>
            <input
              aria-label="Preferred session time"
              type="time"
              value={plan.time}
              onChange={(e) => setPlan((p) => ({ ...p, time: e.target.value }))}
            />
          </div>
        </section>
      </div>
      <div className="rx-save-plan">
        <span>
          <ShieldCheck size={15} />
          Saved locally when you choose Save
        </span>
        <Primary
          onClick={() =>
            notify(
              localSave("rexy-family-plan-v3", plan)
                ? "Your family plan is saved on this device."
                : "Saving is unavailable in this browser. Keep this page open to retain your plan.",
            )
          }
        >
          <CalendarDays size={17} />
          Save family plan
        </Primary>
      </div>
    </>
  );
}
function Achievements({
  completed,
  navigate,
}: {
  completed: string[];
  navigate: (p: Page) => void;
}) {
  return (
    <>
      <section className="rx-achievement-hero">
        <Mascot />
        <div>
          <span className="rx-eyebrow">Every little effort matters</span>
          <h2>Look how far curiosity can take you.</h2>
          <p>
            Keep asking. Keep trying. Your next discovery is just around the
            corner.
          </p>
          <Primary onClick={() => navigate("path")}>
            Find my next adventure
          </Primary>
        </div>
      </section>
      <div className="rx-badge-grid">
        {[
          {
            id: "math",
            title: "Number Explorer",
            icon: Blocks,
            desc: "Finish a maths practice adventure.",
          },
          {
            id: "reading",
            title: "Story Seeker",
            icon: BookOpen,
            desc: "Finish a reading practice adventure.",
          },
          {
            id: "science",
            title: "Wonder Maker",
            icon: FlaskConical,
            desc: "Finish a science practice adventure.",
          },
        ].map((b, i) => (
          <section
            className={`rx-panel rx-badge ${completed.includes(b.id) ? "earned" : ""}`}
            key={b.id}
          >
            <span className={`rx-big-medal medal-${i}`}>
              <b.icon />
            </span>
            <h3>{b.title}</h3>
            <p>{b.desc}</p>
            <span className="rx-badge-status">
              {completed.includes(b.id) ? (
                <>
                  <CheckCircle2 size={15} />
                  Earned on this device
                </>
              ) : (
                <>
                  <LockKeyhole size={15} />
                  Your next possibility
                </>
              )}
            </span>
          </section>
        ))}
      </div>
      <p className="rx-page-disclosure">
        Practice achievements are stored in this browser. The dashboard’s sample
        weekly metrics are illustrative.
      </p>
    </>
  );
}
function Quiz({
  subject,
  onClose,
  onFinish,
}: {
  subject: Subject;
  onClose: () => void;
  onFinish: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    [q, setQ] = useState(0),
    [answer, setAnswer] = useState<number | null>(null),
    [checked, setChecked] = useState(false),
    [hint, setHint] = useState(false),
    [score, setScore] = useState(0),
    [done, setDone] = useState(false);
  const question = questions[subject][q];
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog ref={ref} className="rx-quiz-dialog" onCancel={onClose}>
      <div className="rx-quiz-header">
        <span
          className={`rx-square-icon ${subjects.find((s) => s.id === subject)!.color}`}
        >
          <SubjectIcon subject={subject} />
        </span>
        <div>
          <strong>{subjects.find((s) => s.id === subject)!.name}</strong>
          <small>Grade 2 · Authored practice</small>
        </div>
        <button
          className="rx-icon-button"
          aria-label="Close practice"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      {done ? (
        <div className="rx-quiz-complete">
          <span className="rx-big-medal">
            <Trophy />
          </span>
          <h2>You kept exploring!</h2>
          <p>
            {score} of {questions[subject].length} answers correct. Every try
            helped you learn.
          </p>
          <p>Your adventure badge is saved on this device.</p>
          <Primary onClick={onClose}>Keep discovering</Primary>
        </div>
      ) : (
        <>
          <Progress value={(q / questions[subject].length) * 100} />
          <div className="rx-quiz-body">
            <span className="rx-eyebrow">
              Question {q + 1} of {questions[subject].length}
            </span>
            <h2>{question.prompt}</h2>
            {question.visual === "stars" && (
              <div className="rx-quiz-stars">
                {Array.from({ length: 8 }, (_, i) => (
                  <Star key={i} className={i < 5 ? "filled" : ""} />
                ))}
              </div>
            )}
            {question.visual === "ten" && (
              <div className="rx-quiz-counts">
                <span>10</span>
                <Plus />
                <span>2</span>
                <Plus />
                <span>6</span>
              </div>
            )}
            <div className="rx-quiz-options">
              {question.answers.map((a, i) => (
                <button
                  key={a}
                  disabled={checked}
                  className={`${answer === i ? "selected" : ""} ${checked && i === question.correct ? "correct" : ""} ${checked && answer === i && i !== question.correct ? "incorrect" : ""}`}
                  onClick={() => setAnswer(i)}
                >
                  <span>{String.fromCharCode(65 + i)}</span>
                  {a}
                  {checked && i === question.correct && <CheckCircle2 />}
                </button>
              ))}
            </div>
            {hint && !checked && (
              <p className="rx-quiz-hint">
                <Lightbulb />
                {question.hint}
              </p>
            )}
            {checked && (
              <p
                className={`rx-answer-feedback ${answer === question.correct ? "correct" : "try-again"}`}
                role="status"
              >
                <strong>
                  {answer === question.correct
                    ? "You’ve got it!"
                    : "Let’s learn from that."}
                </strong>
                {question.explain}
              </p>
            )}
          </div>
          <div className="rx-quiz-footer">
            <button
              className="rx-soft-button"
              onClick={() => setHint((v) => !v)}
            >
              <Lightbulb />A little hint
            </button>
            {checked ? (
              <Primary
                onClick={() => {
                  if (q === questions[subject].length - 1) {
                    setDone(true);
                    onFinish();
                  } else {
                    setQ((v) => v + 1);
                    setAnswer(null);
                    setChecked(false);
                    setHint(false);
                  }
                }}
              >
                {q === questions[subject].length - 1
                  ? "Finish adventure"
                  : "Next discovery"}
              </Primary>
            ) : (
              <Primary
                disabled={answer === null}
                onClick={() => {
                  setChecked(true);
                  if (answer === question.correct) setScore((v) => v + 1);
                }}
              >
                Check my answer
              </Primary>
            )}
          </div>
        </>
      )}
    </dialog>
  );
}
function PreviewInfo({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog ref={ref} className="rx-info-dialog" onCancel={onClose}>
      <button
        className="rx-icon-button"
        aria-label="Close preview details"
        onClick={onClose}
      >
        <X />
      </button>
      <Mascot />
      <h2>A little peek at Rexy Learn</h2>
      <p>
        This version brings the reference designs to life with authored practice
        questions, an interactive whiteboard, stories, a plant experiment, and a
        family planner.
      </p>
      <ul>
        <li>Profiles, charts and weekly insights use sample data.</li>
        <li>
          Your practice badges, story ending and saved plan stay in this
          browser.
        </li>
        <li>
          Live AI, microphone/camera capture, account sign-in and cloud sync are
          not connected.
        </li>
        <li>Read-aloud uses your browser’s available speech voices.</li>
      </ul>
      <Primary onClick={onClose}>Let’s explore</Primary>
    </dialog>
  );
}
export default function RexyExperience() {
  const [page, setPage] = useState<Page>(currentPage),
    [drawer, setDrawer] = useState(false),
    [quiz, setQuiz] = useState<Subject | null>(null),
    [info, setInfo] = useState(false),
    [toast, setToast] = useState(""),
    [plan, setPlan] = useState<Plan>(() => ({
      ...defaultPlan,
      ...localRead<Partial<Plan>>("rexy-family-plan-v3", {}),
    })),
    [completed, setCompleted] = useState<string[]>(() =>
      localRead("rexy-completed-v3", []),
    ),
    [sound, setSound] = useState(false),
    [game, setGame] = useState(false),
    [phone, setPhone] = useState(false),
    [showInstall, setShowInstall] = useState(false);
  useEffect(() => {
    const pop = () => {
      setPage(currentPage());
      setDrawer(false);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(
    () => () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    [],
  );
  function navigate(next: Page) {
    setPage(next);
    setDrawer(false);
    setGame(false);
    const url = new URL(window.location.href);
    if (next === "overview") url.searchParams.delete("page");
    else url.searchParams.set("page", next);
    window.history.pushState({}, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function speak(text: string) {
    if (!plan.readAloud) {
      setToast("Read-aloud is off in your family plan.");
      return;
    }
    if (!("speechSynthesis" in window)) {
      setToast("Read-aloud is not available in this browser.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-CA";
    utterance.rate = 0.92;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
  function autoSpeak(text: string) {
    if (sound) speak(text);
  }
  function start(subject: Subject) {
    setQuiz(subject);
  }
  function finish() {
    if (!quiz) return;
    const next = [...new Set([...completed, quiz])];
    setCompleted(next);
    if (!localSave("rexy-completed-v3", next))
      setToast("Your badge is ready, but this browser could not save it.");
  }
  const title = titles[page];
  const isParent = page === "parent" || page === "planner";
  return (
    <div className={`rx-app ${phone ? "rx-phone-preview" : ""}`}>
      {phone && (
        <div className="rx-phone-preview-bar">
          <span>Phone layout preview</span>
          <button onClick={() => setPhone(false)}>
            <X size={16} />
            Back to full screen
          </button>
        </div>
      )}
      <div className="rx-shell">
        <aside className={`rx-sidebar ${drawer ? "open" : ""}`}>
          <button
            className="rx-logo"
            onClick={() => navigate("overview")}
            aria-label="Rexy Learn home"
          >
            <Mascot />
            <span>
              REXY <b>LEARN</b>
            </span>
          </button>
          <button
            className="rx-sidebar-close rx-icon-button"
            aria-label="Close navigation"
            onClick={() => setDrawer(false)}
          >
            <X />
          </button>
          <nav aria-label="Main navigation">
            {navigation.map((item) => (
              <button
                key={item.id}
                className={page === item.id ? "active" : ""}
                aria-current={page === item.id ? "page" : undefined}
                onClick={() => navigate(item.id)}
              >
                <item.icon size={19} />
                <span>{item.label}</span>
                {item.id === "live" && <i className="rx-nav-dot" />}
              </button>
            ))}
          </nav>
          <button
            className={`rx-play-link ${page === "games" ? "active" : ""}`}
            onClick={() => navigate("games")}
          >
            <Gamepad2 size={19} />
            The Play Lab <span>New</span>
          </button>
          <div className="rx-sidebar-world" />
          <p className="rx-sidebar-motto">
            Big curiosity.
            <br />
            Brighter
            <br />
            tomorrows.
          </p>
          <button className="rx-sidebar-help" onClick={() => setInfo(true)}>
            <HelpCircle size={17} />A little help
          </button>
        </aside>
        {drawer && (
          <button
            className="rx-drawer-shade"
            aria-label="Close navigation overlay"
            onClick={() => setDrawer(false)}
          />
        )}
        <div className="rx-workspace">
          <header className="rx-header">
            <div className="rx-header-left">
              <button
                className="rx-menu-button rx-icon-button"
                aria-label="Open navigation"
                onClick={() => setDrawer(true)}
              >
                <Menu />
              </button>
              <span className="rx-intelligence">
                <Sparkles size={20} />
                {isParent ? "Family learning space" : "Learning Intelligence"}
              </span>
            </div>
            <div className="rx-header-actions">
              <button className="rx-profile" onClick={() => setInfo(true)}>
                <span className="rx-child-avatar">🧑🏻</span>
                <span>Grade 2 explorer</span>
                <ChevronDown size={13} />
              </button>
              <span className="rx-location">
                <MapPin size={15} />
                Ontario
              </span>
              <button className="rx-sample-pill" onClick={() => setInfo(true)}>
                Sample data
                <Info size={11} />
              </button>
              <button
                className="rx-icon-button rx-notifications"
                aria-label="View notifications"
                onClick={() =>
                  setToast(
                    "You’re all set for a little discovery. Reminders are a local preference; push notifications are not connected.",
                  )
                }
              >
                <Bell size={18} />
                <i />
              </button>
              <button
                className="rx-icon-button"
                aria-label="Open family settings"
                onClick={() => navigate("planner")}
              >
                <Settings size={18} />
              </button>
            </div>
          </header>
          <div
            className={`rx-page-layout ${page === "overview" ? "with-tutor" : ""}`}
          >
            <main className={`rx-main page-${page}`} id="main-content">
              <div className="rx-page-heading">
                <div>
                  <span className="rx-mobile-brand">
                    <Mascot />
                    REXY <b>LEARN</b>
                  </span>
                  <h1>{title[0]}</h1>
                  <p>{title[1]}</p>
                </div>
                <div className="rx-heading-actions">
                  {page === "live" ? (
                    <span>
                      <Heart size={15} />
                      No pressure. We can try again.
                    </span>
                  ) : isParent ? (
                    <span className="rx-sample-inline">
                      Example family view
                    </span>
                  ) : (
                    <button
                      className="rx-text-button"
                      onClick={() => setPhone(!phone)}
                    >
                      Phone preview
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
              {page === "overview" && (
                <Overview navigate={navigate} start={start} />
              )}
              {page === "path" && (
                <LearningPath navigate={navigate} start={start} />
              )}
              {page === "lab" && (
                <DiscoveryLab speak={speak} notify={setToast} start={start} />
              )}
              {page === "live" && (
                <LiveTutor speak={autoSpeak} notify={setToast} />
              )}
              {page === "story" && (
                <StoryStudio speak={speak} notify={setToast} />
              )}
              {page === "parent" && <ParentInsights navigate={navigate} />}
              {page === "planner" && (
                <Planner plan={plan} setPlan={setPlan} notify={setToast} />
              )}
              {page === "achievements" && (
                <Achievements completed={completed} navigate={navigate} />
              )}
              {page === "games" &&
                (game ? (
                  <Suspense
                    fallback={
                      <div className="rx-panel rx-loading">
                        Preparing your rover adventure…
                      </div>
                    }
                  >
                    <RoverGame
                      onBack={() => setGame(false)}
                      childName="Explorer"
                    />
                  </Suspense>
                ) : (
                  <>
                    <section className="rx-hero rx-games-hero">
                      <div className="rx-hero-copy">
                        <span className="rx-eyebrow">
                          A world of playful possibilities
                        </span>
                        <h2>
                          Play a little.
                          <br />
                          Learn a lot.
                        </h2>
                        <p>
                          Make discoveries with numbers, stories and science.
                        </p>
                        <Primary onClick={() => setGame(true)}>
                          Launch the 3D rover
                        </Primary>
                      </div>
                    </section>
                    <SubjectCards onStart={start} />
                    <p className="rx-page-disclosure">
                      The rover game uses WebGL and works best on a desktop with
                      a keyboard. Subject adventures support touch.
                    </p>
                  </>
                ))}
              <footer className="rx-page-footer">
                <span>
                  <Mascot />
                  Little questions. Limitless possibilities.
                </span>
                <div>
                  <button onClick={() => setSound((s) => !s)}>
                    {sound ? <Volume2 size={14} /> : <VolumeX size={14} />}Tutor
                    read-aloud {sound ? "on" : "off"}
                  </button>
                  <button onClick={() => setShowInstall((v) => !v)}>
                    <Download size={14} />
                    Add to phone
                  </button>
                  <button onClick={() => setInfo(true)}>
                    About this preview
                  </button>
                </div>
              </footer>
              {showInstall && (
                <div className="rx-install-help" role="status">
                  Android Chrome: browser menu → Install app or Add to Home
                  screen. iPhone Safari: Share → Add to Home Screen. Install
                  availability depends on your browser.
                </div>
              )}
            </main>
            {page === "overview" && (
              <TutorRail
                onNavigate={navigate}
                speak={autoSpeak}
                notify={setToast}
              />
            )}
          </div>
        </div>
      </div>
      <nav className="rx-mobile-nav" aria-label="Phone navigation">
        {[
          { id: "overview", label: "Home", icon: Home },
          { id: "path", label: "Learn", icon: BookOpen },
          { id: "lab", label: "Discover", icon: Compass },
          { id: "story", label: "Stories", icon: Sparkles },
          { id: "parent", label: "Family", icon: Users },
        ].map((item) => (
          <button
            key={item.id}
            className={page === item.id ? "active" : ""}
            aria-current={page === item.id ? "page" : undefined}
            onClick={() => navigate(item.id as Page)}
          >
            <item.icon size={21} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      {toast && (
        <div className="rx-toast" role="status">
          <Sparkles size={18} />
          <span>{toast}</span>
          <button
            className="rx-icon-button"
            aria-label="Dismiss message"
            onClick={() => setToast("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {quiz && (
        <Quiz
          key={quiz}
          subject={quiz}
          onClose={() => setQuiz(null)}
          onFinish={finish}
        />
      )}
      {info && <PreviewInfo onClose={() => setInfo(false)} />}
    </div>
  );
}
