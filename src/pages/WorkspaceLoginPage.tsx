import { Link } from "react-router-dom";
import { SignIn } from "@/components/SignIn";
import { TestUserLoginSection } from "@/components/TestUserLoginSection";
import { BrandLogo } from "@/components/BrandLogo";
import { Building2, ChevronLeft } from "lucide-react";

export function WorkspaceLoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0e] text-white overflow-hidden relative">
      {/* background effects */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)",
        }}
      />

      {/* nav */}
      <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-5 relative z-10">
        <Link
          to="/workspace-home"
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Back</span>
        </Link>
        <BrandLogo variant="workspace" size="sm" theme="dark" />
        <a
          href="mailto:equippedbyxixvi@gmail.com?subject=Workspace%20Access%20Request"
          className="text-sm px-4 py-2 rounded-full font-medium text-white transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #06a8d4 0%, #0891b2 100%)",
          }}
        >
          Business Inquiry
        </a>
      </nav>

      {/* main */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto size-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #06a8d4 0%, #0891b2 100%)" }}
            >
              <Building2 className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-white/40 text-sm">
              Sign in to your workspace
            </p>
          </div>

          <TestUserLoginSection />
          <SignIn />

          <p className="text-center text-sm text-white/40">
            Need access?{" "}
            <a
              href="mailto:equippedbyxixvi@gmail.com?subject=Workspace%20Access%20Request"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>

      {/* footer */}
      <div className="py-4 text-center relative z-10">
        <p className="text-xs text-white/20">
          Looking for{" "}
          <Link to="/work" className="text-cyan-400/50 hover:text-cyan-400 transition-colors">
            E-Quipped: Work
          </Link>
          ?
        </p>
      </div>
    </div>
  );
}
