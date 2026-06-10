import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Building2,
  Video,
  Users,
  Shield,
  Brain,
  Monitor,
  Calendar,
  ChevronLeft,
  Mail,
} from "lucide-react";
import { BrandLogo } from "../components/BrandLogo";
import { PublicPageTracker } from "../components/PublicPageTracker";

/* ─── feature cards ─── */
const FEATURES = [
  {
    icon: Building2,
    title: "Interactive 3D Floor Map",
    desc: "Navigate a photorealistic office layout. See who's in each room, check availability, and join with one click.",
    color: "cyan",
  },
  {
    icon: Video,
    title: "HD Video & Screen Share",
    desc: "Crystal-clear video conferencing with real-time screen sharing across every room — from huddles to the auditorium.",
    color: "purple",
  },
  {
    icon: Brain,
    title: "AI Meeting Insights",
    desc: "Automatic transcription, live AI-generated insights, action item extraction, and post-meeting summary emails.",
    color: "fuchsia",
  },
  {
    icon: Users,
    title: "Team Presence & Status",
    desc: "Real-time availability for every team member. 9 status modes from Deep Work to Out of Office — visible right on the map.",
    color: "cyan",
  },
  {
    icon: Monitor,
    title: "Personal Offices",
    desc: "Every team member gets a customizable office with immersive backgrounds, seasonal windows, and persistent workspace.",
    color: "purple",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "AES-256 encryption, content protection, audit logging, admin controls, and SOC 2-ready architecture.",
    color: "fuchsia",
  },
];

/* pricing tiers moved to WorkspacePricingPage */

const COLOR_MAP: Record<string, string> = {
  cyan: "from-cyan-500/20 to-cyan-500/5",
  purple: "from-purple-500/20 to-purple-500/5",
  fuchsia: "from-fuchsia-500/20 to-fuchsia-500/5",
};

const ICON_COLOR_MAP: Record<string, string> = {
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  fuchsia: "text-fuchsia-400",
};

/* ═══════════════════════════════════════════════════════ */
/*              VIDEO HERO COMPONENT                      */
/* ═══════════════════════════════════════════════════════ */

