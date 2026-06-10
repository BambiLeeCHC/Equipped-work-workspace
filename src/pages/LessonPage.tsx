import { useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft, BookOpen, FlaskConical, ClipboardCheck, ChevronRight, ChevronLeft, Check, X,
  RotateCcw, Zap, Star, Sparkles, Trophy, Target, Lightbulb, AlertCircle,
  ChevronDown, Play, Pause, Maximize2,
} from "lucide-react";
import { api } from "../../convex/_generated/api";
import { MODULES, getNextLessonId, type Lesson, type SandboxCriterion } from "../data/curriculum";

/* ── helpers ── */
function findLesson(id: string): { lesson: Lesson; moduleName: string; moduleIndex: number; lessonIndex: number } | null {
  for (let mi = 0; mi < MODULES.length; mi++) {
    const m = MODULES[mi];
    const li = m.lessons.findIndex((x) => x.id === id);
    if (li >= 0) return { lesson: m.lessons[li], moduleName: m.title, moduleIndex: mi, lessonIndex: li };
  }
  return null;
}

function gradeSandbox(response: string, criteria: SandboxCriterion[], minLength: number): { score: number; results: { name: string; hit: boolean; weight: number }[] } {
  const lower = response.toLowerCase();
  const lengthScore = Math.min(20, Math.round((response.trim().split(/\s+/).length / minLength) * 20));
  const results = criteria.map((c) => {
    const hit = c.keywords.some((kw) => lower.includes(kw.toLowerCase()));
    return { name: c.name, hit, weight: c.weight };
  });
  const criteriaScore = results.reduce((a, r) => a + (r.hit ? r.weight : 0), 0);
  return { score: Math.min(100, lengthScore + criteriaScore), results };
}

const STEP_COLORS = [
  { bg: "from-blue-500 to-indigo-600",   light: "bg-blue-100 text-blue-700",     active: "bg-blue-500",     ring: "ring-blue-300" },
  { bg: "from-fuchsia-500 to-purple-600", light: "bg-fuchsia-100 text-fuchsia-700", active: "bg-fuchsia-500", ring: "ring-fuchsia-300" },
  { bg: "from-amber-500 to-orange-600",  light: "bg-amber-100 text-amber-700",   active: "bg-amber-500",    ring: "ring-amber-300" },
];

/* ── XP reward toast ── */
function XpToast({ xp, show }: { xp: number; show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed top-6 right-6 z-50 flash-in">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
        <Star className="w-6 h-6 text-white" />
        <div>
          <p className="font-extrabold text-lg">+{xp} XP!</p>
          <p className="text-xs text-white/80">Lesson complete!</p>
        </div>
        <span className="text-3xl">🎉</span>
      </div>
    </div>
  );
}

