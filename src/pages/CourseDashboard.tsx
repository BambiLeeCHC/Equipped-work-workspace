import { useState } from "react";
import { useQuery } from "convex/react";
import { Link } from "react-router-dom";
import {
  Brain, BarChart3, FileText, Presentation, Search, Mail, Workflow,
  Lock, Check, Flame, Star, Trophy, Zap, Target,
  Sparkles, ChevronRight, Award, TrendingUp, Gift,
} from "lucide-react";
import { api } from "../../convex/_generated/api";
import { MODULES, tierGrantsAccess, type Tier } from "../data/curriculum";

const ICONS: Record<string, any> = { Brain, BarChart3, FileText, Presentation, Search, Mail, Workflow };

const TIER_COLORS: Record<string, { bg: string; text: string; border: string; glow: string; gradient: string }> = {
  free:     { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-300", glow: "glow-pulse-emerald", gradient: "from-emerald-400 to-teal-500" },
  pro:      { bg: "bg-violet-500/10",  text: "text-violet-600",  border: "border-violet-300",  glow: "glow-pulse",         gradient: "from-violet-500 to-purple-600" },
  business: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-600", border: "border-fuchsia-300", glow: "glow-pulse",         gradient: "from-fuchsia-500 to-pink-600" },
  elite:    { bg: "bg-violet-500/10",  text: "text-violet-600",  border: "border-violet-300",  glow: "glow-pulse",         gradient: "from-violet-500 to-purple-600" },
  master:   { bg: "bg-violet-500/10",  text: "text-violet-600",  border: "border-violet-300",  glow: "glow-pulse",         gradient: "from-violet-500 to-purple-600" },
};

const MODULE_COLORS = [
  { accent: "#10b981", bg: "from-emerald-400 to-teal-500",   light: "bg-emerald-50",  icon: "text-emerald-500" },
  { accent: "#3b82f6", bg: "from-blue-400 to-indigo-500",    light: "bg-blue-50",     icon: "text-blue-500" },
  { accent: "#a855f7", bg: "from-violet-400 to-purple-500",  light: "bg-violet-50",   icon: "text-violet-500" },
  { accent: "#ec4899", bg: "from-pink-400 to-rose-500",      light: "bg-pink-50",     icon: "text-pink-500" },
  { accent: "#f59e0b", bg: "from-amber-400 to-orange-500",   light: "bg-amber-50",    icon: "text-amber-500" },
  { accent: "#ef4444", bg: "from-red-400 to-rose-500",       light: "bg-red-50",      icon: "text-red-500" },
  { accent: "#8b5cf6", bg: "from-purple-500 to-indigo-600",  light: "bg-purple-50",   icon: "text-purple-500" },
];

function XpPopover({ xp, level }: { xp: number; level: number }) {
  const progress = Math.round((xp % 500) / 5);
  return (
    <div className="popover-content" style={{ whiteSpace: "normal", width: "200px" }}>
      <p className="font-bold text-amber-300 mb-1">⭐ Level {level}</p>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-1">
        <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-[10px] text-gray-300">{xp % 500} / 500 XP to next level</p>
      <p className="text-[10px] text-gray-400 mt-1">Complete lessons to earn XP!</p>
    </div>
  );
}

export function CourseDashboard() {
  const user = useQuery(api.auth.currentUser);
  const sub = useQuery(api.progress.getSubscription);
  const xpData = useQuery(api.progress.getUserXp);
  const allProgress = useQuery(api.progress.getAllProgress);
  const isAdmin = useQuery(api.admin.isAdmin);
  const [expandedMod, setExpandedMod] = useState<string | null>(null);

  const userTier = (sub?.tier ?? "free") as Tier;
  const progressMap = new Map((allProgress ?? []).map((p) => [p.lessonId, p]));

  const totalLessons = MODULES.reduce((a, m) => a + m.lessons.length, 0);
  const completedLessons = (allProgress ?? []).filter((p) => p.quizPassed).length;
  const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const xp = xpData?.totalXp ?? 0;
  const level = xpData?.level ?? 1;
  const streak = xpData?.currentStreak ?? 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-6 md:p-8 text-white">
        {/* Floating particles */}
        <div className="absolute top-4 right-8 text-2xl float-particle opacity-60">✨</div>
        <div className="absolute top-12 right-32 text-lg float-particle opacity-40" style={{ animationDelay: "1s" }}>🌟</div>
        <div className="absolute bottom-6 right-16 text-xl float-particle opacity-50" style={{ animationDelay: "2s" }}>💫</div>
        <div className="absolute top-8 left-[60%] w-32 h-32 rounded-full bg-fuchsia-500/10 blur-3xl opacity-pulse" />
        <div className="absolute bottom-0 right-[20%] w-40 h-40 rounded-full bg-violet-500/10 blur-3xl opacity-pulse-slow" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium backdrop-blur-sm flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300 uppercase tracking-wider">{userTier} tier</span>
              </div>
              {streak > 0 && (
                <div className="px-3 py-1 rounded-full bg-orange-500/20 text-xs font-bold flex items-center gap-1.5">
                  <span className="flame-flicker inline-block">🔥</span>
                  <span className="text-orange-300">{streak} day streak!</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
            </h1>
            <p className="text-white/60 mt-1 text-sm">Your AI mastery journey continues.</p>
          </div>

          {/* Level ring */}
          <div className="popover-trigger shrink-0 cursor-help">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <circle cx="50" cy="50" r="44" fill="none" stroke="url(#lvlGrad)" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(xp % 500) / 500 * 276.5} 276.5`}
                />
                <defs>
                  <linearGradient id="lvlGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-amber-400">{level}</span>
                <span className="text-[10px] text-white/50 uppercase tracking-wide">Level</span>
              </div>
            </div>
            <XpPopover xp={xp} level={level} />
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total XP", value: xp.toLocaleString(), icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", ringColor: "ring-amber-300/50", emoji: "⭐" },
          { label: "Level", value: level, icon: Trophy, color: "text-violet-500", bg: "bg-violet-500/10", ringColor: "ring-violet-300/50", emoji: "🏆" },
          { label: "Streak", value: `${streak}d`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", ringColor: "ring-orange-300/50", emoji: "🔥" },
          { label: "Complete", value: `${pct}%`, icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10", ringColor: "ring-emerald-300/50", emoji: "🎯" },
        ].map((s, i) => (
          <div key={s.label}
            className={`slide-up-in relative rounded-xl border bg-card p-4 flex items-center gap-3 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group`}
            style={{ animationDelay: `${i * 100}ms` }}>
            <div className={`rounded-xl ${s.bg} p-2.5 ring-2 ${s.ringColor} group-hover:scale-110 transition-transform`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-extrabold tabular-nums">{s.value}</p>
              <p className="text-[11px] text-muted-foreground font-medium">{s.label}</p>
            </div>
            <span className="absolute top-2 right-2 text-lg opacity-0 group-hover:opacity-100 transition-opacity">{s.emoji}</span>
          </div>
        ))}
      </div>

      {/* ── Overall Progress ── */}
      <div className="rounded-xl border bg-card p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-fuchsia-500/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="flex justify-between items-center text-sm mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-fuchsia-500" />
            <span className="font-bold">Overall Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">{completedLessons}/{totalLessons} lessons</span>
            <span className="font-bold text-fuchsia-600">{pct}%</span>
          </div>
        </div>
        <div className="h-4 bg-muted rounded-full overflow-hidden relative z-10">
          <div className="h-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-purple-500 rounded-full transition-all duration-1000 progress-glow relative"
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct >= 100 && (
          <div className="mt-3 text-center text-sm font-bold text-emerald-600 flash-in">
            🎉 Curriculum Complete! You're an AI Master!
          </div>
        )}
      </div>

      {/* ── Achievement Badges Row ── */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {[
          { emoji: "🚀", label: "First Steps", desc: "Complete your first lesson", unlocked: completedLessons >= 1 },
          { emoji: "🧠", label: "Quick Learner", desc: "Complete 5 lessons", unlocked: completedLessons >= 5 },
          { emoji: "⚡", label: "On Fire", desc: "3-day streak", unlocked: streak >= 3 },
          { emoji: "🎓", label: "Module Master", desc: "Complete a full module", unlocked: MODULES.some(m => m.lessons.every(l => progressMap.get(l.id)?.quizPassed)) },
          { emoji: "👑", label: "AI Expert", desc: "Reach Level 5", unlocked: level >= 5 },
          { emoji: "💎", label: "Completionist", desc: "100% curriculum", unlocked: pct >= 100 },
        ].map((badge) => (
          <div key={badge.label} className="popover-trigger shrink-0">
            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
              badge.unlocked
                ? "bg-gradient-to-br from-amber-100 to-yellow-50 border-2 border-amber-300 shadow-lg hover:scale-110 cursor-pointer"
                : "bg-muted/50 border border-border opacity-40 grayscale"
            }`}>
              <span className={`text-2xl ${badge.unlocked ? "" : "grayscale"}`}>{badge.emoji}</span>
            </div>
            <div className="popover-content" style={{ whiteSpace: "normal", width: "160px" }}>
              <p className="font-bold text-amber-300">{badge.emoji} {badge.label}</p>
              <p className="text-gray-300 text-[11px] mt-0.5">{badge.desc}</p>
              {!badge.unlocked && <p className="text-gray-500 text-[10px] mt-1 italic">🔒 Locked</p>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Modules ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold">Modules</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-fuchsia-300/50 to-transparent" />
        </div>

        <div className="space-y-3">
          {MODULES.map((mod, mi) => {
            const hasAccess = isAdmin || tierGrantsAccess(userTier, mod.tier);
            const Icon = ICONS[mod.icon] ?? Brain;
            const modLessons = mod.lessons;
            const done = modLessons.filter((l) => progressMap.get(l.id)?.quizPassed).length;
            const modPct = modLessons.length > 0 ? Math.round((done / modLessons.length) * 100) : 0;
            const nextLesson = modLessons.find((l) => !progressMap.get(l.id)?.quizPassed);
            const colors = MODULE_COLORS[mi % MODULE_COLORS.length];
            const tc = TIER_COLORS[mod.tier] ?? TIER_COLORS.free;
            const isExpanded = expandedMod === mod.id;
            const isComplete = modPct === 100;

            return (
              <div key={mod.id}
                className={`slide-up-in rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-md ${
                  !hasAccess ? "opacity-50" : isComplete ? "ring-2 ring-emerald-300/50" : ""
                }`}
                style={{ animationDelay: `${mi * 80}ms` }}>

                {/* Module header */}
                <div
                  className="p-5 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer bg-card hover:bg-accent/30 transition-colors"
                  onClick={() => setExpandedMod(isExpanded ? null : mod.id)}>

                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Colored icon box */}
                    <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shrink-0 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                      {isComplete && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow bounce-in">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {!hasAccess && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center">
                          <Lock className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg">{mod.title}</h3>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${tc.bg} ${tc.text} border ${tc.border}`}>
                          {mod.tier === "free" ? "FREE" : "PRO"}
                        </span>
                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          Module {mi + 1}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{mod.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Mini progress ring */}
                    <div className="popover-trigger relative w-10 h-10">
                      <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                        <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" className="text-muted" strokeWidth="3" />
                        <circle cx="20" cy="20" r="16" fill="none" stroke={colors.accent} strokeWidth="3" strokeLinecap="round"
                          strokeDasharray={`${modPct / 100 * 100.5} 100.5`}
                          className="transition-all duration-700"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{modPct}%</span>
                      <div className="popover-content">
                        {done}/{modLessons.length} lessons complete
                      </div>
                    </div>

                    {hasAccess && nextLesson ? (
                      <Link to={`/lessons/${nextLesson.id}`}
                        className={`text-sm font-bold text-white bg-gradient-to-r ${colors.bg} px-5 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-1.5 scale-tap`}
                        onClick={(e) => e.stopPropagation()}>
                        {done === 0 ? "Start" : "Continue"} <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : !hasAccess ? (
                      <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted/50">
                        <Lock className="w-4 h-4" /> Upgrade
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-4 py-2 rounded-xl">
                        <Award className="w-4 h-4" /> Complete!
                      </span>
                    )}

                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                </div>

                {/* Expanded lesson grid */}
                {isExpanded && hasAccess && (
                  <div className="border-t bg-gradient-to-b from-accent/20 to-background px-5 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                      {modLessons.map((lesson, li) => {
                        const lp = progressMap.get(lesson.id);
                        const isLessonComplete = lp?.quizPassed;
                        const inProgress = lp && !lp.quizPassed;
                        const prevComplete = li === 0 || progressMap.get(modLessons[li - 1].id)?.quizPassed;
                        const isLocked = !prevComplete;

                        return (
                          <Link
                            key={lesson.id}
                            to={!isLocked ? `/lessons/${lesson.id}` : "#"}
                            className={`slide-up-in relative text-xs rounded-xl px-3.5 py-3 border-2 transition-all duration-200 flex items-start gap-2 group ${
                              isLessonComplete
                                ? "bg-emerald-50 border-emerald-300 text-emerald-700 hover:shadow-md hover:scale-[1.02]"
                                : inProgress
                                ? `${colors.light} border-2 text-foreground hover:shadow-md hover:scale-[1.02]`
                                : !isLocked
                                ? "bg-card border-border hover:border-fuchsia-300 hover:shadow-md hover:scale-[1.02] text-foreground"
                                : "bg-muted/30 border-border/50 text-muted-foreground cursor-not-allowed"
                            }`}
                            style={{ animationDelay: `${li * 60}ms`, borderColor: inProgress ? colors.accent : undefined }}>
                            <span className={`font-extrabold text-sm ${
                              isLessonComplete ? "text-emerald-500" :
                              inProgress ? colors.icon :
                              isLocked ? "text-muted-foreground/50" : "text-muted-foreground"
                            }`}>{lesson.order}</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold leading-tight block truncate">{lesson.title}</span>
                              {isLessonComplete && (
                                <span className="text-[10px] text-emerald-500 flex items-center gap-0.5 mt-0.5">
                                  <Check className="w-3 h-3" /> +{lesson.xpReward}XP
                                </span>
                              )}
                              {inProgress && (
                                <span className="text-[10px] flex items-center gap-0.5 mt-0.5" style={{ color: colors.accent }}>
                                  <Zap className="w-3 h-3" /> In progress
                                </span>
                              )}
                            </div>
                            {isLocked && <Lock className="w-3 h-3 text-muted-foreground/50 shrink-0 mt-0.5" />}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Daily Challenge / Tip Card ── */}
      <div className="rainbow-border">
        <div className="rounded-[14px] bg-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center shrink-0 shimmer-flash">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">💡 Daily Tip</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {completedLessons === 0
                ? "Start with Module 1 — Learn the C.R.A.F.T. Prompt Method. Master the basics first!"
                : streak > 0
                ? `You're on a ${streak}-day streak! Keep it going — consistency is the key to mastery.`
                : "Come back daily to build your streak and earn bonus XP! 🔥"}
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-fuchsia-400 shrink-0 float-particle" />
        </div>
      </div>
    </div>
  );
}