function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Glow behind the video */}
      <div
        className="absolute -inset-6 sm:-inset-10 rounded-3xl opacity-30 blur-3xl -z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(6,182,212,0.25) 0%, rgba(139,92,246,0.15) 50%, rgba(217,70,239,0.1) 100%)",
        }}
      />

      {/* Video container — larger display */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/[0.08] cursor-pointer group"
        style={{
          boxShadow:
            "0 0 80px rgba(6,182,212,0.1), 0 30px 100px rgba(0,0,0,0.6)",
        }}
        onClick={toggleMute}
      >
        <video
          ref={videoRef}
          src="/workspace-demo.mp4"
          className="w-full aspect-video object-cover"
          playsInline
          muted
          autoPlay
          loop
          preload="auto"
        />

        {/* Mute indicator — subtle corner badge */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-medium text-white/60 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {isMuted ? "🔇 Click to unmute" : "🔊 Click to mute"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/*              WORKSPACE LANDING PAGE                    */
/* ═══════════════════════════════════════════════════════ */

export function WorkspaceLandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white overflow-x-hidden">
      <PublicPageTracker />
      {/* ── nav ── */}
      <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 relative z-20 gap-2">
        <Link
          to="/"
          className="flex items-center gap-1 sm:gap-2 text-white/40 hover:text-white/70 transition-colors text-xs sm:text-sm shrink-0"
        >
          <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Back</span>
        </Link>
        <div className="flex-1 flex justify-center min-w-0">
          <BrandLogo variant="workspace" size="sm" theme="dark" />
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            to="/workspace-login"
            className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <a
            href="mailto:equippedbyxixvi@gmail.com?subject=Equipped%20Workspace%20Inquiry&body=Hi%2C%20I%27m%20interested%20in%20learning%20more%20about%20E-Quipped%3A%20Work%5Bspace%5D.%20I%27d%20love%20to%20schedule%20a%20tour%20or%20get%20more%20information."
            className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-white transition-all hover:scale-105 whitespace-nowrap flex items-center gap-1.5"
            style={{
              background: "linear-gradient(135deg, #06a8d4 0%, #0891b2 100%)",
            }}
          >
            <Mail size={14} />
            Business Inquiry
          </a>
        </div>
      </nav>

      {/* ── hero with video ── */}
      <section className="relative pt-6 sm:pt-10 pb-14 sm:pb-20 px-4 sm:px-6 text-center overflow-hidden">
        {/* background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Headline */}
          <div className="mb-3 sm:mb-4 flex justify-center">
            <BrandLogo variant="workspace" size="xl" theme="dark" />
          </div>

          <p className="text-base sm:text-xl text-white/50 font-medium mb-2 max-w-2xl mx-auto px-2">
            Your team's 3D virtual office — built for real work.
          </p>
          <p className="text-xs sm:text-base text-white/35 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            Navigate a photorealistic office map, join rooms with HD video, and
            let AI handle meeting notes — all from your browser.
          </p>

          {/* Video player — larger */}
          <VideoHero />

          {/* CTA buttons under video */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
            <a
              href="mailto:equippedbyxixvi@gmail.com?subject=Equipped%20Workspace%20Inquiry&body=Hi%2C%20I%27m%20interested%20in%20learning%20more%20about%20E-Quipped%3A%20Work%5Bspace%5D.%20I%27d%20love%20to%20schedule%20a%20tour%20or%20get%20more%20information."
              className="group inline-flex items-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 text-sm sm:text-base"
              style={{
                background: "linear-gradient(135deg, #06a8d4 0%, #0891b2 100%)",
                boxShadow: "0 0 30px rgba(6,182,212,0.3)",
              }}
            >
              <Mail size={18} />
              Schedule a Tour
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
            <Link
              to="/workspace-pricing"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              View pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* ── features ── */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 relative">
        <div
          className="absolute top-1/2 left-[15%] w-72 h-72 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Everything your team needs in one virtual office
          </h2>
          <p className="text-white/40 text-center mb-14 max-w-xl mx-auto">
            Walk the floor, peek into rooms, and collaborate — just like a real
            office, but accessible from anywhere.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`rounded-2xl border border-white/[0.06] p-6 bg-gradient-to-b ${COLOR_MAP[f.color]} backdrop-blur-sm`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-white/[0.06] ${ICON_COLOR_MAP[f.color]}`}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── how it works ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-14">
            Up and running in minutes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                step: "01",
                title: "Create your workspace",
                desc: "Set your company name, upload a logo, pick brand colors. Done in 30 seconds.",
                icon: Building2,
              },
              {
                step: "02",
                title: "Invite your team",
                desc: "Add members by email. Everyone gets a personal office on the floor map automatically.",
                icon: Users,
              },
              {
                step: "03",
                title: "Start collaborating",
                desc: "Walk into any room to join a meeting with video, screen share, and AI note-taking.",
                icon: Calendar,
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border border-white/[0.08] bg-white/[0.03]">
                    <Icon size={24} className="text-cyan-400" />
                  </div>
                  <span className="text-xs font-mono text-cyan-400/60 mb-2">
                    STEP {s.step}
                  </span>
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── pricing teaser ── */}
      <section id="pricing" className="py-12 sm:py-20 px-4 sm:px-6 relative">
        <div
          className="absolute bottom-0 right-[10%] w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-white/40 mb-6 max-w-lg mx-auto text-sm sm:text-base">
            Plans start at <span className="text-white font-semibold">$49/mo</span> for up to 5 seats.
            Scale as your team grows — every plan includes a free onboarding walkthrough.
          </p>

          <div className="inline-flex flex-wrap justify-center gap-3 mb-8">
            {[
              { name: "Starter", price: "$49/mo", seats: "1–5" },
              { name: "Team", price: "$129/mo", seats: "6–15" },
              { name: "Business", price: "$299/mo", seats: "16–50" },
              { name: "Enterprise", price: "$599/mo", seats: "50+" },
            ].map((t) => (
              <div
                key={t.name}
                className="px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center min-w-[120px]"
              >
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-lg font-extrabold text-cyan-400">{t.price}</p>
                <p className="text-[11px] text-white/30">{t.seats} seats</p>
              </div>
            ))}
          </div>

          <div>
            <Link
              to="/workspace-pricing"
              className="inline-flex items-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 text-sm sm:text-base"
              style={{
                background: "linear-gradient(135deg, #06a8d4 0%, #0891b2 100%)",
                boxShadow: "0 0 30px rgba(6,182,212,0.25)",
              }}
            >
              See Full Pricing
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div
          className="max-w-3xl mx-auto text-center rounded-3xl py-10 sm:py-12 px-6 sm:px-8 border border-white/[0.06]"
          style={{
            background:
              "linear-gradient(135deg, rgba(6,182,212,0.06) 0%, rgba(139,92,246,0.06) 100%)",
          }}
        >
          <h2 className="text-xl sm:text-3xl font-bold mb-4">
            Ready to move your team in?
          </h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto text-sm sm:text-base">
            Every plan includes a personalized onboarding walkthrough.
            Reach out to schedule a demo or ask any questions.
          </p>
          <a
            href="mailto:equippedbyxixvi@gmail.com?subject=Workspace%20Demo%20Request&body=Hi%2C%20I%27d%20like%20to%20schedule%20a%20demo%20of%20E-Quipped%3A%20Work%5Bspace%5D%20for%20my%20team."
            className="inline-flex items-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 text-sm sm:text-base"
            style={{
              background: "linear-gradient(135deg, #06a8d4 0%, #0891b2 100%)",
              boxShadow: "0 0 30px rgba(6,182,212,0.25)",
            }}
          >
            <Mail size={18} />
            Business Inquiry
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* ── footer ── */}
      <footer className="py-8 sm:py-10 px-4 sm:px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <BrandLogo variant="workspace" size="xs" theme="dark" />
          <div className="flex items-center gap-6 text-xs text-white/25">
            <Link to="/workspace-legal/privacy" className="hover:text-white/50 transition-colors">
              Privacy
            </Link>
            <Link to="/workspace-legal/terms" className="hover:text-white/50 transition-colors">
              Terms
            </Link>
            <a href="mailto:equippedbyxixvi@gmail.com" className="hover:text-white/50 transition-colors">
              Contact
            </a>
          </div>
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} XI Eleven XVI Sixteen LLC
          </p>
        </div>
      </footer>
    </div>
  );
}
