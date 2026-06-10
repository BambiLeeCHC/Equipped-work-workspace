import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  BarChart3,
  FileText,
  Presentation,
  Search,
  Mail,
  Workflow,
  Sparkles,
  Lock,
  Unlock,
  Crown,
  Check,
  ChevronRight,
  Star,
  Zap,
  Trophy,
  Shield,
  Play,
} from "lucide-react";

/* ─── rotating hero text ─── */
const ROTATING_WORDS = [
  "Presentation Creation",
  "Meeting Transcription",
  "Business Writing",
  "Data Analysis",
  "Email Automation",
  "Deep Research",
  "Workflow AI",
];

function useRotatingText(words: string[], interval = 2800) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words, interval]);
  return words[index];
}

/* ─── monogram SVG pattern ─── */
function MonogramBg({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern id="monogram" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <text x="30" y="70" fontFamily="Georgia, serif" fontSize="48" fontWeight="bold" fill="#a855f7" opacity="0.5">E</text>
            <text x="70" y="100" fontFamily="Georgia, serif" fontSize="32" fontWeight="bold" fill="#d946ef" opacity="0.35">W</text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#monogram)" />
      </svg>
    </div>
  );
}

/* ─── lucite glass card ─── */
function LuciteCard({
  children,
  className = "",
  glow = false,
  borderColor = "border-white/20",
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  borderColor?: string;
}) {
  return (
    <div
      className={`relative backdrop-blur-xl border ${borderColor} rounded-2xl overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 100%)",
        boxShadow: glow
          ? "0 0 40px rgba(168,85,247,0.08), 0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)"
          : "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      {/* lucite edge highlight */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
      }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ─── gradient loop button ─── */
function GradientButton({
  children,
  className = "",
  size = "lg",
  as = "button",
  to = "",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "lg" | "sm";
  as?: "button" | "link";
  to?: string;
}) {
  const inner = (
    <span
      className={`relative z-10 inline-flex items-center justify-center gap-2 font-semibold text-white ${
        size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm"
      }`}
    >
      {children}
    </span>
  );

  const buttonClasses = `group relative overflow-hidden rounded-full cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] ${className}`;

  const Wrapper = as === "link" ? Link : "button";
  const props = as === "link" ? { to } : {};

  return (
    <Wrapper className={buttonClasses} {...(props as any)}>
      {/* animated gradient background */}
      <div className="absolute inset-0 gradient-loop rounded-full" />
      {/* shimmer overlay */}
      <div className="absolute inset-0 shimmer-flash rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {inner}
    </Wrapper>
  );
}

/* ─── module data ─── */
const MODULES = [
  { num: "01", title: "AI Prompting", desc: "Foundation of all AI interaction", icon: Brain, tier: "free" as const },
  { num: "02", title: "Data & Analysis", desc: "Insights, spreadsheets, dashboards", icon: BarChart3, tier: "free" as const },
  { num: "03", title: "Business Writing", desc: "Reports, proposals, white papers", icon: FileText, tier: "pro" as const },
  { num: "04", title: "Presentations", desc: "Decks, slides, pitch materials", icon: Presentation, tier: "pro" as const },
  { num: "05", title: "Research", desc: "Synthesis, analysis, briefings", icon: Search, tier: "pro" as const },
  { num: "06", title: "Email & Comms", desc: "Client emails, follow-ups, inbox", icon: Mail, tier: "pro" as const },
  { num: "07", title: "Workflow AI", desc: "Automation, mapping, scaling", icon: Workflow, tier: "pro" as const },
];

const FEATURES = [
  { icon: Brain, title: "Full AI Business Curriculum", desc: "From prompt fundamentals to advanced business applications — presentations, transcription, research, writing, and workflow automation.", color: "fuchsia" as const },
  { icon: Presentation, title: "Presentation & Slide Mastery", desc: "Use AI to build compelling decks, executive summaries, and pitch materials in a fraction of the time.", color: "violet" as const },
  { icon: Play, title: "Meeting Transcription & Summaries", desc: "Capture, transcribe, and distil meetings into action items, decisions, and follow-up emails automatically.", color: "blue" as const },
  { icon: Zap, title: "Live AI Sandbox", desc: "Experiment with multiple AI models in real-time. Test, iterate, and refine prompts with full control.", color: "emerald" as const },
  { icon: Trophy, title: "XP & Level System", desc: "Earn XP for every lesson completed. Build daily streaks, level up, and track your mastery progress.", color: "amber" as const },
  { icon: Shield, title: "Verified Access", desc: "Premium content is gated behind verified accounts. Admins approve access to ensure quality cohorts.", color: "rose" as const },
];

const SKILL_TAGS = [
  "Presentations", "Transcription", "Business Writing", "Data Analysis",
  "Email Automation", "Research", "Client Comms", "Workflow AI",
];

/* ─── color maps ─── */
function getFeatureColors(color: "fuchsia" | "violet" | "blue" | "emerald" | "amber" | "rose") {
  const map = {
    fuchsia: { iconBg: "bg-fuchsia-500/15", iconText: "text-fuchsia-600", border: "border-fuchsia-300/40" },
    violet: { iconBg: "bg-violet-500/15", iconText: "text-violet-600", border: "border-violet-300/40" },
    blue: { iconBg: "bg-blue-500/15", iconText: "text-blue-600", border: "border-blue-300/40" },
    emerald: { iconBg: "bg-emerald-500/15", iconText: "text-emerald-600", border: "border-emerald-300/40" },
    amber: { iconBg: "bg-amber-500/15", iconText: "text-amber-600", border: "border-amber-300/40" },
    rose: { iconBg: "bg-rose-500/15", iconText: "text-rose-600", border: "border-rose-300/40" },
  };
  return map[color];
}

function getTierStyle(tier: "free" | "pro" | "business" | "elite" | "master") {
  switch (tier) {
    case "free": return { bg: "bg-emerald-500/15", text: "text-emerald-600", label: "FREE" };
    case "pro": return { bg: "bg-violet-500/15", text: "text-violet-600", label: "PRO" };
    case "business": return { bg: "bg-violet-500/15", text: "text-violet-600", label: "BUSINESS" };
    case "elite": return { bg: "bg-fuchsia-500/15", text: "text-fuchsia-600", label: "PRO" };
    case "master": return { bg: "bg-amber-500/15", text: "text-amber-600", label: "PRO" };
  }
}

/* Module icon colors cycling through spectrum */
function getModuleIconColor(idx: number) {
  const colors = [
    { bg: "bg-fuchsia-500/15", text: "text-fuchsia-600" },
    { bg: "bg-violet-500/15", text: "text-violet-600" },
    { bg: "bg-blue-500/15", text: "text-blue-600" },
    { bg: "bg-indigo-500/15", text: "text-indigo-600" },
    { bg: "bg-purple-500/15", text: "text-purple-600" },
    { bg: "bg-pink-500/15", text: "text-pink-600" },
    { bg: "bg-rose-500/15", text: "text-rose-600" },
  ];
  return colors[idx % colors.length];
}

/* ─── pricing tiers ─── */
const TIERS = [
  {
    name: "Free",
    price: "Free",
    period: "",
    desc: "Start your AI mastery journey",
    modules: ["AI Prompting (C.R.A.F.T.)", "Data & Analysis"],
    features: ["2 core modules (10 lessons)", "AI-graded sandbox", "Progress tracking & XP"],
    cta: "Start Free",
    highlight: false,
    isMaster: false,
  },
  {
    name: "Pro",
    price: "$34.99",
    period: "/mo",
    desc: "Unlock the full curriculum",
    modules: ["All 7 modules (35 lessons)"],
    features: ["Everything in Free", "AI model switching", "Mock datasets & auto-populate", "Certificates", "Priority support"],
    cta: "Go Pro",
    highlight: true,
    isMaster: false,
  },
  {
    name: "Business",
    price: "$69.99",
    period: "/mo",
    desc: "Course + Workspace bundle",
    modules: ["All 7 modules + Work[space]"],
    features: ["Everything in Pro", "3D interactive workspace", "Meeting insights & transcription", "Auto action lists", "1-on-1 coaching"],
    cta: "Get Business",
    highlight: false,
    isMaster: true,
  },
];

/* ═══════════════════════════════════════════════════════ */
/*                    LANDING PAGE                        */
/* ═══════════════════════════════════════════════════════ */

export function LandingPage() {
  const rotatingWord = useRotatingText(ROTATING_WORDS);

  return (
    <div className="min-h-screen bg-[#f8f8f7] text-[#34322D] overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-black/5" style={{ background: "rgba(248,248,247,0.85)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-lg tracking-tight inline-flex items-center">
              <span style={{
                background: "linear-gradient(180deg, #d946ef, #8b5cf6, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text" as any,
                filter: "drop-shadow(0 0 6px rgba(217,70,239,0.3))",
              }}>E</span>
              <span className="text-[#34322D]/70">-Quipped:</span>{" "}
              <span className="text-[#34322D] ml-0.5">Work</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#34322D]/60">
            <a href="#modules" className="hover:text-fuchsia-600 transition-colors">Explore</a>
            <a href="#pricing" className="hover:text-fuchsia-600 transition-colors">Pricing</a>
            <Link to="/workspace" className="hover:text-fuchsia-600 transition-colors font-semibold">
              Work<span className="inline-block px-1.5 py-[1px] ml-0.5 rounded-[3px] bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white text-xs font-bold">Space</span>
            </Link>
            <Link to="/login" className="hover:text-fuchsia-600 transition-colors">Sign In</Link>
            <GradientButton as="link" to="/signup" size="sm">
              Get Started Free
            </GradientButton>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-24 sm:pt-36 pb-16 sm:pb-24 px-3 sm:px-6 flex flex-col items-center text-center overflow-hidden">
        <MonogramBg opacity={0.04} />

        {/* floating orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-25" style={{ background: "radial-gradient(oklch(0.85 0.12 330) 0%, transparent 70%)" }} />
        <div className="absolute bottom-10 right-[10%] w-96 h-96 rounded-full opacity-pulse-slow" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-[15%] w-72 h-72 rounded-full opacity-pulse" style={{ background: "radial-gradient(circle, rgba(217,70,239,0.1) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full color-loop-orb" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-fuchsia-300/30 bg-white/60 backdrop-blur-sm text-xs font-medium text-fuchsia-700 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-500" />
            AI Business Mastery Platform
          </div>

          <h1 className="text-[clamp(1.4rem,5vw,4.5rem)] sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 px-4 sm:px-0">
            Master AI for
            <br />
            <span className="text-transparent bg-clip-text gradient-text-loop inline-block min-h-[1.15em] max-w-[85vw] sm:max-w-none break-words">
              {rotatingWord}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#34322D]/55 max-w-2xl mx-auto leading-relaxed mb-8">
            E-Quipped: Work teaches you to use AI across every dimension of modern business — from prompt engineering foundations to presentations, transcription, research, writing, and automated workflows.
          </p>

          {/* skill tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {SKILL_TAGS.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-fuchsia-200/40 bg-white/50 backdrop-blur-sm text-[#34322D]/60 hover:bg-white/80 hover:border-fuchsia-300/50 transition-all cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton as="link" to="/signup" size="lg">
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </GradientButton>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-black/10 text-[#34322D]/70 font-medium hover:bg-white/60 hover:border-fuchsia-300/40 transition-all backdrop-blur-sm bg-white/30"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section id="modules" className="py-12 sm:py-24 px-4 sm:px-6 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(transparent 0%, oklch(0.93 0.025 20 / 0.25) 50%, transparent 100%)" }} />
        <MonogramBg opacity={0.025} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              One platform.{" "}
              <span className="text-transparent bg-clip-text gradient-text-loop">Every AI skill.</span>
            </h2>
            <p className="text-lg text-[#34322D]/55 max-w-2xl mx-auto">
              Courses are structured so each skill builds on the last — starting with prompt engineering and expanding into the full spectrum of AI-powered business work.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {MODULES.map((mod, i) => {
              const ts = getTierStyle(mod.tier);
              const mc = getModuleIconColor(i);
              const Icon = mod.icon;
              return (
                <LuciteCard key={mod.num} className="p-5 text-center group hover:scale-[1.03] transition-transform duration-300" glow={mod.tier === "free"} borderColor="border-black/5">
                  <div className="text-xs font-bold text-[#34322D]/30 mb-3">{mod.num}</div>
                  <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center ${mc.bg}`}>
                    <Icon className={`w-5 h-5 ${mc.text}`} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{mod.title}</h3>
                  <p className="text-xs text-[#34322D]/45 leading-snug">{mod.desc}</p>
                  <div className={`mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${ts.text}`}>
                    {mod.tier === "free" ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {ts.label}
                  </div>
                </LuciteCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need to{" "}
              <span className="text-transparent bg-clip-text gradient-text-loop">master AI</span>
            </h2>
            <p className="text-lg text-[#34322D]/55 max-w-xl mx-auto">
              A complete learning ecosystem built for the AI era of business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              const fc = getFeatureColors(feat.color);
              return (
                <LuciteCard
                  key={feat.title}
                  className="p-6 group hover:scale-[1.02] transition-transform duration-300"
                  glow
                  borderColor={fc.border}
                >
                  <div className={`w-10 h-10 rounded-xl ${fc.iconBg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${fc.iconText}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feat.title}</h3>
                  <p className="text-sm text-[#34322D]/55 leading-relaxed">{feat.desc}</p>
                </LuciteCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSE ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Courses</h2>
              <p className="text-[#34322D]/55 mt-2">Start your AI mastery journey today.</p>
            </div>
            <button className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[#34322D]/60 border border-black/10 rounded-full px-5 py-2 hover:bg-white/60 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <LuciteCard className="max-w-lg overflow-hidden" glow borderColor="border-fuchsia-200/30">
            {/* course card gradient header */}
            <div className="h-40 gradient-loop flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="p-6">
              <div className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-fuchsia-500/10 text-fuchsia-600 border border-fuchsia-200/30 mb-3">
                Beginner
              </div>
              <h3 className="font-bold text-lg mb-2">E-Quipped: Work — AI for Business Mastery</h3>
              <p className="text-sm text-[#34322D]/55 mb-4">
                Master AI across every dimension of modern business — from prompt engineering foundations to automated workflows. Seven modules, 36 lessons, unlimited sandbox practice.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-amber-600">
                  <Sparkles className="w-4 h-4" /> 2500 XP
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-600 border border-violet-200/30">
                  Premium
                </span>
              </div>
            </div>
          </LuciteCard>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <MonogramBg opacity={0.03} />
        {/* large decorative orb */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-pulse-slow" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Unlock your{" "}
              <span className="text-transparent bg-clip-text gradient-text-loop">AI potential</span>
            </h2>
            <p className="text-lg text-[#34322D]/55 max-w-2xl mx-auto">
              Start free with core modules. Unlock advanced skills as you grow. Each tier builds on the last.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            {TIERS.map((tier) => (
              <LuciteCard
                key={tier.name}
                className={`p-7 flex flex-col ${tier.highlight ? "ring-2 ring-fuchsia-400/40 scale-[1.02]" : ""} ${tier.isMaster ? "md:col-span-2 xl:col-span-1" : ""}`}
                glow={tier.highlight || tier.isMaster}
                borderColor={tier.highlight ? "border-fuchsia-300/40" : tier.isMaster ? "border-amber-300/40" : "border-black/5"}
              >
                {tier.highlight && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white gradient-loop rounded-b-lg">
                    Most Popular
                  </div>
                )}
                {tier.isMaster && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-amber-600 rounded-b-lg flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Capstone
                  </div>
                )}

                <div className="pt-2">
                  <h3 className="font-bold text-lg mb-1">{tier.name}</h3>
                  <p className="text-sm text-[#34322D]/55 mb-5">{tier.desc}</p>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-sm text-[#34322D]/40">{tier.period}</span>}
                  </div>

                  <div className="text-xs text-[#34322D]/40 mb-6">
                    Modules: {tier.modules.join(" + ")}
                  </div>

                  <GradientButton as="link" to="/signup" size="sm" className="w-full mb-6">
                    {tier.cta}
                  </GradientButton>

                  <ul className="space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[#34322D]/70">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </LuciteCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-px rounded-3xl shimmer-border">
            <LuciteCard className="p-10 md:p-14 text-center relative overflow-hidden rounded-3xl" glow borderColor="border-transparent">
              {/* background gradient wash */}
              <div className="absolute inset-0 gradient-loop opacity-[0.04] rounded-3xl" />
              <MonogramBg opacity={0.04} />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl gradient-loop flex items-center justify-center mx-auto mb-6 shadow-lg shadow-fuchsia-500/20">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Ready to become an AI-powered professional?
                </h2>
                <p className="text-lg text-[#34322D]/60 max-w-xl mx-auto mb-6">
                  Join E-Quipped: Work and master AI across every skill that matters in modern business — from prompt engineering to presentations, transcription, research, and beyond.
                </p>
                <ul className="flex flex-col sm:flex-row flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-[#34322D]/70 mb-8">
                  {["7 modules · 36 in-depth lessons", "Live AI sandbox with quality scoring", "Start free — upgrade when ready", "7-day money-back guarantee"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <GradientButton as="link" to="/signup" size="lg">
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </GradientButton>
              </div>
            </LuciteCard>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-black/5 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-extrabold text-lg tracking-tight inline-flex items-center">
                <span style={{
                  background: "linear-gradient(180deg, #d946ef, #8b5cf6, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text" as any,
                  filter: "drop-shadow(0 0 6px rgba(217,70,239,0.3))",
                }}>E</span>
                <span className="text-[#34322D]/70">-Quipped:</span>{" "}
                <span className="text-[#34322D] ml-0.5">Work</span>
              </span>
            </div>
            <p className="text-sm text-[#34322D]/55 max-w-xs">
              The AI skills platform for professionals who want to work smarter.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <h4 className="font-semibold mb-3 text-[#34322D]/70">Navigate</h4>
              <ul className="space-y-2 text-[#34322D]/45">
                <li><a href="#" className="hover:text-fuchsia-600 transition-colors">Home</a></li>
                <li><a href="#modules" className="hover:text-fuchsia-600 transition-colors">Courses</a></li>
                <li><a href="#pricing" className="hover:text-fuchsia-600 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[#34322D]/70">Legal</h4>
              <ul className="space-y-2 text-[#34322D]/45">
                <li><a href="/legal/terms" className="hover:text-fuchsia-600 transition-colors">Terms of Service</a></li>
                <li><a href="/legal/privacy" className="hover:text-fuchsia-600 transition-colors">Privacy Policy</a></li>
                <li><a href="/legal/refund" className="hover:text-fuchsia-600 transition-colors">Refund Policy</a></li>
                <li><a href="/legal/acceptable-use" className="hover:text-fuchsia-600 transition-colors">Acceptable Use</a></li>
                <li><a href="/legal/accessibility" className="hover:text-fuchsia-600 transition-colors">Accessibility</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-black/5 flex flex-col sm:flex-row justify-between text-xs text-[#34322D]/35">
          <span>© {new Date().getFullYear()} XI Eleven XVI Sixteen LLC d/b/a E-Quipped: Work. All rights reserved.</span>
          <a href="mailto:equippedbyxixvi@gmail.com" className="hover:text-fuchsia-600 transition-colors">equippedbyxixvi@gmail.com</a>
        </div>
      </footer>
    </div>
  );
}
