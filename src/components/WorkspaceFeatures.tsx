import { useState } from "react";
import {
  Bot, Sparkles, BarChart3, CheckSquare,
  Send, Building2, Users, Monitor, GraduationCap,
  TrendingUp, TrendingDown, Target, Brain, Zap,
  Calendar, Clock, ChevronRight,
  MessageCircle, Lightbulb, Award, Star, AlertTriangle
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   FEATURE #5: E-QUIPPED BOT — AI Workspace Assistant
   Searches past meetings, answers questions about history
   ═══════════════════════════════════════════════════════ */

const SAMPLE_BOT_RESPONSES: Record<string, string> = {
  "pricing": "In last Tuesday's meeting (Jun 2), the team discussed pricing strategy. Key decisions: Pro tier set at $34.99/mo, Business at $69.99/mo. Action item: Trey to finalize enterprise pricing by EOW.",
  "deadline": "Based on recent meetings, there are 3 upcoming deadlines:\n1. Work[space] MVP — Jun 15\n2. Oland Stokes demo — Week of Jun 9\n3. Pricing PDF update — Jun 7",
  "action": "Outstanding action items across all meetings:\n• Update pricing page with new tiers (assigned: Viktor)\n• Schedule demo with Sarasota County (assigned: Trey)\n• Review Work[space] security audit (assigned: Team)",
};

export function EquippedBot({ workspaceName }: { workspaceName: string }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: `👋 I'm the E-Quipped Bot for *${workspaceName}*. Ask me anything about past meetings, action items, decisions, or team activity. I search across all your meeting transcripts and insights.` },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = () => {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setQuery("");
    setIsThinking(true);

    setTimeout(() => {
      let response = "I searched through your meeting history. I don't have enough data yet to answer that specifically. As your team holds more meetings with transcription enabled, I'll be able to give you detailed answers across all conversations.";

      if (q.includes("pricing") || q.includes("price")) {
        response = SAMPLE_BOT_RESPONSES.pricing;
      } else if (q.includes("deadline") || q.includes("due") || q.includes("when")) {
        response = SAMPLE_BOT_RESPONSES.deadline;
      } else if (q.includes("action") || q.includes("task") || q.includes("todo")) {
        response = SAMPLE_BOT_RESPONSES.action;
      }

      setMessages((prev) => [...prev, { role: "bot", text: response }]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-sm">E-Quipped Bot</h3>
          <p className="text-xs text-gray-500">AI-powered meeting memory</p>
        </div>
        <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-xs text-emerald-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Online
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-fuchsia-600 text-white rounded-br-md"
                : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-md"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-white/5 border border-white/10">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about past meetings, decisions, action items..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-fuchsia-500 focus:outline-none text-sm text-white placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={!query.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 disabled:opacity-30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          {["What action items are pending?", "Summarize last meeting", "Any upcoming deadlines?"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => { setQuery(suggestion); }}
              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-fuchsia-500/30 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FEATURE #6: SMART ROOM SUGGESTIONS
   AI recommends best room based on meeting context
   ═══════════════════════════════════════════════════════ */

const ROOM_SUGGESTIONS = [
  {
    type: "one_on_one",
    name: "1-on-1 Room",
    reason: "2 participants detected — intimate setting for focused discussion",
    confidence: 95,
    icon: Users,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    type: "presentation",
    name: "Presentation Stage",
    reason: "Screen sharing requested — optimized for visual presentations",
    confidence: 88,
    icon: Monitor,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    type: "auditorium",
    name: "Auditorium",
    reason: "8+ participants — best for large group discussions",
    confidence: 72,
    icon: Building2,
    gradient: "from-blue-500 to-indigo-600",
  },
];

export function SmartRoomSuggestions({
  onSelectRoom,
  participantCount = 2,
}: {
  onSelectRoom: (roomType: string) => void;
  participantCount?: number;
}) {
  const suggestions = ROOM_SUGGESTIONS.map((s) => ({
    ...s,
    confidence: s.type === "one_on_one" && participantCount <= 3
      ? 95
      : s.type === "presentation" && participantCount <= 10
      ? 88
      : s.type === "auditorium" && participantCount > 8
      ? 95
      : s.confidence - 10,
  })).sort((a, b) => b.confidence - a.confidence);

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-950/50 to-fuchsia-950/50 border border-fuchsia-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-fuchsia-400" />
        <h3 className="font-bold text-sm">Smart Room Suggestion</h3>
        <span className="text-xs text-gray-500">AI-powered</span>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={s.type}
              onClick={() => onSelectRoom(s.type)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${
                i === 0
                  ? "bg-fuchsia-500/10 border border-fuchsia-500/30 hover:bg-fuchsia-500/20"
                  : "bg-white/5 border border-white/5 hover:bg-white/10"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{s.name}</span>
                  {i === 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-fuchsia-500/20 text-fuchsia-300">
                      RECOMMENDED
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">{s.reason}</p>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-sm font-bold ${s.confidence >= 90 ? "text-emerald-400" : s.confidence >= 80 ? "text-amber-400" : "text-gray-400"}`}>
                  {s.confidence}%
                </span>
                <p className="text-[10px] text-gray-500">match</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FEATURE #7: TEAM PERFORMANCE DASHBOARD
   AI-generated productivity insights, collaboration patterns
   ═══════════════════════════════════════════════════════ */

export function TeamPerformanceDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "meetings" | "skills">("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Team Performance</h2>
            <p className="text-sm text-gray-400">AI-generated insights · Updated weekly</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          AI Analysis
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {(["overview", "meetings", "skills"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all capitalize ${
              activeTab === tab ? "bg-fuchsia-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Meeting Efficiency", value: "87%", trend: "+5%", up: true, icon: Target },
              { label: "Avg Meeting Length", value: "28 min", trend: "-12%", up: true, icon: Clock },
              { label: "Action Completion", value: "73%", trend: "+8%", up: true, icon: CheckSquare },
              { label: "Collaboration Score", value: "92/100", trend: "+3", up: true, icon: Users },
            ].map((kpi) => (
              <div key={kpi.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400">{kpi.label}</span>
                </div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <div className={`flex items-center gap-1 text-xs mt-1 ${kpi.up ? "text-emerald-400" : "text-red-400"}`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.trend} vs last week
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-950/50 to-fuchsia-950/50 border border-fuchsia-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-fuchsia-400" />
              <h3 className="font-bold text-sm">AI Insights This Week</h3>
            </div>
            <div className="space-y-2">
              {[
                { icon: Lightbulb, text: "Meeting efficiency improved 5% — shorter meetings with better outcomes", type: "success" },
                { icon: AlertTriangle, text: "2 action items from Monday's standup are overdue", type: "warning" },
                { icon: Award, text: "Team completed 14 tasks this week — highest in 30 days", type: "success" },
                { icon: Zap, text: "Consider combining Wednesday recurring meetings — 60% topic overlap detected", type: "suggestion" },
              ].map((insight, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${
                  insight.type === "success" ? "bg-emerald-500/10" : insight.type === "warning" ? "bg-amber-500/10" : "bg-blue-500/10"
                }`}>
                  <insight.icon className={`w-4 h-4 mt-0.5 shrink-0 ${
                    insight.type === "success" ? "text-emerald-400" : insight.type === "warning" ? "text-amber-400" : "text-blue-400"
                  }`} />
                  <p className="text-sm text-gray-200">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "meetings" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-bold text-sm mb-3">Meeting Patterns</h3>
            <div className="space-y-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => {
                const hours = [2.5, 1.8, 3.2, 1.5, 0.8][i];
                const pct = (hours / 4) * 100;
                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-8">{day}</span>
                    <div className="flex-1 h-6 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 flex items-center px-2"
                        style={{ width: `${pct}%` }}
                      >
                        <span className="text-[10px] font-bold">{hours}h</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-fuchsia-400" />
              AI Tip: Wednesday has 60% more meeting time — consider consolidating
            </p>
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-bold text-sm mb-3">Skill Gap Analysis</h3>
            <p className="text-xs text-gray-400 mb-4">Based on meeting discussions and E-Quipped: Work course progress</p>
            <div className="space-y-3">
              {[
                { skill: "AI Prompt Engineering", coverage: 85, trend: "up" },
                { skill: "Data Analysis with AI", coverage: 62, trend: "up" },
                { skill: "Meeting Facilitation", coverage: 78, trend: "stable" },
                { skill: "AI-Powered Writing", coverage: 45, trend: "down" },
                { skill: "Workflow Automation", coverage: 30, trend: "new" },
              ].map((s) => (
                <div key={s.skill} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{s.skill}</span>
                      <span className={`text-xs font-bold ${
                        s.coverage >= 80 ? "text-emerald-400" : s.coverage >= 50 ? "text-amber-400" : "text-red-400"
                      }`}>
                        {s.coverage}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          s.coverage >= 80 ? "bg-emerald-500" : s.coverage >= 50 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${s.coverage}%` }}
                      />
                    </div>
                  </div>
                  {s.trend === "new" && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">NEW</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
              <p className="text-xs text-fuchsia-200">
                <strong>Recommendation:</strong> 3 team members would benefit from Modules 5-7 of the E-Quipped: Work course (AI Writing & Workflow Automation). Assign via the training dashboard.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FEATURE #8: AI ONBOARDING COMPANION
   Guides new employees through their first day
   ═══════════════════════════════════════════════════════ */

const ONBOARDING_STEPS = [
  {
    title: "Welcome to the Workspace",
    description: "I'll be your AI guide. Let me show you around your new virtual office.",
    icon: Star,
    status: "complete" as const,
  },
  {
    title: "Meet Your Team",
    description: "I've identified 4 team members online right now. Would you like me to introduce you?",
    icon: Users,
    status: "complete" as const,
  },
  {
    title: "Explore the Office",
    description: "Your workspace has 6 rooms. I recommend starting in the Main Office — that's where your team usually gathers.",
    icon: Building2,
    status: "active" as const,
  },
  {
    title: "AI Training Course",
    description: "Your admin has assigned Modules 1-3 of E-Quipped: Work. Start when you're ready — you can access it from the dashboard.",
    icon: GraduationCap,
    status: "pending" as const,
  },
  {
    title: "Security & Privacy",
    description: "All your conversations are end-to-end encrypted. Your data is isolated from other organizations. Review our security practices anytime.",
    icon: Target,
    status: "pending" as const,
  },
];

export function OnboardingCompanion({ userName = "New Team Member" }: { userName?: string }) {
  const [currentStep, setCurrentStep] = useState(2);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-950 to-fuchsia-950 border border-fuchsia-500/30 shadow-2xl shadow-fuchsia-500/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-400 to-violet-500 flex items-center justify-center animate-pulse">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">AI Onboarding Guide</h3>
            <p className="text-xs text-fuchsia-300">Welcome, {userName}!</p>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="text-xs text-gray-500 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10">
          Dismiss
        </button>
      </div>

      <div className="space-y-2">
        {ONBOARDING_STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStep;
          return (
            <button
              key={step.title}
              onClick={() => setCurrentStep(i)}
              className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all ${
                isActive ? "bg-white/10 border border-fuchsia-500/30" : "hover:bg-white/5"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                step.status === "complete"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : step.status === "active"
                  ? "bg-fuchsia-500/20 text-fuchsia-400"
                  : "bg-white/5 text-gray-500"
              }`}>
                {step.status === "complete" ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${step.status === "pending" ? "text-gray-500" : "text-white"}`}>
                  {step.title}
                </p>
                {isActive && (
                  <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                )}
              </div>
              {isActive && (
                <ChevronRight className="w-4 h-4 text-fuchsia-400 ml-auto mt-1 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500" style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }} />
        </div>
        <span className="text-xs text-gray-400">{currentStep + 1}/{ONBOARDING_STEPS.length}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FEATURE #9: POST-MEETING AUTO-ASSIGNMENTS
   Action items auto-create tasks with deadlines
   ═══════════════════════════════════════════════════════ */

interface AutoTask {
  id: string;
  text: string;
  assignee: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  source: string;
  completed: boolean;
}

const SAMPLE_TASKS: AutoTask[] = [
  {
    id: "1",
    text: "Update pricing page with new tier structure",
    assignee: "Viktor",
    dueDate: "Jun 7",
    priority: "high",
    source: "Strategy Meeting — Jun 3",
    completed: false,
  },
  {
    id: "2",
    text: "Schedule demo with Sarasota County",
    assignee: "Trey",
    dueDate: "Jun 10",
    priority: "high",
    source: "Outreach Review — Jun 4",
    completed: false,
  },
  {
    id: "3",
    text: "Review Work[space] security audit checklist",
    assignee: "Team",
    dueDate: "Jun 12",
    priority: "medium",
    source: "Product Standup — Jun 3",
    completed: false,
  },
  {
    id: "4",
    text: "Draft onboarding email template for new subscribers",
    assignee: "Trey",
    dueDate: "Jun 14",
    priority: "low",
    source: "Marketing Sync — Jun 2",
    completed: true,
  },
];

export function AutoAssignments() {
  const [tasks, setTasks] = useState(SAMPLE_TASKS);

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold">Auto-Assignments</h3>
            <p className="text-xs text-gray-400">AI-extracted from meeting transcripts</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          pendingCount > 0 ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"
        }`}>
          {pendingCount} pending
        </span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
              task.completed
                ? "bg-white/2 border-white/5 opacity-60"
                : "bg-white/5 border-white/10 hover:border-fuchsia-500/20"
            }`}
          >
            <button
              onClick={() => toggleComplete(task.id)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                task.completed
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-gray-500 hover:border-fuchsia-500"
              }`}
            >
              {task.completed && <CheckSquare className="w-3 h-3 text-white" />}
            </button>

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                {task.text}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {task.assignee}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {task.dueDate}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  task.priority === "high" ? "bg-red-500/20 text-red-300" :
                  task.priority === "medium" ? "bg-amber-500/20 text-amber-300" :
                  "bg-gray-500/20 text-gray-300"
                }`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-[10px] text-gray-600 mt-1 flex items-center gap-1">
                <MessageCircle className="w-3 h-3" /> From: {task.source}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-start gap-2">
        <Zap className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
        <p className="text-xs text-fuchsia-200">
          Tasks are auto-extracted by AI after each meeting ends. Assignees are matched by speaker identification.
        </p>
      </div>
    </div>
  );
}