/* ── Animated step indicator ── */
function Steps({ current, contentDone, sandboxDone, quizDone }: { current: number; contentDone: boolean; sandboxDone: boolean; quizDone: boolean }) {
  const steps = [
    { label: "Learn", icon: BookOpen, done: contentDone, emoji: "📖" },
    { label: "Sandbox", icon: FlaskConical, done: sandboxDone, emoji: "🧪" },
    { label: "Quiz", icon: ClipboardCheck, done: quizDone, emoji: "📝" },
  ];

  return (
    <div className="flex items-center justify-center gap-0 bg-card rounded-2xl border p-2 shadow-sm">
      {steps.map((s, i) => {
        const isActive = current === i;
        const isDone = s.done;
        const sc = STEP_COLORS[i];

        return (
          <div key={s.label} className="flex items-center">
            {i > 0 && (
              <div className={`w-8 md:w-12 h-0.5 ${isDone || current > i ? "bg-gradient-to-r " + sc.bg : "bg-muted"} transition-all duration-500`} />
            )}
            <div className="popover-trigger">
              <div className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-r ${sc.bg} text-white shadow-lg scale-105`
                  : isDone
                  ? `${sc.light} ring-2 ${sc.ring}`
                  : "bg-muted/50 text-muted-foreground"
              }`}>
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                ) : (
                  <s.icon className="w-4 h-4" />
                )}
                <span className="hidden md:inline">{s.label}</span>
                <span className="md:hidden">{s.emoji}</span>
              </div>
              <div className="popover-content">
                {isDone ? `✅ ${s.label} Complete!` : isActive ? `📍 Currently on ${s.label}` : `🔒 ${s.label} — locked`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── main ── */
export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const found = useMemo(() => findLesson(lessonId ?? ""), [lessonId]);

  const progress = useQuery(api.progress.getLessonProgress, lessonId ? { lessonId } : "skip");
  const markContent = useMutation(api.progress.markContentComplete);
  const submitSandbox = useMutation(api.progress.submitSandbox);
  const submitQuizMut = useMutation(api.progress.submitQuiz);

  const contentDone = progress?.contentCompleted ?? false;
  const sandboxDone = progress?.sandboxPassed ?? false;
  const quizDone = progress?.quizPassed ?? false;
  const [step, setStep] = useState<number>(quizDone ? 2 : sandboxDone ? 2 : contentDone ? 1 : 0);
  const [showXpToast, setShowXpToast] = useState(false);
  const currentStep = quizDone ? 2 : step;

  if (!found) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-xl font-bold">Lesson not found</h2>
      <Link to="/dashboard" className="mt-4 text-fuchsia-600 hover:underline flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
    </div>
  );
  const { lesson, moduleName, moduleIndex, lessonIndex } = found;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <XpToast xp={lesson.xpReward} show={showXpToast} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground slide-up-in">
        <Link to="/dashboard" className="hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-fuchsia-600 font-medium">{moduleName}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-bold">{lesson.title}</span>
      </div>

      {/* Lesson header card */}
      <div className={`slide-up-in rounded-2xl bg-gradient-to-br ${["from-blue-500 to-indigo-600","from-emerald-500 to-teal-600","from-violet-500 to-purple-600","from-pink-500 to-rose-600","from-amber-500 to-orange-600","from-red-500 to-rose-600","from-purple-600 to-indigo-700"][moduleIndex % 7]} p-5 text-white relative overflow-hidden`}
        style={{ animationDelay: "100ms" }}>
        <div className="absolute top-2 right-4 text-4xl opacity-20 float-particle">✨</div>
        <div className="absolute bottom-2 right-12 text-2xl opacity-15 float-particle" style={{ animationDelay: "1.5s" }}>🌟</div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
              Module {moduleIndex + 1} · Lesson {lessonIndex + 1}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm flex items-center gap-1">
              <Star className="w-3 h-3" /> {lesson.xpReward} XP
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold">{lesson.title}</h1>
        </div>
      </div>

      {/* Step indicator */}
      <div className="slide-up-in" style={{ animationDelay: "200ms" }}>
        <Steps current={currentStep} contentDone={contentDone} sandboxDone={sandboxDone} quizDone={quizDone} />
      </div>

      {/* Content panels */}
      <div className="slide-up-in rounded-2xl border bg-card overflow-hidden shadow-sm" style={{ animationDelay: "300ms" }}>
        {currentStep === 0 && (
          <ContentPanel lesson={lesson} onComplete={() => { markContent({ lessonId: lesson.id }); setStep(1); }} />
        )}
        {currentStep === 1 && !sandboxDone && (
          <SandboxPanel lesson={lesson} onPass={(resp, score) => { submitSandbox({ lessonId: lesson.id, response: resp, score, passed: true }); setStep(2); }} onFail={(resp, score) => { submitSandbox({ lessonId: lesson.id, response: resp, score, passed: false }); }} />
        )}
        {(currentStep === 2 || sandboxDone) && (
          <QuizPanel lesson={lesson} alreadyPassed={quizDone} nextLessonId={getNextLessonId(lesson.id)} onPass={(score) => {
            submitQuizMut({ lessonId: lesson.id, score, passed: true, xpReward: lesson.xpReward });
            setShowXpToast(true);
            setTimeout(() => setShowXpToast(false), 3000);
          }} onFail={(score) => { submitQuizMut({ lessonId: lesson.id, score, passed: false, xpReward: lesson.xpReward }); }} />
        )}
      </div>

      {/* Next lesson CTA */}
      {quizDone && (() => {
        const next = getNextLessonId(lesson.id);
        return next ? (
          <Link to={`/lessons/${next}`}
            className="flash-in block text-center py-4 rounded-2xl gradient-loop text-white font-extrabold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" /> Next Lesson <ChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <div className="flash-in text-center py-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white relative overflow-hidden">
            <div className="confetti-burst inline-block">
              <span className="text-4xl">🎉</span>
            </div>
            <p className="font-extrabold text-xl mt-2">Curriculum Complete!</p>
            <p className="text-white/80 text-sm mt-1">You've mastered every module. You're an AI pro! 🏆</p>
          </div>
        );
      })()}
    </div>
  );
}

/* ── content panel ── */
function ContentPanel({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const html = useMemo(() => enhancedMarkdown(lesson.content), [lesson.content]);
  const [showTip, setShowTip] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-extrabold text-blue-900">{lesson.title}</h2>
            <p className="text-sm text-blue-600/70 mt-0.5">Read through the material, then test your skills in the sandbox.</p>
          </div>
        </div>
      </div>

      {/* Tip popover */}
      <div className="px-6 pt-4">
        <button onClick={() => setShowTip(!showTip)}
          className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl transition-colors border border-amber-200">
          <Lightbulb className="w-4 h-4" />
          Quick Tip
          <ChevronDown className={`w-3 h-3 transition-transform ${showTip ? "rotate-180" : ""}`} />
        </button>
        {showTip && (
          <div className="mt-2 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl text-sm text-amber-800 flash-in">
            <p className="font-bold flex items-center gap-1.5 mb-1">💡 Pro Tip</p>
            <p>Focus on understanding the <strong>why</strong> behind each concept. In the sandbox, you'll need to apply these ideas to a real scenario. Take notes on key terms!</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 prose prose-sm max-w-none
        prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground
        prose-strong:text-foreground prose-td:text-foreground prose-th:text-foreground
        [&_h2]:border-b [&_h2]:border-fuchsia-200/50 [&_h2]:pb-2
        [&_blockquote]:shadow-sm
        [&_table]:shadow-sm [&_table]:rounded-lg [&_table]:overflow-hidden
        [&_code]:bg-fuchsia-50 [&_code]:text-fuchsia-700 [&_code]:border [&_code]:border-fuchsia-200
      " dangerouslySetInnerHTML={{ __html: html }} />

      {/* Visual diagram slideshow (Modules 2, 4, 5, 7) */}
      {LESSON_DIAGRAMS[lesson.id] && (
        <div className="px-6">
          <DiagramSlideshow slides={LESSON_DIAGRAMS[lesson.id]} />
        </div>
      )}

      {/* CTA */}
      <div className="p-6 border-t bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <button onClick={onComplete}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-extrabold text-base hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 scale-tap">
          <span>I've Read This — Open Sandbox</span>
          <FlaskConical className="w-5 h-5" />
          <span className="ml-2 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">Step 2 →</span>
        </button>
      </div>
    </div>
  );
}

/* ── VISUAL DIAGRAM SLIDESHOWS ── */
type DiagramSlide = { title: string; visual: string; caption: string; tip?: string };

const LESSON_DIAGRAMS: Record<string, DiagramSlide[]> = {
  /* ── Module 2: Data & Analysis ── */
  "m2-l1": [
    { title: "Step 1: Identify Dirty Data", visual: "📋 Raw CSV → 🔍 Scan for Issues\n┌──────────────────────────────────┐\n│  Name    │ Email        │ Phone │\n│  john    │ JOHN@CO.COM  │ n/a   │\n│  Jane    │ jane@co.com  │       │\n│  john    │ john@co.com  │ 555   │\n└──────────────────────────────────┘\n⚠️ Duplicates  ⚠️ Inconsistent case  ⚠️ Missing values", caption: "Before cleaning, audit your data for: duplicates, missing values, inconsistent formatting, and invalid entries.", tip: "Tell AI: 'Scan this dataset and list every data quality issue you find, grouped by severity.'" },
    { title: "Step 2: Prompt AI to Clean", visual: "🤖 Your Prompt:\n┌─────────────────────────────────────┐\n│ \"Clean this CSV data:               │\n│  1. Remove duplicate rows           │\n│  2. Standardize email to lowercase  │\n│  3. Fill missing phones with 'N/A'  │\n│  4. Capitalize names properly\"      │\n└─────────────────────────────────────┘\n          ⬇️ AI Processing ⬇️", caption: "Be explicit about each cleaning rule. The more specific your prompt, the more consistent the output." },
    { title: "Step 3: Validate Results", visual: "✅ Cleaned Output:\n┌──────────────────────────────────┐\n│  Name    │ Email        │ Phone │\n│  John    │ john@co.com  │ 555   │\n│  Jane    │ jane@co.com  │ N/A   │\n└──────────────────────────────────┘\n📊 Summary: 3→2 rows, 0 blanks, 100% formatted", caption: "Always review AI output! Check row counts, spot-check values, and verify no data was lost.", tip: "Ask AI: 'Compare the original and cleaned datasets — what was removed and why?'" },
  ],
  "m2-l2": [
    { title: "Step 1: Define Your Spreadsheet Goal", visual: "🎯 Goal: Monthly Budget Tracker\n┌───────────────────────────────────────┐\n│  What do you need?                    │\n│  ├── Income tracking (multiple src)   │\n│  ├── Expense categories               │\n│  ├── Auto-calculated totals           │\n│  └── Visual budget vs actual          │\n└───────────────────────────────────────┘", caption: "Start by defining exactly what your spreadsheet needs to accomplish before prompting AI." },
    { title: "Step 2: Generate Formulas with AI", visual: "🤖 AI-Generated Formulas:\n\n=SUMIF(B:B,\"Income\",C:C)      → Total Income\n=SUMIF(B:B,\"Expense\",C:C)     → Total Expenses\n=C2-C15                        → Net Balance\n=IF(C20<0,\"⚠️ Over Budget\",\"✅\") → Status\n\n📐 One prompt → complete formula set", caption: "Ask AI to generate all formulas at once with explanations of what each one does." },
    { title: "Step 3: Automate Recurring Tasks", visual: "🔄 Automation Flow:\n\n Monthly Data  →  AI Prompt  →  Updated Sheet\n     📥              🤖              📊\n                     │\n         ┌───────────┼───────────┐\n         │           │           │\n    Categorize   Calculate   Flag\n    expenses     totals      anomalies", caption: "Build reusable prompts that you can run each month with fresh data — your personal automation." },
  ],
  "m2-l3": [
    { title: "Step 1: Choose Your Chart Type", visual: "📊 Chart Selection Guide:\n\n  Comparison → 📊 Bar Chart\n  Trend      → 📈 Line Chart\n  Composition→ 🥧 Pie Chart\n  Relationship→ 🔵 Scatter Plot\n  Distribution→ 📉 Histogram\n\n  ❌ Don't: Use pie charts for 10+ categories\n  ✅ Do: Match chart to your data story", caption: "The right visualization makes your data story clear. Wrong chart = confused audience." },
    { title: "Step 2: Prompt AI for Dashboard Layout", visual: "┌─────────────────────────────────┐\n│  🏠 Executive Dashboard         │\n├────────────┬────────────────────┤\n│  KPI Cards │   Revenue Trend    │\n│  ┌──┐┌──┐  │   📈~~~~~~~~~~~~   │\n│  │$K││%↑│  │                    │\n│  └──┘└──┘  │                    │\n├────────────┼────────────────────┤\n│  By Region │  Top Products      │\n│  📊 ▓▓▒░   │  1. Widget A  45%  │\n│     ▓▒░    │  2. Gadget B  30%  │\n└────────────┴────────────────────┘", caption: "Ask AI to design your dashboard layout FIRST, then build each section. Think: KPIs up top, details below." },
    { title: "Step 3: Add Interactivity & Filters", visual: "🎛️ Interactive Elements:\n\n [Date Range ▼]  [Region ▼]  [Product ▼]\n        │              │           │\n        └──────┬───────┘───────────┘\n               ▼\n    📊 Dashboard auto-updates!\n\n  Prompt: \"Add dropdown filters for\n  date, region, and product that\n  dynamically update all charts.\"", caption: "Filters transform static reports into explorable dashboards your team will actually use." },
  ],
  "m2-l4": [
    { title: "Step 1: Define Research Scope", visual: "🔍 Research Framework:\n┌─────────────────────────────────┐\n│  Market Research Brief          │\n│                                 │\n│  Industry: ____________         │\n│  Competitors: 3-5 key ones      │\n│  Timeframe: Last 12 months      │\n│  Focus: Pricing, features, gaps │\n│                                 │\n│  Output: Comparison matrix      │\n└─────────────────────────────────┘", caption: "A focused research brief gets you 10x better AI output than a vague 'research my competitors' prompt." },
    { title: "Step 2: Build Comparison Matrix", visual: "📊 Competitive Matrix:\n┌────────┬────────┬────────┬────────┐\n│Feature │  You   │Comp A  │Comp B  │\n├────────┼────────┼────────┼────────┤\n│Price   │ $49/mo │ $39/mo │ $79/mo │\n│Users   │ Unlim  │  10    │ Unlim  │\n│Support │ 24/7   │ Email  │ Phone  │\n│AI      │  ✅    │  ❌    │  ✅    │\n│Rating  │ 4.5⭐  │ 4.2⭐  │ 4.0⭐  │\n└────────┴────────┴────────┴────────┘\n  💡 Your advantage: AI + unlimited users", caption: "A visual matrix instantly reveals where you win and where competitors have the edge." },
  ],
  "m2-l5": [
    { title: "Step 1: Gather Historical Data", visual: "📈 Historical Data Points:\n\n  Q1    Q2    Q3    Q4    Q1?\n  $10K  $12K  $15K  $18K  ???\n   ╲     ╲     ╲     ╲\n    ╲─────╲─────╲─────╲──→ Trend Line\n                           📊 +$3K/quarter\n\n  Tell AI: \"Here are 4 quarters of data.\n  Identify the trend and forecast Q1.\"", caption: "AI needs at least 3-4 data points to identify meaningful trends. More data = better forecasts." },
    { title: "Step 2: Generate Forecast Models", visual: "🤖 AI Forecast Output:\n\n  Conservative: $19.5K  (base trend)\n  Moderate:     $21.0K  (with seasonality)\n  Optimistic:   $23.5K  (growth acceleration)\n\n  ┌─ Confidence: 85% for conservative\n  ├─ Key factor: Holiday season Q1\n  └─ Risk: Market downturn (-15%)\n\n  📋 Always ask for multiple scenarios!", caption: "Never rely on a single forecast. Ask AI for best/worst/likely scenarios with confidence levels." },
  ],

  /* ── Module 4: Presentations ── */
  "m4-l1": [
    { title: "Step 1: Structure Your Deck", visual: "📑 AI Slide Deck Structure:\n\n  Slide 1:  🏠 Title + Hook\n  Slide 2:  ⚡ Problem Statement\n  Slide 3:  💡 Your Solution\n  Slides 4-6: 📊 Evidence & Data\n  Slide 7:  🗣️ Social Proof\n  Slide 8:  🎯 Call to Action\n\n  ┌─────────────────────────┐\n  │  Rule: 1 idea per slide │\n  │  Max: 6 bullet points   │\n  │  Font: 24pt minimum     │\n  └─────────────────────────┘", caption: "Great decks follow a story arc: Hook → Problem → Solution → Proof → CTA. Let AI structure it first." },
    { title: "Step 2: Generate Slide Content", visual: "🤖 Prompt Strategy:\n\n  \"Create a 10-slide deck about [topic].\n   For each slide provide:\n   - Headline (max 8 words)\n   - 3 bullet points (max 10 words each)\n   - Speaker note (2-3 sentences)\n   - Suggested visual/chart type\"\n\n          ⬇️\n\n  📊 AI returns structured content\n  you can paste directly into slides!", caption: "The more structured your prompt, the more copy-paste-ready the output. Always request speaker notes." },
    { title: "Step 3: Polish with Design Prompts", visual: "🎨 Design Enhancement:\n\n  Before:              After:\n  ┌──────────┐        ┌──────────────┐\n  │ • Point 1 │        │ 🔵 Point 1   │\n  │ • Point 2 │   →    │ 🟢 Point 2   │\n  │ • Point 3 │        │ 🟡 Point 3   │\n  └──────────┘        │              │\n  Boring bullets       │ [ICON] [STAT]│\n                       └──────────────┘\n                       Visual hierarchy!", caption: "Ask AI: 'Suggest visual layouts for each slide — icons, color coding, chart placement, image suggestions.'" },
  ],
  "m4-l2": [
    { title: "Step 1: Executive Summary Format", visual: "📋 The 5-Part Executive Summary:\n\n  1️⃣ THE ASK    → What you need (1 line)\n  2️⃣ THE WHY    → Why it matters (2 lines)\n  3️⃣ THE HOW    → Your approach (3 bullets)\n  4️⃣ THE PROOF  → Key data points (2-3)\n  5️⃣ THE NEXT   → Immediate next step\n\n  ⏱️ Total read time: Under 2 minutes\n  🎯 Decision-maker friendly", caption: "Executives skim. Structure your summary so the key decision points are visible in under 2 minutes." },
    { title: "Step 2: Pitch Deck Flow", visual: "🚀 Investor Pitch Deck (10 slides):\n\n  1. Cover         →  Brand + tagline\n  2. Problem       →  Pain point + scale\n  3. Solution      →  Your product demo\n  4. Market        →  TAM / SAM / SOM\n  5. Traction      →  Revenue + growth\n  6. Business Model →  How you make $$\n  7. Competition   →  Your moat\n  8. Team          →  Why you'll win\n  9. Financials    →  Projections\n  10. The Ask      →  How much + use of funds", caption: "Every pitch deck follows this proven sequence. AI can generate content for each section from your business description." },
  ],
  "m4-l3": [
    { title: "Choosing the Right Data Visual", visual: "📊 Data Viz Decision Tree:\n\n  What's your goal?\n  │\n  ├─ Compare values? → Bar / Column chart\n  │   └─ Over time?  → Grouped bars\n  │\n  ├─ Show trends?   → Line chart\n  │   └─ Multiple?  → Multi-line + legend\n  │\n  ├─ Show parts?    → Pie (≤5) / Stacked bar\n  │\n  ├─ Correlation?   → Scatter plot\n  │\n  └─ Geographic?    → Heat map / Choropleth", caption: "Match your chart type to your data story. The wrong chart obscures insights; the right one reveals them instantly.", tip: "Prompt AI: 'I have [data description]. What's the best chart type and why?'" },
  ],
  "m4-l5": [
    { title: "Speaker Notes Framework", visual: "🎤 AI Speaker Notes Structure:\n\n  Per Slide:\n  ┌──────────────────────────────┐\n  │ 🔵 OPENING (5 sec)           │\n  │    Transition from last slide│\n  │                              │\n  │ 🟢 KEY POINT (20 sec)        │\n  │    Main message + evidence   │\n  │                              │\n  │ 🟡 ENGAGEMENT (10 sec)       │\n  │    Question or story         │\n  │                              │\n  │ 🔴 BRIDGE (5 sec)            │\n  │    Transition to next slide  │\n  └──────────────────────────────┘\n  ⏱️ ~40 seconds per slide", caption: "Ask AI to write speaker notes with timing cues. Practice with the notes until you can present naturally." },
  ],

  /* ── Module 5: Research & Strategy ── */
  "m5-l1": [
    { title: "Step 1: The Research Funnel", visual: "🔍 AI Research Method:\n\n  BROAD → FOCUSED → DEEP\n\n  Level 1: \"What are the main trends in [industry]?\"\n           → Get the landscape\n           │\n  Level 2: \"Deep dive into [specific trend].\"\n           → Get the details\n           │\n  Level 3: \"Find data/studies supporting [claim].\"\n           → Get the evidence\n\n  🎯 Each level narrows your focus\n  📚 Save sources at every level", caption: "Don't ask one big question. Funnel from broad to specific — each answer informs your next prompt." },
    { title: "Step 2: Source Cross-Referencing", visual: "📋 Verification Matrix:\n\n  Claim: \"Market growing at 15% CAGR\"\n\n  Source 1: Industry Report → ✅ 14.8%\n  Source 2: Analyst Note    → ✅ 15.2%\n  Source 3: News Article    → ⚠️ 22% (outlier)\n  Source 4: Gov Data        → ✅ 14.5%\n\n  Confidence: HIGH (3/4 agree)\n  Action: Flag Source 3, use 14.8-15.2% range\n\n  ⚡ Always verify with 3+ sources!", caption: "AI can hallucinate statistics. Always cross-reference key claims with multiple independent sources." },
  ],
  "m5-l4": [
    { title: "Strategic Planning with AI", visual: "🗺️ Strategic Planning Framework:\n\n  ┌──── VISION ────┐\n  │  Where we're   │\n  │  going (3yr)   │\n  └───────┬────────┘\n          ▼\n  ┌──── GOALS ─────┐\n  │  What we need  │\n  │  to achieve    │\n  └───────┬────────┘\n          ▼\n  ┌── INITIATIVES ─┐\n  │  How we'll     │\n  │  get there     │\n  └───────┬────────┘\n          ▼\n  ┌── KPIs ────────┐\n  │  How we'll     │\n  │  measure       │\n  └────────────────┘", caption: "Ask AI to help cascade from vision → goals → initiatives → KPIs. Each level should clearly support the one above." },
  ],
  "m5-l5": [
    { title: "SWOT Analysis with AI", visual: "📊 AI-Powered SWOT:\n\n  ┌─────────────┬─────────────┐\n  │ STRENGTHS   │ WEAKNESSES  │\n  │ 💪           │ ⚠️           │\n  │ Internal +  │ Internal -  │\n  │             │             │\n  ├─────────────┼─────────────┤\n  │OPPORTUNITIES│  THREATS    │\n  │ 🌟           │ 🔴           │\n  │ External +  │ External -  │\n  │             │             │\n  └─────────────┴─────────────┘\n\n  Prompt: \"Conduct a SWOT for [business]\n  with 5 items per quadrant, ranked by\n  impact. Include action items.\"", caption: "A good SWOT isn't just a list — ask AI to rank items by impact and suggest action items for each.", tip: "Follow up: 'Now create a strategy that leverages our top 2 strengths to capture our top opportunity.'" },
  ],

  /* ── Module 7: Workflow AI ── */
  "m7-l1": [
    { title: "Step 1: Map Your Current Process", visual: "🗺️ Process Mapping:\n\n  START\n    │\n    ▼\n  📧 Email comes in\n    │\n    ├──→ Is it a lead? ──→ YES → Add to CRM\n    │                           │\n    │                    Send welcome email\n    │                           │\n    │                    Schedule follow-up\n    │\n    └──→ NO → Categorize\n              │\n              └──→ Reply or archive\n\n  ⏱️ Current: 15 min per email\n  🎯 Target: 2 min with AI", caption: "Before automating, map every step of your current process. Identify time-consuming manual steps that AI can handle." },
    { title: "Step 2: Identify AI Opportunities", visual: "🤖 Automation Opportunity Map:\n\n  Manual Step          │ AI Can Do?\n  ─────────────────────┼──────────\n  Read email           │ ✅ Classify\n  Determine intent     │ ✅ NLP analysis\n  Look up customer     │ ✅ API lookup\n  Draft response       │ ✅ Generate\n  Human review         │ ⚠️ Assist only\n  Send response        │ ✅ Auto-send\n  Log in CRM           │ ✅ Auto-log\n\n  🟢 Full auto: 5/7 steps\n  🟡 AI-assisted: 1/7 steps\n  📊 Estimated time saved: 80%", caption: "Score each step: Can AI fully automate it, assist with it, or must a human do it? This becomes your automation roadmap." },
  ],
  "m7-l2": [
    { title: "AI Tool Selection Matrix", visual: "🛠️ Tool Selection Framework:\n\n  Task Type        │ Best Tool\n  ─────────────────┼──────────────\n  Text/Writing     │ ChatGPT/Claude\n  Data Analysis    │ Gemini/Code Int.\n  Image Creation   │ Midjourney/DALL-E\n  Automation       │ Zapier/Make\n  Code             │ Copilot/Cursor\n  Research         │ Perplexity\n  Presentations    │ Gamma/Beautiful.ai\n\n  Selection Criteria:\n  ✅ Does it integrate with your stack?\n  ✅ Team skill level match?\n  ✅ Cost vs. time saved?\n  ✅ Data security requirements?", caption: "Don't just pick the trendiest tool. Match tools to your specific task types, team skills, and integration needs." },
  ],
  "m7-l3": [
    { title: "Building Automated Workflows", visual: "⚡ Workflow Architecture:\n\n  TRIGGER          PROCESS          ACTION\n  ────────         ────────         ──────\n  📧 New email  →  🤖 AI classifies → 📁 Sort\n                   🤖 AI drafts    → ✉️ Reply\n                   🤖 AI extracts  → 📊 Log\n\n  📅 Schedule   →  🤖 AI generates → 📋 Report\n                   🤖 AI analyzes  → 🔔 Alert\n\n  💬 Chat msg   →  🤖 AI responds  → ✅ Resolve\n                   🤖 AI escalates → 👤 Human\n\n  Pattern: TRIGGER → AI PROCESS → ACTION", caption: "Every workflow follows: Trigger → AI Process → Action. Start with your highest-volume trigger." },
    { title: "Error Handling & Fallbacks", visual: "🛡️ Robust Workflow Design:\n\n  Input → AI Process\n           │\n           ├─ ✅ Confidence > 90%\n           │     → Auto-execute\n           │\n           ├─ ⚠️ Confidence 70-90%\n           │     → Flag for review\n           │\n           └─ ❌ Confidence < 70%\n                 → Route to human\n                 → Log for training\n\n  Always have a human fallback!\n  Never auto-execute critical actions\n  without confidence thresholds.", caption: "Production AI workflows MUST have confidence thresholds and human fallbacks. Never go full auto on day one." },
  ],
  "m7-l5": [
    { title: "Measuring AI ROI", visual: "📊 AI ROI Calculator:\n\n  BEFORE AI          AFTER AI\n  ──────────         ──────────\n  10 hrs/week    →   2 hrs/week\n  × $50/hr           × $50/hr\n  = $500/week        = $100/week\n\n  💰 Weekly Savings: $400\n  💰 Monthly Savings: $1,600\n  💰 Annual Savings: $19,200\n\n  AI Tool Cost:   -$100/month\n  Net Annual ROI: $18,000\n  ROI %:          1,500% ✅\n\n  Payback period: < 1 week", caption: "Calculate ROI for every AI implementation: (Time saved × hourly cost) - Tool cost = Net savings. Track monthly." },
  ],
};

/* ── Diagram slideshow component ── */
function DiagramSlideshow({ slides }: { slides: DiagramSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const slide = slides[current];

  // Auto-advance
  useState(() => {
    if (!isAutoPlaying) return;
    const t = setInterval(() => setCurrent((c) => c < slides.length - 1 ? c + 1 : (setIsAutoPlaying(false), c)), 5000);
    return () => clearInterval(t);
  });

  return (
    <div className="my-6 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4" />
          <span className="text-sm font-bold">Visual Walkthrough</span>
          <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">{current + 1} / {slides.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide title */}
      <div className="px-5 py-3 border-b border-indigo-100 bg-white/60">
        <h4 className="text-sm font-extrabold text-indigo-900">{slide.title}</h4>
      </div>

      {/* Visual diagram */}
      <div className="px-5 py-4">
        <pre className="text-xs leading-relaxed font-mono text-indigo-800 bg-white/80 p-4 rounded-xl border border-indigo-100 overflow-x-auto whitespace-pre">{slide.visual}</pre>
      </div>

      {/* Caption */}
      <div className="px-5 pb-3">
        <p className="text-sm text-indigo-700/80">{slide.caption}</p>
        {slide.tip && (
          <div className="mt-2 flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700"><strong>Pro Tip:</strong> {slide.tip}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-5 py-3 border-t border-indigo-100 bg-white/40 flex items-center justify-between">
        <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
          className="flex items-center gap-1 text-xs font-bold text-indigo-600 disabled:text-indigo-300 hover:text-indigo-800 transition-colors disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-indigo-500 w-4" : "bg-indigo-200 hover:bg-indigo-300"}`} />
          ))}
        </div>
        <button onClick={() => setCurrent(Math.min(slides.length - 1, current + 1))} disabled={current === slides.length - 1}
          className="flex items-center gap-1 text-xs font-bold text-indigo-600 disabled:text-indigo-300 hover:text-indigo-800 transition-colors disabled:cursor-not-allowed">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ── AI Model configs ── */
const AI_MODELS = [
  { id: "gpt-4o", name: "GPT-4o", icon: "🟢", color: "from-emerald-500 to-green-600", tagline: "Versatile all-rounder",
    best: "General tasks, writing, analysis", note: "Best for: business writing, email drafts, brainstorming" },
  { id: "claude-4", name: "Claude 4", icon: "🟠", color: "from-orange-400 to-amber-600", tagline: "Deep reasoning",
    best: "Research, strategy, nuanced analysis", note: "Best for: long documents, research synthesis, careful reasoning" },
  { id: "gemini-2.5", name: "Gemini 2.5", icon: "🔵", color: "from-blue-500 to-cyan-600", tagline: "Multi-modal & data",
    best: "Data analysis, spreadsheets, visual content", note: "Best for: data tasks, spreadsheet formulas, image analysis" },
];

/* ── Mock datasets for data-related lessons ── */
const MOCK_DATASETS: Record<string, { label: string; description: string; data: string }[]> = {
  "mod-2": [
    { label: "📊 Sales Data (Q1)", description: "Monthly sales by product category",
      data: "Product,Jan,Feb,Mar\nWidgets,12500,14200,13800\nGadgets,8900,9100,10500\nServices,22000,21500,24000\nSupport,5600,6100,5900\n\nTotal Revenue: $148,100\nGrowth: +8.2% vs Q4\nTop performer: Services (+12% MoM in Mar)" },
    { label: "👥 Employee Survey", description: "Engagement scores by department",
      data: "Department,Satisfaction,Engagement,Retention_Risk\nEngineering,4.2/5,87%,Low\nSales,3.6/5,72%,Medium\nMarketing,4.0/5,81%,Low\nSupport,3.1/5,64%,High\nHR,4.5/5,91%,Low\n\nCompany avg: 3.88/5\nYear-over-year change: +0.3\nAction items: Support dept needs immediate attention" },
    { label: "📈 Website Analytics", description: "Weekly traffic & conversion data",
      data: "Week,Visitors,Signups,Conversion,Bounce_Rate,Avg_Session\nW1,12400,186,1.5%,42%,3:24\nW2,13100,210,1.6%,39%,3:45\nW3,11800,165,1.4%,45%,3:12\nW4,15200,289,1.9%,36%,4:02\n\nBest day: Thursday (28% of traffic)\nTop source: Organic Search (44%)\nMobile: 67% of visits" },
  ],
};

/* ── sandbox panel ── */
function SandboxPanel({ lesson, onPass, onFail }: { lesson: Lesson; onPass: (r: string, s: number) => void; onFail: (r: string, s: number) => void }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<null | { score: number; passed: boolean; results: { name: string; hit: boolean; weight: number }[] }>(null);
  const [showHint, setShowHint] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [showDatasets, setShowDatasets] = useState(false);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  // Check if this lesson has mock datasets available
  const moduleId = lesson.moduleId;
  const datasets = MOCK_DATASETS[moduleId] ?? [];
  const hasExamplePrompt = !!lesson.sandbox.examplePrompt;

  const handleSubmit = useCallback(() => {
    setIsGrading(true);
    setTimeout(() => {
      const { score, results } = gradeSandbox(text, lesson.sandbox.criteria, lesson.sandbox.minLength);
      const passed = score >= lesson.sandbox.passingScore;
      setResult({ score, passed, results });
      setIsGrading(false);
      if (passed) onPass(text, score);
      else onFail(text, score);
    }, 1200);
  }, [text, lesson, onPass, onFail]);

  const handleAutoPopulate = (content: string) => {
    setText((prev) => prev ? `${prev}\n\n${content}` : content);
    setResult(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-fuchsia-50 via-purple-50 to-violet-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-fuchsia-200/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg glow-pulse">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-extrabold text-fuchsia-900">AI Sandbox Activity</h2>
            <p className="text-sm text-fuchsia-600/80 mt-0.5 font-medium">{lesson.sandbox.task}</p>
            <p className="text-xs text-fuchsia-500/60 mt-1">{lesson.sandbox.context}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* ── AI MODEL SELECTOR ── */}
        <div className="relative">
          <button
            onClick={() => setShowModelInfo(!showModelInfo)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-violet-200 bg-violet-50/50 hover:bg-violet-50 transition-colors group"
          >
            <span className="text-xl">{selectedModel.icon}</span>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-violet-800">{selectedModel.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-200/60 text-violet-600 font-semibold">{selectedModel.tagline}</span>
              </div>
              <p className="text-[11px] text-violet-500">{selectedModel.note}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-violet-400 transition-transform ${showModelInfo ? "rotate-180" : ""}`} />
          </button>

          {showModelInfo && (
            <div className="mt-2 p-3 bg-white rounded-xl border border-violet-200 shadow-lg space-y-2 flash-in z-10 relative">
              <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wide mb-2">Choose Your AI Model</p>
              {AI_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setSelectedModel(m); setShowModelInfo(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all hover:shadow-md ${
                    selectedModel.id === m.id
                      ? "border-violet-400 bg-violet-50 shadow-sm"
                      : "border-transparent hover:border-gray-200 bg-gray-50/50"
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground">{m.best}</p>
                  </div>
                  {selectedModel.id === m.id && <Check className="w-4 h-4 text-violet-500" />}
                </button>
              ))}
              <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg mt-2">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700">
                  <strong>Tip:</strong> Different AI models excel at different tasks. Try switching models to see how the same prompt produces different results — this is a real skill used in professional AI workflows!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── MOCK DATASETS (for data modules) ── */}
        {datasets.length > 0 && (
          <div>
            <button onClick={() => setShowDatasets(!showDatasets)}
              className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors border border-blue-200">
              <RotateCcw className="w-3.5 h-3.5" />
              {showDatasets ? "Hide" : "Show"} Mock Datasets
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-200 text-[10px] font-bold">{datasets.length}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showDatasets ? "rotate-180" : ""}`} />
            </button>

            {showDatasets && (
              <div className="mt-2 space-y-2 flash-in">
                {datasets.map((ds, i) => (
                  <div key={i} className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <p className="text-xs font-bold text-blue-700">{ds.label}</p>
                        <p className="text-[10px] text-blue-500">{ds.description}</p>
                      </div>
                      <button
                        onClick={() => handleAutoPopulate(ds.data)}
                        className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-bold transition-colors flex items-center gap-1 hover:scale-105 active:scale-95"
                      >
                        <Zap className="w-3 h-3" /> Auto-Fill
                      </button>
                    </div>
                    <pre className="text-[10px] text-blue-600/70 bg-white/60 p-2 rounded-lg overflow-x-auto max-h-20 font-mono">{ds.data}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── AUTO-POPULATE EXAMPLE PROMPT ── */}
        {hasExamplePrompt && (
          <button
            onClick={() => handleAutoPopulate(lesson.sandbox.examplePrompt!)}
            className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition-colors border border-emerald-200 group"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover:text-amber-500 transition-colors" />
            Auto-Populate Example Prompt
            <span className="text-[10px] text-emerald-400 ml-1">(edit to make it your own!)</span>
          </button>
        )}

        {/* Hint toggle */}
        <button onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-xs font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-2 rounded-xl transition-colors border border-violet-200">
          <AlertCircle className="w-4 h-4" />
          {showHint ? "Hide" : "Show"} Grading Criteria
          <ChevronDown className={`w-3 h-3 transition-transform ${showHint ? "rotate-180" : ""}`} />
        </button>

        {showHint && (
          <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl flash-in">
            <p className="text-xs font-bold text-violet-700 mb-2 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> What we're grading:</p>
            <div className="grid grid-cols-2 gap-1.5">
              {lesson.sandbox.criteria.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5 text-xs text-violet-600 bg-white/70 px-2.5 py-1.5 rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  <span className="font-medium">{c.name}</span>
                  <span className="text-violet-400 ml-auto">{c.weight}pts</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-violet-400 mt-2">Min {lesson.sandbox.minLength} words · Pass at {lesson.sandbox.passingScore}%</p>
          </div>
        )}

        {/* Model badge + text area */}
        <div className="relative">
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 shadow-sm">
            <span className="text-sm">{selectedModel.icon}</span>
            <span className="text-[10px] font-bold text-gray-500">{selectedModel.name}</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setResult(null); }}
            placeholder={`Write your AI prompt for ${selectedModel.name}... Be specific, include context, and address all the criteria.`}
            rows={10}
            className="w-full rounded-2xl border-2 p-5 pt-12 text-sm focus:outline-none focus:ring-4 focus:ring-fuchsia-300/30 focus:border-fuchsia-400 resize-y bg-background transition-all duration-200"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
              wordCount >= lesson.sandbox.minLength ? "bg-emerald-100 text-emerald-600" :
              wordCount >= lesson.sandbox.minLength * 0.5 ? "bg-amber-100 text-amber-600" :
              "bg-gray-100 text-gray-400"
            }`}>
              {wordCount}/{lesson.sandbox.minLength} words
            </div>
          </div>
        </div>

        {/* Grading animation */}
        {isGrading && (
          <div className="flex items-center justify-center py-8 gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-fuchsia-200 border-t-fuchsia-500 animate-spin" />
            <span className="font-bold text-fuchsia-600">
              {selectedModel.name} is grading your prompt...
            </span>
            <Sparkles className="w-5 h-5 text-fuchsia-400 float-particle" />
          </div>
        )}

        {/* Results */}
        {result && !isGrading && (
          <div className={`flash-in rounded-2xl p-5 space-y-4 border-2 ${
            result.passed
              ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300"
              : "bg-gradient-to-br from-red-50 to-orange-50 border-red-300"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-extrabold shadow-lg ${
                  result.passed
                    ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                    : "bg-gradient-to-br from-red-500 to-orange-500 text-white"
                }`}>
                  <span className="text-2xl">{result.score}</span>
                  <span className="text-[10px] -mt-0.5">/ 100</span>
                </div>
                <div>
                  <p className={`font-extrabold text-lg ${result.passed ? "text-emerald-600" : "text-red-600"}`}>
                    {result.passed ? "🎉 Excellent!" : "Almost there!"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {result.passed ? "Your prompt passed! Quiz unlocked." : "Revise and address the missing criteria."}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">Graded by {selectedModel.name}</p>
                </div>
              </div>
              {result.passed && <div className="text-4xl confetti-burst">🏆</div>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {result.results.map((r) => (
                <div key={r.name}
                  className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl border transition-all ${
                    r.hit
                      ? "bg-emerald-100/80 border-emerald-200 text-emerald-700"
                      : "bg-red-100/80 border-red-200 text-red-600"
                  }`}>
                  {r.hit ? <Check className="w-4 h-4 text-emerald-500 shrink-0" /> : <X className="w-4 h-4 text-red-400 shrink-0" />}
                  <span className="font-semibold">{r.name}</span>
                  <span className="ml-auto font-bold">{r.hit ? `+${r.weight}` : "0"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit button */}
        {!isGrading && (
          <button onClick={handleSubmit} disabled={wordCount < 10}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-extrabold text-base hover:shadow-xl hover:scale-[1.01] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2 scale-tap">
            <Zap className="w-5 h-5" />
            {result && !result.passed ? "Resubmit for Grading" : "Submit for AI Grading"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── quiz panel ── */
function QuizPanel({ lesson, alreadyPassed, onPass, onFail, nextLessonId }: { lesson: Lesson; alreadyPassed: boolean; onPass: (s: number) => void; onFail: (s: number) => void; nextLessonId: string | null }) {
  const questions = lesson.quiz.questions;
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(alreadyPassed);
  const [score, setScore] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakingQ, setShakingQ] = useState<number | null>(null);

  const handleAnswer = (qi: number, oi: number) => {
    if (submitted) return;
    const next = [...answers];
    next[qi] = oi;
    setAnswers(next);
  };

  const handleSubmit = () => {
    const correct = questions.filter((q, i) => answers[i] === q.correctIndex).length;
    const pct = Math.round((correct / questions.length) * 100);
    const passed = pct >= lesson.quiz.passingPercent;
    setScore(pct);
    setSubmitted(true);
    if (passed) {
      onPass(pct);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      onFail(pct);
      // Shake wrong answers
      questions.forEach((q, i) => {
        if (answers[i] !== q.correctIndex) {
          setTimeout(() => { setShakingQ(i); setTimeout(() => setShakingQ(null), 500); }, i * 100);
        }
      });
    }
  };

  const handleRetry = () => {
    setAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
    setScore(null);
  };

  const passed = score !== null && score >= lesson.quiz.passingPercent;
  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-lg">
            <ClipboardCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-extrabold text-amber-900">Lesson Quiz</h2>
            <p className="text-sm text-amber-600/70 mt-0.5">
              Score at least {lesson.quiz.passingPercent}% to unlock the next lesson. {questions.length} questions.
            </p>
          </div>
        </div>

        {/* Progress dots */}
        {!submitted && (
          <div className="flex items-center gap-1.5 mt-3 relative z-10">
            {questions.map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${
                answers[i] !== null
                  ? "bg-amber-500 scale-110"
                  : "bg-amber-200"
              }`} />
            ))}
            <span className="text-xs text-amber-600 ml-2 font-bold">{answeredCount}/{questions.length}</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {alreadyPassed && !score && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4 text-emerald-700 text-sm font-bold flex items-center gap-3 flash-in">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p>Already passed! 🎉</p>
              <p className="font-normal text-xs text-emerald-600 mt-0.5">You can review the questions or retake for fun.</p>
            </div>
          </div>
        )}

        {questions.map((q, qi) => (
          <div key={qi} className={`space-y-2.5 ${shakingQ === qi ? "shake" : ""}`}>
            <p className="font-bold text-sm flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs flex items-center justify-center font-extrabold shrink-0">
                {qi + 1}
              </span>
              {q.question}
            </p>
            <div className="grid gap-2 pl-9">
              {q.options.map((opt, oi) => {
                const selected = answers[qi] === oi;
                const isCorrect = oi === q.correctIndex;

                let classes = "border-2 rounded-xl px-4 py-3 text-sm transition-all duration-200 text-left w-full flex items-center gap-2 scale-tap";
                if (submitted) {
                  if (isCorrect) classes += " bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-200";
                  else if (selected && !isCorrect) classes += " bg-red-50 border-red-400 text-red-700";
                  else classes += " bg-muted/20 border-border/50 text-muted-foreground";
                } else {
                  classes += selected
                    ? " bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-200 shadow-md"
                    : " bg-card border-border hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-sm";
                }

                return (
                  <button key={oi} className={classes} onClick={() => handleAnswer(qi, oi)}>
                    <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shrink-0 ${
                      submitted && isCorrect ? "bg-emerald-500 text-white" :
                      submitted && selected && !isCorrect ? "bg-red-500 text-white" :
                      selected ? "bg-amber-500 text-white" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {submitted && isCorrect ? <Check className="w-3 h-3" /> :
                       submitted && selected && !isCorrect ? <X className="w-3 h-3" /> :
                       String.fromCharCode(65 + oi)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {submitted && isCorrect && <Sparkles className="w-4 h-4 text-emerald-500" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation popover after submit */}
            {submitted && answers[qi] !== null && (
              <div className="pl-9 flash-in">
                <div className={`text-xs p-3 rounded-xl border ${
                  answers[qi] === q.correctIndex
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-700"
                    : "bg-amber-50/80 border-amber-200 text-amber-700"
                }`}>
                  <span className="font-bold">{answers[qi] === q.correctIndex ? "✅ Correct! " : "💡 Explanation: "}</span>
                  {q.explanation}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Score result */}
        {submitted && score !== null && (
          <div className={`flash-in rounded-2xl p-6 text-center border-2 relative overflow-hidden ${
            passed
              ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300"
              : "bg-gradient-to-br from-red-50 to-orange-50 border-red-300"
          }`}>
            {passed && showConfetti && (
              <>
                <div className="absolute top-2 left-4 text-2xl confetti-burst">🎊</div>
                <div className="absolute top-2 right-4 text-2xl confetti-burst" style={{ animationDelay: "0.2s" }}>🎉</div>
              </>
            )}
            <div className={`inline-flex w-20 h-20 rounded-full items-center justify-center mb-3 shadow-xl ${
              passed ? "bg-gradient-to-br from-emerald-500 to-teal-500" : "bg-gradient-to-br from-red-500 to-orange-500"
            }`}>
              <span className="text-3xl font-black text-white">{score}%</span>
            </div>
            <p className={`font-extrabold text-xl ${passed ? "text-emerald-600" : "text-red-600"}`}>
              {passed ? "🎉 Passed! Amazing work!" : `Need ${lesson.quiz.passingPercent}% to pass`}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {passed
                ? `You scored ${score}%! +${lesson.xpReward} XP earned.`
                : "Review the explanations above and try again."}
            </p>
            {passed && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
                <Star className="w-4 h-4" /> +{lesson.xpReward} XP Earned!
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        {!submitted ? (
          <button onClick={handleSubmit} disabled={answers.some((a) => a === null)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-base hover:shadow-xl hover:scale-[1.01] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 scale-tap">
            <ClipboardCheck className="w-5 h-5" />
            Submit Quiz
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-white/20 text-xs">{answeredCount}/{questions.length}</span>
          </button>
        ) : !passed ? (
          <button onClick={handleRetry}
            className="w-full py-4 rounded-2xl border-2 border-amber-300 text-amber-700 font-extrabold hover:bg-amber-50 transition-all duration-200 flex items-center justify-center gap-2 scale-tap">
            <RotateCcw className="w-5 h-5" /> Try Again
          </button>
        ) : (
          /* Next Lesson / Complete CTA after passing */
          nextLessonId ? (
            <Link to={`/lessons/${nextLessonId}`}
              className="flash-in w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 text-white font-extrabold text-base hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 scale-tap gradient-loop">
              <Sparkles className="w-5 h-5" /> Next Lesson <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link to="/dashboard"
              className="flash-in w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-base hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 scale-tap">
              <Trophy className="w-5 h-5" /> Back to Dashboard <ChevronRight className="w-5 h-5" />
            </Link>
          )
        )}
      </div>
    </div>
  );
}

/* ── enhanced markdown ── */
function enhancedMarkdown(md: string): string {
  /* ── parse tables first (group consecutive pipe-rows into one <table>) ── */
  const lines = md.split('\n');
  const processed: string[] = [];
  let tableRows: string[][] = [];
  let hasHeader = false;

  const flushTable = () => {
    if (tableRows.length === 0) return;
    let html = '<table class="w-full border-collapse my-4 rounded-xl overflow-hidden shadow-sm border border-fuchsia-100">';
    tableRows.forEach((cells, ri) => {
      if (ri === 0 && hasHeader) {
        html += '<thead class="bg-gradient-to-r from-fuchsia-50 to-violet-50"><tr>';
        cells.forEach(c => { html += `<th class="border border-fuchsia-100 px-4 py-2.5 text-xs font-bold text-fuchsia-800 text-left">${c}</th>`; });
        html += '</tr></thead><tbody>';
      } else {
        const bg = (ri % 2 === 0) ? 'bg-white' : 'bg-fuchsia-50/30';
        html += `<tr class="${bg}">`;
        cells.forEach(c => { html += `<td class="border border-fuchsia-100 px-4 py-2 text-xs text-foreground">${c}</td>`; });
        html += '</tr>';
      }
    });
    if (hasHeader) html += '</tbody>';
    html += '</table>';
    processed.push(html);
    tableRows = [];
    hasHeader = false;
  };

  for (const line of lines) {
    const pipeMatch = line.match(/^\|(.+)\|$/);
    if (pipeMatch) {
      const cells = pipeMatch[1].split('|').map(c => c.trim());
      // separator row (|---|---|)
      if (cells.every(c => /^[-:]+$/.test(c))) { hasHeader = true; continue; }
      tableRows.push(cells);
    } else {
      flushTable();
      processed.push(line);
    }
  }
  flushTable();

  /* ── inline + block formatting ── */
  return processed.join('\n')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-extrabold mt-6 mb-2 flex items-center gap-2"><span class="w-1.5 h-5 rounded-full bg-gradient-to-b from-fuchsia-500 to-violet-500 inline-block"></span>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-extrabold mt-8 mb-3 text-foreground">$1</h2>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-fuchsia-400 pl-4 py-2 my-3 text-sm bg-gradient-to-r from-fuchsia-50 to-transparent rounded-r-xl">$1</blockquote>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-fuchsia-700">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-fuchsia-50 text-fuchsia-700 px-2 py-0.5 rounded-lg text-xs font-mono font-bold border border-fuchsia-200">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm leading-relaxed">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-sm leading-relaxed">$1</li>')
    .replace(/^(❌|✅) (.+)$/gm, '<p class="text-sm my-1 pl-1">$1 $2</p>')
    .replace(/\n{2,}/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}
