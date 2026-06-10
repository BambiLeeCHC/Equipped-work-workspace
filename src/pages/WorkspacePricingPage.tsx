import { Link } from "react-router-dom";
import { useState } from "react";
import { PublicPageTracker } from "../components/PublicPageTracker";
import {
  ChevronLeft,
  Check,
  Building2,
  Users,
  User,
  Video,
  Mic,
  FileText,
  Brain,
  Sparkles,
  Crown,
} from "lucide-react";
import { BrandLogo } from "../components/BrandLogo";

type BillingCycle = "monthly" | "yearly";

interface WorkspaceTier {
  name: string;
  seats: string;
  monthly: string;
  yearly: string;
  perSeat: string;
  desc: string;
  features: string[];
  highlight: boolean;
  badge?: string;
  stripeMonthly: string;
  stripeYearly: string;
}

const TIERS: WorkspaceTier[] = [
  {
    name: "Starter",
    seats: "1 – 5 seats",
    monthly: "$49",
    yearly: "$469",
    perSeat: "$9.80 – $49",
    desc: "For small teams getting started",
    features: [
      "3D interactive floor map",
      "HD video & screen share",
      "AI meeting transcription",
      "Basic admin dashboard",
      "Email support",
    ],
    highlight: false,
    stripeMonthly: "https://buy.stripe.com/5kQ5kE4kJ3NXc7e7S14c80b",
    stripeYearly: "https://buy.stripe.com/5kQ5kE4kJ3NXc7e7S14c80b",
  },
  {
    name: "Team",
    seats: "6 – 15 seats",
    monthly: "$129",
    yearly: "$1,199",
    perSeat: "$8.60 – $21.50",
    desc: "For growing teams",
    features: [
      "Everything in Starter",
      "Personal offices for each member",
      "AI insights & action items",
      "Custom company branding",
      "Priority support",
    ],
    highlight: true,
    badge: "Most Popular",
    stripeMonthly: "https://buy.stripe.com/9B6fZi5oNdoxb3a7S14c806",
    stripeYearly: "https://buy.stripe.com/9B6fZi5oNdoxb3a7S14c806",
  },
  {
    name: "Business",
    seats: "16 – 50 seats",
    monthly: "$299",
    yearly: "$2,799",
    perSeat: "$5.98 – $18.69",
    desc: "For larger organizations",
    features: [
      "Everything in Team",
      "Advanced admin controls",
      "Visitor access portal",
      "Audit logging",
      "1-on-1 onboarding walkthrough",
    ],
    highlight: false,
    stripeMonthly: "https://buy.stripe.com/3cI7sM04t3NXfjq2xH4c80a",
    stripeYearly: "https://buy.stripe.com/3cI7sM04t3NXfjq2xH4c80a",
  },
  {
    name: "Enterprise",
    seats: "50+ seats",
    monthly: "$599",
    yearly: "$5,499",
    perSeat: "< $12",
    desc: "Full-scale virtual HQ",
    features: [
      "Everything in Business",
      "Unlimited rooms & departments",
      "SSO & compliance",
      "Dedicated account manager",
      "Custom integrations",
    ],
    highlight: false,
    stripeMonthly: "https://buy.stripe.com/14AdRabNbfwF3AIgox4c807",
    stripeYearly: "https://buy.stripe.com/14AdRabNbfwF3AIgox4c807",
  },
];

/* seat counts for the visual seat icons per tier */
const SEAT_VISUAL: { min: number; max: number | null; icons: number }[] = [
  { min: 1, max: 5, icons: 5 },
  { min: 6, max: 15, icons: 10 },
  { min: 16, max: 50, icons: 15 },
  { min: 50, max: null, icons: 20 },
];

const ALL_FEATURES = [
  { icon: Building2, label: "Custom 3D Offices", desc: "Personalize your space" },
  { icon: Users, label: "Auditorium", desc: "Company-wide meetings" },
  { icon: Video, label: "Video & Audio", desc: "Built-in conferencing" },
  { icon: Mic, label: "Transcription", desc: "AI meeting insights" },
  { icon: FileText, label: "Action Lists", desc: "Auto from meetings" },
  { icon: Brain, label: "AI Summaries", desc: "Smart meeting notes" },
  { icon: Sparkles, label: "Drag & Drop", desc: "Intuitive navigation" },
  { icon: Crown, label: "Presentations", desc: "Stage & screen share" },
];

