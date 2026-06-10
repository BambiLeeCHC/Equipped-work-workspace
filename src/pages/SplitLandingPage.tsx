import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";

/* ─── feature lists ─── */
const WORK_FEATURES = [
  "7 AI Modules  ·  36 Lessons",
  "Live AI Sandbox",
  "XP & Gamified Progression",
  "Presentations  ·  Data  ·  Writing",
];

const WORKSPACE_FEATURES = [
  "Interactive 3D Floor Map",
  "HD Video  ·  Screen Share",
  "AI Meeting Transcription",
  "Enterprise Security",
];

/* ═══════════════════════════════════════════════════════ */
/*              SPLIT LANDING PAGE                        */
/* ═══════════════════════════════════════════════════════ */

export function SplitLandingPage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<"work" | "workspace" | null>(null);

  const handleEnter = (side: "work" | "workspace") => {
    if (side === "work") {
      navigate("/work");
    } else {
      navigate("/workspace-home");
    }
  };

  return (
    <div className="split-landing min-h-screen bg-[#0a0a0e] text-white overflow-hidden flex flex-col">
      {/* ── top bar ── */}
      <header className="w-full text-center py-5 relative z-20">
        <span className="text-sm font-medium tracking-wider text-white/40 uppercase">
          E-Quipped
        </span>
      </header>

      {/* ── split panels ── */}
      <main className="flex-1 flex flex-col md:flex-row relative">
        {/* center divider (desktop) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px z-10"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent)",
          }}
        />

        {/* ── WORK panel ── */}
        <div
          className={`
            relative flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-0
            transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer
            ${hovered === "work" ? "md:flex-[1.25]" : hovered === "workspace" ? "md:flex-[0.75]" : "md:flex-1"}
          `}
          onMouseEnter={() => setHovered("work")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleEnter("work")}
        >
          {/* purple radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse at 50% 35%, rgba(148,60,220,0.12) 0%, transparent 70%)",
          }} />

          <div className="relative z-10 text-center max-w-md mx-auto">
            {/* logo */}
            <div className="mb-6 flex justify-center">
              <BrandLogo variant="work" size="lg" theme="dark" />
            </div>

            {/* tagline */}
            <p className="text-white/50 text-base sm:text-lg font-medium mb-8 tracking-wide">
              AI Business Mastery Platform
            </p>

            {/* features */}
            <ul className="space-y-3 mb-10">
              {WORK_FEATURES.map((f) => (
                <li key={f} className="text-white/45 text-sm sm:text-base flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA button with inline logo */}
            <button
              onClick={(e) => { e.stopPropagation(); handleEnter("work"); }}
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base
                         text-white transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #9340dc 0%, #7c3aed 100%)",
                boxShadow: "0 0 24px rgba(147,64,220,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              <span>Enter</span>
              <BrandLogo variant="work" size="xs" theme="dark" />
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>

            {/* pricing hint */}
            <p className="mt-5 text-white/25 text-xs sm:text-sm">
              Free  ·  Pro $34.99/mo  ·  Business $69.99/mo
            </p>
          </div>
        </div>

        {/* ── horizontal divider (mobile) ── */}
        <div className="md:hidden w-full h-px"
          style={{
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent)",
          }}
        />

        {/* ── WORKSPACE panel ── */}
        <div
          className={`
            relative flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-0
            transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer
            ${hovered === "workspace" ? "md:flex-[1.25]" : hovered === "work" ? "md:flex-[0.75]" : "md:flex-1"}
          `}
          onMouseEnter={() => setHovered("workspace")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleEnter("workspace")}
        >
          {/* cyan radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse at 50% 35%, rgba(6,182,212,0.10) 0%, transparent 70%)",
          }} />

          <div className="relative z-10 text-center max-w-md mx-auto">
            {/* logo */}
            <div className="mb-6 flex justify-center">
              <BrandLogo variant="workspace" size="lg" theme="dark" />
            </div>

            {/* tagline */}
            <p className="text-white/50 text-base sm:text-lg font-medium mb-8 tracking-wide">
              3D Virtual Office Platform
            </p>

            {/* features */}
            <ul className="space-y-3 mb-10">
              {WORKSPACE_FEATURES.map((f) => (
                <li key={f} className="text-white/45 text-sm sm:text-base flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA button with inline logo */}
            <button
              onClick={(e) => { e.stopPropagation(); handleEnter("workspace"); }}
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base
                         text-white transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #06a8d4 0%, #0891b2 100%)",
                boxShadow: "0 0 24px rgba(6,182,212,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              <span>Enter</span>
              <BrandLogo variant="workspace" size="xs" theme="dark" />
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>

            {/* pricing hint */}
            <p className="mt-5 text-white/25 text-xs sm:text-sm">
              Starter $49/mo  ·  Business $99/mo  ·  Enterprise $249/mo
            </p>
          </div>
        </div>
      </main>

      {/* ── footer ── */}
      <footer className="w-full text-center py-6 relative z-20 space-y-1">
        <p className="text-white/30 text-sm">Choose your platform to continue</p>
        <p className="text-white/15 text-xs">
          © {new Date().getFullYear()} XI Eleven XVI Sixteen LLC  ·  equippedbyxixvi@gmail.com
        </p>
      </footer>
    </div>
  );
}
