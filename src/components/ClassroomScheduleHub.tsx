import { apiFetch } from '../lib/release';
import React, { useState } from 'react';
import {
  GoogleClassroomCourse,
  ClassroomAssignment,
  ScheduleItem,
  AssignmentStatus
} from '../types/classroom';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Plus,
  Send,
  MessageCircle,
  Award,
  ChevronRight,
  Flame,
  X,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  childName: string;
  grade: string;
  courses: GoogleClassroomCourse[];
  initialAssignments: ClassroomAssignment[];
  initialSchedule: ScheduleItem[];
  onOpenPracticeWithSkill?: (skillCode: string) => void;
}

export const ClassroomScheduleHub: React.FC<Props> = ({
  childName,
  grade,
  courses,
  initialAssignments,
  initialSchedule,
  onOpenPracticeWithSkill,
}) => {
  const [activeTab, setActiveTab] = useState<'assignments' | 'schedule'>('assignments');
  const [assignments, setAssignments] = useState<ClassroomAssignment[]>(initialAssignments);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'todo' | 'submitted' | 'graded'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState('Just now');

  // Homework Helper Modal with Lumi
  const [selectedAssignmentForHelp, setSelectedAssignmentForHelp] = useState<ClassroomAssignment | null>(null);
  const [homeworkChatMessages, setHomeworkChatMessages] = useState<Array<{ sender: 'lumi' | 'student'; text: string }>>([]);
  const [homeworkInput, setHomeworkInput] = useState('');
  const [isLoadingLumi, setIsLoadingLumi] = useState(false);

  // Add Assignment / Activity Modal
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityType, setNewActivityType] = useState<ScheduleItem['type']>('extracurricular');
  const [newActivityStart, setNewActivityStart] = useState('16:00');
  const [newActivityEnd, setNewActivityEnd] = useState('17:00');
  const [newActivityDays, setNewActivityDays] = useState('Mon, Wed');
  const [newActivityNotes, setNewActivityNotes] = useState('');

  // Handle Sync with Google Classroom
  const handleSyncClassroom = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    }, 1200);
  };

  // Turn in assignment
  const handleTurnInAssignment = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'submitted',
              submittedAt: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            }
          : a
      )
    );
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
    });
  };

  // Open Lumi Homework Helper
  const handleOpenHomeworkHelper = (assignment: ClassroomAssignment) => {
    setSelectedAssignmentForHelp(assignment);
    setHomeworkChatMessages([
      {
        sender: 'lumi',
        text: `Hi ${childName}! I'm ready to help you with "${assignment.title}". What part would you like to tackle first?`,
      },
      {
        sender: 'lumi',
        text: `Tip: This assignment connects directly to Ontario expectation ${assignment.ontarioSkillCode || 'Curriculum Standards'}. Take your time, draw a quick picture or diagram, and ask me any questions!`,
      },
    ]);
  };

  // Send question in Homework Helper
  const handleSendHomeworkMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeworkInput.trim() || !selectedAssignmentForHelp) return;

    const query = homeworkInput;
    setHomeworkInput('');
    setHomeworkChatMessages((prev) => [...prev, { sender: 'student', text: query }]);
    setIsLoadingLumi(true);

    try {
      const res = await apiFetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Homework Assignment: "${selectedAssignmentForHelp.title}". Description: "${selectedAssignmentForHelp.description}". Student question: "${query}"`,
          studentAnswer: query,
          isCorrect: true,
          skillTitle: selectedAssignmentForHelp.title,
          curriculumCode: selectedAssignmentForHelp.ontarioSkillCode || 'Ontario Standards',
          grade,
          childName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setHomeworkChatMessages((prev) => [
          ...prev,
          { sender: 'lumi', text: data.tutorMessage || `Let's break this down step-by-step together!` },
        ]);
      }
    } catch (e) {
      setHomeworkChatMessages((prev) => [
        ...prev,
        {
          sender: 'lumi',
          text: `Great thinking! Try breaking the problem into two smaller steps: first identify what information the question gives you, then test out your idea with a quick diagram.`,
        },
      ]);
    } finally {
      setIsLoadingLumi(false);
    }
  };

  // Filtered assignments
  const filteredAssignments = assignments.filter((a) => {
    if (assignmentFilter === 'all') return true;
    if (assignmentFilter === 'todo') return a.status === 'assigned' || a.status === 'in_progress';
    if (assignmentFilter === 'submitted') return a.status === 'submitted';
    if (assignmentFilter === 'graded') return a.status === 'graded';
    return true;
  });

  // Add new activity to schedule
  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    const newItem: ScheduleItem = {
      id: 'sched-' + Date.now(),
      title: newActivityTitle,
      type: newActivityType,
      startTime: newActivityStart,
      endTime: newActivityEnd,
      daysOfWeek: newActivityDays.split(',').map((d) => d.trim()),
      icon: newActivityType === 'extracurricular' ? '🏒' : newActivityType === 'homework' ? '📚' : '🌟',
      notes: newActivityNotes,
      isCompletedToday: false,
    };

    setSchedule((prev) => [...prev, newItem].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    setShowAddScheduleModal(false);
    setNewActivityTitle('');
    setNewActivityNotes('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Banner: Google Classroom Sync & Child Progress Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-800 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden mb-6">
        <div className="absolute -right-12 -top-12 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-yellow-300" />
                Google Classroom & Schedule Hub
              </span>
              <span className="text-xs bg-emerald-400/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold border border-emerald-400/30">
                Connected
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black font-['Fredoka'] text-white mb-2">
              {childName}'s School Homework & Activity Balance
            </h1>
            <p className="text-sm text-indigo-100 max-w-xl leading-relaxed">
              Track assignments from <strong>TDSB Google Classroom</strong>, synced with {childName}'s after-school sports and extra-curricular schedule.
            </p>
          </div>

          {/* Sync status card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center shrink-0">
            <span className="text-[11px] text-indigo-200 font-mono mb-1">
              Synced: {lastSyncedTime}
            </span>
            <button
              type="button"
              onClick={handleSyncClassroom}
              disabled={isSyncing}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer font-['Fredoka']"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing Classroom...' : 'Sync Google Classroom'}
            </button>
          </div>
        </div>
      </div>

      {/* Subtab Selector: (1) Homework & Assignments vs (2) Structured Daily Schedule */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 font-['Fredoka'] ${
              activeTab === 'assignments'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Classroom Assignments ({assignments.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 font-['Fredoka'] ${
              activeTab === 'schedule'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>Daily Schedule & Sports Balance</span>
          </button>
        </div>

        {activeTab === 'schedule' && (
          <button
            type="button"
            onClick={() => setShowAddScheduleModal(true)}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer font-['Fredoka']"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Activity or Sport</span>
          </button>
        )}
      </div>

      {/* View 1: Classroom Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Courses Quick Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {course.room}
                  </span>
                  <h4 className="font-bold text-xs text-slate-800 mt-2 font-['Fredoka']">
                    {course.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{course.teacherName}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {(['all', 'todo', 'submitted', 'graded'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setAssignmentFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer uppercase tracking-wider ${
                  assignmentFilter === filter
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {filter === 'all'
                  ? 'All Assignments'
                  : filter === 'todo'
                  ? 'To Do / Due Soon'
                  : filter === 'submitted'
                  ? 'Turned In'
                  : 'Graded'}
              </button>
            ))}
          </div>

          {/* Assignments List */}
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => {
              const isDone = assignment.status === 'submitted' || assignment.status === 'graded';

              return (
                <div
                  key={assignment.id}
                  className={`bg-white rounded-3xl p-5 border-2 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isDone ? 'border-slate-200 bg-slate-50/50' : 'border-indigo-100 hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                        {assignment.courseName}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Due: <strong className="text-slate-800">{assignment.dueDate}</strong> ({assignment.dueTime})
                      </span>
                      {assignment.ontarioSkillCode && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Ontario {assignment.ontarioSkillCode}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-['Fredoka']">
                      {assignment.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {assignment.description}
                    </p>

                    {/* Teacher feedback if graded */}
                    {assignment.teacherFeedback && (
                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2 mt-2">
                        <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Teacher Feedback: </strong>
                          {assignment.teacherFeedback}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Status Pill */}
                  <div className="flex flex-wrap md:flex-col items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex items-center gap-2">
                      {assignment.status === 'graded' ? (
                        <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-mono">
                          Score: {assignment.points} / {assignment.maxPoints}
                        </span>
                      ) : assignment.status === 'submitted' ? (
                        <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          Turned In
                        </span>
                      ) : (
                        <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                          Estimated: {assignment.estimatedMinutes} mins
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Ask Lumi Homework Helper */}
                      <button
                        type="button"
                        onClick={() => handleOpenHomeworkHelper(assignment)}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer font-['Fredoka']"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Lumi Tutor Helper</span>
                      </button>

                      {/* Turn In Button if not yet submitted */}
                      {assignment.status !== 'submitted' && assignment.status !== 'graded' && (
                        <button
                          type="button"
                          onClick={() => handleTurnInAssignment(assignment.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer font-['Fredoka']"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Turn In</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: Structured Daily Schedule Balancing School & Sports */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Smart Balance Recommendation Card from Lumi */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0">
              🏒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-amber-950 font-['Fredoka']">
                  Lumi's Adaptive Daily Balance Recommendation
                </h3>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full uppercase">
                  Active Sports Day
                </span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed mt-0.5">
                On days with <strong>Minor Hockey</strong> or <strong>Swimming</strong>, Lumi automatically suggests an earlier 20-minute focused study sprint at 5:30 PM so {childName} can unwind freely during dinner and preserve the daily learning streak!
              </p>
            </div>
          </div>

          {/* Timeline of the Day */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-black text-base text-slate-800 font-['Fredoka'] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Daily Schedule Breakdown (School, Extracurriculars & Homework)
            </h3>

            <div className="space-y-3 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {schedule.map((item) => {
                let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
                if (item.type === 'school') badgeColor = 'bg-blue-100 text-blue-900 border-blue-200';
                if (item.type === 'extracurricular') badgeColor = 'bg-orange-100 text-orange-900 border-orange-200';
                if (item.type === 'homework') badgeColor = 'bg-purple-100 text-purple-900 border-purple-200';
                if (item.type === 'family') badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-200';

                return (
                  <div
                    key={item.id}
                    className="relative pl-12 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-all"
                  >
                    {/* Icon Pin */}
                    <div className="absolute left-2.5 top-3.5 w-6 h-6 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center text-xs shadow-xs">
                      {item.icon}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700">
                          {item.startTime} – {item.endTime}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 font-['Fredoka']">
                        {item.title}
                      </h4>
                      {item.notes && <p className="text-xs text-slate-500">{item.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-medium">
                        {item.daysOfWeek.join(', ')}
                      </span>
                      {item.isCompletedToday && (
                        <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Done Today
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Homework Helper Modal with Lumi */}
      {selectedAssignmentForHelp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative animate-scaleUp flex flex-col max-h-[85vh]">
            <button
              type="button"
              onClick={() => setSelectedAssignmentForHelp(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-sm">
                ✨
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 font-['Fredoka']">
                  Lumi Homework Helper: {selectedAssignmentForHelp.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Socratic guidance for {childName} on Ontario Google Classroom tasks
                </p>
              </div>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 p-1 mb-4 text-xs">
              {homeworkChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                      msg.sender === 'student'
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-indigo-50 text-indigo-950 border border-indigo-100 rounded-bl-xs'
                    }`}
                  >
                    {msg.sender === 'lumi' && (
                      <span className="font-bold text-indigo-700 block mb-1">🌟 Lumi:</span>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoadingLumi && (
                <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl w-fit text-xs animate-pulse">
                  Lumi is writing an encouraging hint...
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendHomeworkMessage} className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={homeworkInput}
                onChange={(e) => setHomeworkInput(e.target.value)}
                placeholder={`Ask Lumi ("Can you give me a clue for Question 3?")`}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!homeworkInput.trim() || isLoadingLumi}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow transition-all cursor-pointer flex items-center gap-1 font-['Fredoka']"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-scaleUp">
            <button
              type="button"
              onClick={() => setShowAddScheduleModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 font-['Fredoka'] mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Add Extra-Curricular or Activity
            </h3>

            <form onSubmit={handleAddActivity} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Activity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taekwondo, Piano Lessons, Robotics"
                  value={newActivityTitle}
                  onChange={(e) => setNewActivityTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newActivityType}
                  onChange={(e) => setNewActivityType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="extracurricular">Extra-Curricular / Sport</option>
                  <option value="homework">Homework / Study</option>
                  <option value="family">Family / Social Time</option>
                  <option value="rest">Rest / Reading</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newActivityStart}
                    onChange={(e) => setNewActivityStart(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newActivityEnd}
                    onChange={(e) => setNewActivityEnd(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Days of Week</label>
                <input
                  type="text"
                  placeholder="e.g. Mon, Wed, Fri"
                  value={newActivityDays}
                  onChange={(e) => setNewActivityDays(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bring gear bag, Community Arena Pad B"
                  value={newActivityNotes}
                  onChange={(e) => setNewActivityNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddScheduleModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow cursor-pointer font-['Fredoka']"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