export function WorkspacePricingPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white overflow-x-hidden">
      <PublicPageTracker />
      {/* ── nav ── */}
      <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-5 relative z-20">
        <Link
          to="/workspace-home"
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
        >
          <ChevronLeft size={16} />
          Back
        </Link>
        <BrandLogo variant="workspace" size="sm" theme="dark" />
        <div className="flex items-center gap-4">
          <Link
            to="/workspace-login"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <a
            href="mailto:equippedbyxixvi@gmail.com?subject=Equipped%20Workspace%20Inquiry"
            className="text-sm px-4 py-2 rounded-full font-medium text-white transition-all hover:scale-105 flex items-center gap-1.5"
            style={{
              background: "linear-gradient(135deg, #06a8d4 0%, #0891b2 100%)",
            }}
          >
            Business Inquiry
          </a>
        </div>
      </nav>

      {/* ── header ── */}
      <section className="relative pt-8 sm:pt-12 pb-8 px-4 sm:px-6 text-center overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-bold mb-5">
            <Building2 className="w-4 h-4" /> Work[space] Pricing
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3">
            Simple, transparent{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              pricing
            </span>
          </h1>
          <p className="text-white/40 text-base sm:text-lg max-w-xl mx-auto">
            Start small and scale as your team grows. Every plan includes a free onboarding walkthrough.
          </p>
        </div>
      </section>

      {/* ── billing toggle ── */}
      <div className="flex items-center justify-center mb-10 px-4">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <button
            onClick={() => setBilling("monthly")}
            className={`relative px-5 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              billing === "monthly"
                ? "text-white shadow-md"
                : "text-white/40 hover:text-white/60"
            }`}
            style={
              billing === "monthly"
                ? {
                    background: "linear-gradient(135deg, #06a8d4 0%, #0891b2 100%)",
                  }
                : undefined
            }
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`relative px-5 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              billing === "yearly"
                ? "text-white shadow-md"
                : "text-white/40 hover:text-white/60"
            }`}
            style={
              billing === "yearly"
                ? {
                    background: "linear-gradient(135deg, #06a8d4 0%, #0891b2 100%)",
                  }
                : undefined
            }
          >
            Yearly
            <span className="ml-1.5 text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* ── pricing cards ── */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TIERS.map((tier, idx) => {
            const displayPrice = billing === "monthly" ? tier.monthly : tier.yearly;
            const period = billing === "monthly" ? "/mo" : "/yr";
            const link = billing === "monthly" ? tier.stripeMonthly : tier.stripeYearly;
            const seatVisual = SEAT_VISUAL[idx];

            const effectiveMonthly =
              billing === "yearly"
                ? `$${(parseFloat(tier.yearly.replace(/[$,]/g, "")) / 12).toFixed(0)}/mo`
                : null;

            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl ${
                  tier.highlight
                    ? "border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-transparent"
                    : "border-white/[0.06] bg-white/[0.02]"
                }`}
                style={
                  tier.highlight
                    ? {
                        boxShadow:
                          "0 0 40px rgba(6,182,212,0.08), inset 0 1px 0 rgba(6,182,212,0.15)",
                      }
                    : undefined
                }
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase text-white bg-gradient-to-r from-cyan-500 to-cyan-600 px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                    {tier.badge}
                  </span>
                )}

                <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                <p className="text-white/35 text-sm mb-3">{tier.desc}</p>

                {/* ── SEAT HERO BLOCK ── */}
                <div
                  className={`rounded-xl p-4 mb-4 border ${
                    tier.highlight
                      ? "bg-cyan-500/[0.06] border-cyan-500/20"
                      : "bg-white/[0.02] border-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users
                      size={18}
                      className={tier.highlight ? "text-cyan-400" : "text-white/40"}
                    />
                    <span className="text-2xl font-extrabold">
                      {seatVisual.max ? `${seatVisual.min}–${seatVisual.max}` : `${seatVisual.min}+`}
                    </span>
                    <span className="text-sm text-white/50 font-medium">seats</span>
                  </div>
                  {/* visual seat icons */}
                  <div className="flex flex-wrap gap-[3px]">
                    {Array.from({ length: seatVisual.icons }).map((_, i) => (
                      <User
                        key={i}
                        size={12}
                        className={
                          tier.highlight
                            ? "text-cyan-400/60"
                            : "text-white/20"
                        }
                      />
                    ))}
                    {!seatVisual.max && (
                      <span className="text-[10px] text-white/20 ml-1 self-end">…</span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/30 mt-2">
                    As low as {tier.perSeat}/seat/mo
                  </p>
                </div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-extrabold">{displayPrice}</span>
                  <span className="text-white/40 text-sm">{period}</span>
                </div>

                {effectiveMonthly && (
                  <p className="text-xs text-emerald-400/70 mb-1">
                    {effectiveMonthly} effective
                  </p>
                )}

                {!effectiveMonthly && (
                  <p className="text-xs text-emerald-400/70 mb-1">
                    or {tier.yearly}/yr — <span className="font-bold">Save 20%</span>
                  </p>
                )}

                <ul className="space-y-2.5 mb-6 mt-4 flex-1">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-white/55"
                    >
                      <Check
                        size={14}
                        className={`shrink-0 mt-0.5 ${
                          tier.highlight ? "text-cyan-400" : "text-white/30"
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center py-3 rounded-full font-semibold text-sm transition-all hover:scale-[1.03] ${
                    tier.highlight
                      ? "text-white"
                      : "text-white/80 border border-white/10 hover:border-white/20"
                  }`}
                  style={
                    tier.highlight
                      ? {
                          background:
                            "linear-gradient(135deg, #06a8d4 0%, #0891b2 100%)",
                          boxShadow: "0 0 20px rgba(6,182,212,0.2)",
                        }
                      : undefined
                  }
                >
                  Get {tier.name}
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── all features included ── */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-3xl border border-white/[0.06] p-8 sm:p-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(6,182,212,0.04) 0%, rgba(139,92,246,0.04) 100%)",
            }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">
              Every plan includes
            </h2>
            <p className="text-white/35 text-center mb-8 text-sm">
              All the tools your team needs to collaborate in one virtual office
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {ALL_FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                >
                  <f.icon className="w-5 h-5 text-cyan-400 mb-2" />
                  <p className="text-xs sm:text-sm font-semibold mb-0.5">{f.label}</p>
                  <p className="text-[10px] sm:text-xs text-white/30">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── comparison table ── */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="text-left py-3 px-3 sm:px-4 font-bold text-white/60">Tier</th>
                <th className="text-center py-3 px-3 sm:px-4 font-bold text-white/60">Seats</th>
                <th className="text-center py-3 px-3 sm:px-4 font-bold text-white/60">Monthly</th>
                <th className="text-center py-3 px-3 sm:px-4 font-bold text-white/60">Yearly</th>
                <th className="text-center py-3 px-3 sm:px-4 font-bold text-white/40 hidden sm:table-cell">Per Seat</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((tier) => (
                <tr
                  key={tier.name}
                  className={`border-b border-white/[0.04] transition-colors ${
                    tier.highlight ? "bg-cyan-500/[0.03]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="py-3 px-3 sm:px-4 font-semibold">{tier.name}</td>
                  <td className="py-3 px-3 sm:px-4 text-center text-white/60">{tier.seats}</td>
                  <td className="py-3 px-3 sm:px-4 text-center font-bold">{tier.monthly}/mo</td>
                  <td className="py-3 px-3 sm:px-4 text-center">
                    <span className="font-bold">{tier.yearly}/yr</span>
                    <span className="ml-1 text-[10px] text-emerald-400 font-bold">SAVE 20%</span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center text-white/40 hidden sm:table-cell">
                    {tier.perSeat}/mo
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ / footer ── */}
      <section className="py-10 px-4 sm:px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo variant="workspace" size="xs" theme="dark" />
          <p className="text-xs text-white/25 text-center">
            Payments processed securely by Stripe. Cancel anytime. Questions?{" "}
            <a
              href="mailto:equippedbyxixvi@gmail.com"
              className="text-cyan-400/50 hover:text-cyan-400 transition-colors"
            >
              equippedbyxixvi@gmail.com
            </a>
          </p>
          <div className="flex items-center gap-4 text-xs text-white/20">
            <Link to="/workspace-legal/terms" className="hover:text-white/40 transition-colors">Terms</Link>
            <Link to="/workspace-legal/privacy" className="hover:text-white/40 transition-colors">Privacy</Link>
            <span>© {new Date().getFullYear()} XI Eleven XVI Sixteen LLC</span>
          </div>
        </div>
      </section>
    </div>
  );
}
