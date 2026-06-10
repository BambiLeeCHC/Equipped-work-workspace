import { useQuery, useAction } from "convex/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap, Crown, Rocket, Check, ArrowLeft, Sparkles, Lock, Calendar,
  Building2, Users, Video, FileText, Brain, Mic
} from "lucide-react";
import { api } from "../../convex/_generated/api";

type BillingCycle = "weekly" | "monthly" | "yearly";

/* ─── COURSE PLANS ─── */

interface CoursePlan {
  id: string;
  name: string;
  pricing: { weekly: string; monthly: string; yearly: string };
  description: string;
  icon: typeof Zap;
  color: string;
  features: string[];
  cta: string;
  popular?: boolean;
  isFree?: boolean;
  note?: string;
}

const COURSE_PLANS: CoursePlan[] = [
  {
    id: "free",
    name: "Free",
    pricing: { weekly: "$0", monthly: "$0", yearly: "$0" },
    description: "Start your AI journey",
    icon: Zap,
    color: "from-gray-400 to-gray-500",
    features: [
      "2 modules (10 lessons)",
      "C.R.A.F.T. prompt framework",
      "AI-graded sandboxes",
      "Progress tracking & XP",
    ],
    cta: "Current Plan",
    isFree: true,
  },
  {
    id: "pro",
    name: "Pro",
    pricing: { weekly: "$12.99", monthly: "$34.99", yearly: "$299" },
    description: "Unlock the full curriculum",
    icon: Rocket,
    color: "from-blue-500 to-indigo-600",
    features: [
      "All 7 modules (35 lessons)",
      "AI model switching in sandbox",
      "Mock datasets + auto-populate",
      "Meeting insights & recording",
      "Certificates of completion",
      "Priority support",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    pricing: { weekly: "$24.99", monthly: "$69.99", yearly: "$599" },
    description: "Course + Workspace bundle",
    icon: Crown,
    color: "from-violet-500 to-fuchsia-600",
    features: [
      "Everything in Pro",
      "Work[space] included (up to 5 users)",
      "3D interactive offices",
      "Meeting rooms & auditorium",
      "AI meeting transcription",
      "Auto action lists",
      "1-on-1 coaching session",
    ],
    cta: "Get Business",
    note: "Includes Work[space] for up to 5 users. Need more? Add a standalone Work[space] plan.",
  },
];

/* ─── WORKSPACE PLANS ─── */

interface WorkspacePlan {
  name: string;
  seats: string;
  monthly: string;
  yearly: string;
  perSeat: string;
}

const WORKSPACE_PLANS: WorkspacePlan[] = [
  { name: "Starter",    seats: "1 – 5",   monthly: "$49",  yearly: "$469",   perSeat: "$9.80 – $49" },
  { name: "Team",       seats: "6 – 15",  monthly: "$129", yearly: "$1,199", perSeat: "$8.60 – $21.50" },
  { name: "Business",   seats: "16 – 50", monthly: "$299", yearly: "$2,799", perSeat: "$5.98 – $18.69" },
  { name: "Enterprise", seats: "50+",     monthly: "$599", yearly: "$5,499", perSeat: "< $12" },
];

/* ─── HELPERS ─── */

function savingsVsWeekly(plan: CoursePlan, cycle: BillingCycle): string | null {
  if (plan.isFree) return null;
  const weeklyAnnual = parseFloat(plan.pricing.weekly.replace("$", "")) * 52;
  if (cycle === "monthly") {
    const monthlyAnnual = parseFloat(plan.pricing.monthly.replace("$", "")) * 12;
    const pct = Math.round((1 - monthlyAnnual / weeklyAnnual) * 100);
    return pct > 0 ? `Save ${pct}%` : null;
  }
  if (cycle === "yearly") {
    const yearly = parseFloat(plan.pricing.yearly.replace("$", ""));
    const pct = Math.round((1 - yearly / weeklyAnnual) * 100);
    return pct > 0 ? `Save ${pct}%` : null;
  }
  return null;
}

function effectiveMonthly(plan: CoursePlan, cycle: BillingCycle): string | null {
  if (plan.isFree) return null;
  if (cycle === "weekly") {
    const mo = parseFloat(plan.pricing.weekly.replace("$", "")) * 4.33;
    return `≈ $${mo.toFixed(0)}/mo`;
  }
  if (cycle === "yearly") {
    const mo = parseFloat(plan.pricing.yearly.replace("$", "")) / 12;
    return `$${mo.toFixed(2)}/mo`;
  }
  return null;
}

const CYCLE_META: Record<BillingCycle, { label: string; period: string; tag?: string }> = {
  weekly:  { label: "Weekly",  period: "/week" },
  monthly: { label: "Monthly", period: "/month", tag: "POPULAR" },
  yearly:  { label: "Yearly",  period: "/year",  tag: "BEST VALUE" },
};

/* ═══════════════════════════════════════════════════════════════ */

export function PricingPage() {
  const currentTier = useQuery(api.progress.getUserTier);
  const getPaymentLink = useAction(api.stripe.getPaymentLink);
  const createCheckout = useAction(api.stripe.createCheckoutSession);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  const tierOrder = ["free", "pro", "business"];
  const currentIdx = tierOrder.indexOf(currentTier ?? "free");
  // Map legacy tiers
  const effectiveIdx = (currentTier === "elite" || currentTier === "master") ? 1 : currentIdx;

  const handleUpgrade = async (planId: string) => {
    if (planId === "free" || planId === currentTier) return;
    setLoadingTier(planId);
    try {
      // Try payment link first (Stripe-hosted, no secret key needed)
      try {
        const linkResult = await getPaymentLink({ tier: planId, billing });
        if (linkResult?.url) {
          window.location.href = linkResult.url;
          return;
        }
      } catch {
        // Payment link not available, fall back to checkout session
      }
      const result = await createCheckout({
        tier: planId as "pro" | "business",
        billing,
      });
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setLoadingTier(null);
    }
  };

  const handleWorkspaceUpgrade = async (wsTier: string) => {
    setLoadingTier(wsTier);
    try {
      const linkResult = await getPaymentLink({ tier: wsTier });
      if (linkResult?.url) {
        window.location.href = linkResult.url;
        return;
      }
    } catch (err) {
      console.error("Workspace checkout error:", err);
    }
    setLoadingTier(null);
  };

  const cycles: BillingCycle[] = ["weekly", "monthly", "yearly"];

  return (
    <div className="max-w-6xl mx-auto pb-16 px-4 sm:px-6">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* ─── HEADER ─── */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
          Choose Your{" "}
          <span className="bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
            Learning Path
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Start free. Upgrade to unlock every module — or go Business to get the full platform.
        </p>
      </div>

      {/* ─── BILLING TOGGLE ─── */}
      <div className="flex items-center justify-center mb-10">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-muted/60 border border-border/40">
          {cycles.map((c) => (
            <button
              key={c}
              onClick={() => setBilling(c)}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                billing === c
                  ? "bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "yearly" && <Calendar className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />}
              {CYCLE_META[c].label}
              {billing === c && CYCLE_META[c].tag && (
                <span className="ml-1.5 text-[10px] font-bold bg-white/25 px-1.5 py-0.5 rounded-full">
                  {CYCLE_META[c].tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── COURSE PLANS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mb-12 sm:mb-16">
        {COURSE_PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = plan.id === (currentTier ?? "free") ||
            (plan.id === "pro" && (currentTier === "elite" || currentTier === "master"));
          const planIdx = tierOrder.indexOf(plan.id);
          const isLower = planIdx >= 0 && planIdx <= effectiveIdx && !plan.isFree;
          const isLoading = loadingTier === plan.id;

          const displayPrice = plan.pricing[billing];
          const displayPeriod = CYCLE_META[billing].period;
          const savings = savingsVsWeekly(plan, billing);
          const effective = effectiveMonthly(plan, billing);

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-blue-300 dark:border-blue-700 shadow-lg ring-2 ring-blue-200 dark:ring-blue-900"
                  : plan.id === "business"
                  ? "border-violet-300 dark:border-violet-700 shadow-lg ring-2 ring-violet-200 dark:ring-violet-900"
                  : "border-border/60"
              } ${isCurrent ? "bg-muted/30" : "bg-background"}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold shadow-md">
                  Most Popular
                </div>
              )}
              {plan.id === "business" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white text-xs font-bold shadow-md">
                  Best for Teams
                </div>
              )}
              {savings && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  {savings}
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${plan.color} shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mb-5">
                <span className="text-3xl font-extrabold">{displayPrice}</span>
                <span className="text-sm text-muted-foreground ml-1">
                  {plan.isFree ? "forever" : displayPeriod}
                </span>
                {effective && (
                  <p className="text-xs text-muted-foreground/70 mt-1">{effective}</p>
                )}
              </div>

              <div className="mb-6 flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {feat.startsWith("Everything") ? (
                        <Sparkles className="w-3.5 h-3.5 mt-0.5 text-fuchsia-500 shrink-0" />
                      ) : feat.includes("Work[space]") ? (
                        <Building2 className="w-3.5 h-3.5 mt-0.5 text-violet-500 shrink-0" />
                      ) : (
                        <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                      )}
                      <span className={
                        feat.startsWith("Everything")
                          ? "text-fuchsia-600 dark:text-fuchsia-400 text-xs font-medium"
                          : feat.includes("Work[space]")
                          ? "text-violet-600 dark:text-violet-400 font-semibold"
                          : "text-muted-foreground"
                      }>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.note && (
                <p className="text-[10px] text-muted-foreground/70 italic px-1 -mt-2 mb-2">⚠️ {plan.note}</p>
              )}

              {isCurrent ? (
                <div className="w-full py-2.5 rounded-xl text-center text-sm font-bold border-2 border-border text-muted-foreground">
                  ✓ Current Plan
                </div>
              ) : isLower ? (
                <div className="w-full py-2.5 rounded-xl text-center text-sm font-medium text-muted-foreground/60">
                  <Lock className="w-3.5 h-3.5 inline mr-1" /> Included
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isLoading}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 bg-gradient-to-r ${plan.color}`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Redirecting...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── WORKSPACE SECTION ─── */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-3xl" />
        <div className="relative border border-violet-200 dark:border-violet-800 rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-sm font-bold mb-4">
              <Building2 className="w-4 h-4" /> Standalone Product
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
              E-Quipped: Work
              <span className="inline-flex items-center ml-1 px-2 py-0.5 border-2 border-violet-400 rounded-lg text-violet-600 dark:text-violet-400 text-xl font-black">
                space
              </span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A 3D interactive workspace for your team — customizable offices, meeting rooms, auditorium, AI-powered meeting insights, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {[
              { icon: Building2, label: "Custom Offices", desc: "Personalize your space" },
              { icon: Users, label: "Auditorium", desc: "Company-wide meetings" },
              { icon: Video, label: "Video & Audio", desc: "Built-in conferencing" },
              { icon: Mic, label: "Transcription", desc: "AI meeting insights" },
              { icon: FileText, label: "Action Lists", desc: "Auto from meetings" },
              { icon: Brain, label: "AI Summaries", desc: "Smart meeting notes" },
              { icon: Sparkles, label: "Drag & Drop", desc: "Intuitive navigation" },
              { icon: Crown, label: "Presentations", desc: "Stage & screen share" },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center p-3 rounded-xl bg-background/80 border border-border/40">
                <f.icon className="w-5 h-5 text-violet-500 mb-1.5" />
                <p className="text-xs font-bold">{f.label}</p>
                <p className="text-[10px] text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-3 px-4 font-bold">Tier</th>
                  <th className="text-center py-3 px-4 font-bold">Seats</th>
                  <th className="text-center py-3 px-4 font-bold">Monthly</th>
                  <th className="text-center py-3 px-4 font-bold">Yearly</th>
                  <th className="text-center py-3 px-4 font-bold text-muted-foreground">Per Seat</th>
                </tr>
              </thead>
              <tbody>
                {WORKSPACE_PLANS.map((wp, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold">{wp.name}</td>
                    <td className="py-3 px-4 text-center">{wp.seats}</td>
                    <td className="py-3 px-4 text-center font-bold">{wp.monthly}/mo</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold">{wp.yearly}/yr</span>
                      <span className="ml-1 text-[10px] text-emerald-600 font-bold">SAVE 20%</span>
                    </td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{wp.perSeat}/mo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-6 space-y-3">
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { tier: "workspace_starter", label: "Starter — $49/mo", color: "from-blue-500 to-indigo-600" },
                { tier: "workspace_team", label: "Team — $129/mo", color: "from-violet-500 to-purple-600" },
                { tier: "workspace_business", label: "Business — $299/mo", color: "from-fuchsia-500 to-pink-600" },
                { tier: "workspace_enterprise", label: "Enterprise — $599/mo", color: "from-amber-500 to-orange-600" },
              ].map(({ tier, label, color }) => (
                <button
                  key={tier}
                  onClick={() => handleWorkspaceUpgrade(tier)}
                  disabled={loadingTier === tier}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md bg-gradient-to-r ${color} hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60`}
                >
                  {loadingTier === tier ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Redirecting...
                    </span>
                  ) : label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Already have a Pro plan? The Business bundle saves you 15% vs buying separately.
            </p>
          </div>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <div className="text-center mt-10 text-sm text-muted-foreground">
        <p>Payments processed securely by Stripe. Cancel subscriptions anytime.</p>
        <p className="mt-1">Questions? Contact us at <a href="mailto:equippedbyxixvi@gmail.com" className="text-fuchsia-600 hover:underline">equippedbyxixvi@gmail.com</a></p>
      </div>
    </div>
  );
}
