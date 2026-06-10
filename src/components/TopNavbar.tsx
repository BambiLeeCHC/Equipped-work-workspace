import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu, X, LayoutDashboard, Settings, LogOut, Moon, Sun,
  Shield, FileText, ChevronDown, CreditCard
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { api } from "../../convex/_generated/api";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { WorkspaceLogo, BrandMark } from "./WorkspaceLogo";

export function TopNavbar() {
  const user = useQuery(api.auth.currentUser);
  const isAdmin = useQuery(api.admin.isAdmin);
  const { signOut } = useAuthActions();
  const { theme, toggleTheme, switchable } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const mainLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, type: "text" as const },
    { href: "/workspace", label: "workspace", icon: null, type: "workspace-logo" as const },
    { href: "/pricing", label: "Pricing", icon: CreditCard, type: "text" as const },
    ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: Shield, type: "text" as const }] : []),
  ];

  const legalLinks = [
    { href: "/legal/terms", label: "Terms" },
    { href: "/legal/privacy", label: "Privacy" },
    { href: "/legal/refund", label: "Refunds" },
  ];

  return (
    <>
      {/* ── STICKY NAVBAR — dark glass ── */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06]"
        style={{
          background: "linear-gradient(180deg, rgba(8,8,14,0.97) 0%, rgba(12,12,20,0.95) 100%)",
          backdropFilter: "blur(20px) saturate(1.4)",
          WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-4">
            {/* Left: Logo + Links */}
            <div className="flex items-center gap-5">
              <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
                <div className="size-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center shadow-md shadow-fuchsia-500/20">
                  <span className="text-white font-extrabold text-sm">E</span>
                </div>
                <span className="hidden sm:inline">
                  <BrandMark variant="course" />
                </span>
              </Link>

              {/* Desktop links — pill-style buttons */}
              <div className="hidden md:flex items-center gap-1.5">
                {mainLinks.map((link) => {
                  const active = location.pathname === link.href || (link.href === "/admin" && location.pathname.startsWith("/admin"));

                  if (link.type === "workspace-logo") {
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                          active
                            ? "bg-fuchsia-500/15 border-fuchsia-500/30 shadow-sm shadow-fuchsia-500/10"
                            : "border-transparent hover:bg-white/[0.06] hover:border-white/[0.08]"
                        }`}
                      >
                        <WorkspaceLogo size="xs" animate={active} />
                      </Link>
                    );
                  }

                  const Icon = link.icon!;
                  return (
                    <Link key={link.href} to={link.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                        active
                          ? "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30 shadow-sm shadow-fuchsia-500/10"
                          : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-white/[0.06] hover:border-white/[0.08]"
                      }`}>
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right: Profile + Hamburger */}
            <div className="flex items-center gap-2">
              {/* Desktop profile dropdown */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-transparent hover:bg-white/[0.06] hover:border-white/[0.08] transition-all duration-200"
                >
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium max-w-[120px] truncate text-gray-300">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 z-50 rounded-xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                      style={{
                        background: "linear-gradient(180deg, rgba(18,18,28,0.98) 0%, rgba(14,14,22,0.98) 100%)",
                        backdropFilter: "blur(24px)",
                      }}
                    >
                      {/* User info */}
                      <div className="px-3 py-2.5 border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
                        <p className="text-sm font-semibold truncate text-gray-200">{user?.name || "User"}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/20">
                            ADMIN
                          </span>
                        )}
                      </div>
                      {/* Links */}
                      <div className="py-1">
                        <Link to="/settings" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors">
                          <Settings className="w-4 h-4 text-gray-500" /> Settings
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors">
                            <Shield className="w-4 h-4 text-gray-500" /> Admin Dashboard
                          </Link>
                        )}
                        {switchable && (
                          <button onClick={() => { toggleTheme?.(); setProfileOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors">
                            {theme === "light" ? <Moon className="w-4 h-4 text-gray-500" /> : <Sun className="w-4 h-4 text-gray-500" />}
                            {theme === "light" ? "Dark Mode" : "Light Mode"}
                          </button>
                        )}
                      </div>
                      {/* Legal links */}
                      <div className="border-t border-white/[0.06] py-1">
                        <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">Legal</p>
                        {legalLinks.map((l) => (
                          <Link key={l.href} to={l.href} onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-colors">
                            {l.label}
                          </Link>
                        ))}
                      </div>
                      {/* Sign out */}
                      <div className="border-t border-white/[0.06] py-1">
                        <button onClick={() => signOut()}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl border border-transparent hover:bg-white/[0.06] hover:border-white/[0.08] transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5 text-gray-300" /> : <Menu className="w-5 h-5 text-gray-300" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu — dark sheet */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 border-t border-white/[0.06] animate-in fade-in slide-in-from-top-2 duration-200 overflow-y-auto"
          style={{
            background: "linear-gradient(180deg, rgba(8,8,14,0.98) 0%, rgba(6,6,12,0.99) 100%)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="p-4 space-y-1">
            {/* User card */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] mb-4" style={{ background: "rgba(255,255,255,0.03)" }}>
              <Avatar className="size-10">
                <AvatarFallback className="bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white text-sm font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm text-gray-200">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                {isAdmin && (
                  <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-fuchsia-500/15 text-fuchsia-400">ADMIN</span>
                )}
              </div>
            </div>

            {/* Main nav */}
            {mainLinks.map((link) => {
              const active = location.pathname === link.href;

              if (link.type === "workspace-logo") {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all border ${
                      active
                        ? "bg-fuchsia-500/15 border-fuchsia-500/30"
                        : "border-transparent hover:bg-white/[0.06] hover:border-white/[0.08]"
                    }`}
                  >
                    <WorkspaceLogo size="sm" animate={true} />
                  </Link>
                );
              }

              const Icon = link.icon!;
              return (
                <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all border ${
                    active
                      ? "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30"
                      : "text-gray-400 border-transparent hover:bg-white/[0.06] hover:border-white/[0.08] hover:text-gray-200"
                  }`}>
                  <Icon className="w-5 h-5" /> {link.label}
                </Link>
              );
            })}

            <Link to="/settings" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-gray-400 border border-transparent hover:bg-white/[0.06] hover:border-white/[0.08] hover:text-gray-200">
              <Settings className="w-5 h-5" /> Settings
            </Link>

            {switchable && (
              <button onClick={() => { toggleTheme?.(); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-gray-400 border border-transparent hover:bg-white/[0.06] hover:border-white/[0.08] hover:text-gray-200">
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
            )}

            {/* Legal */}
            <div className="pt-4 mt-4 border-t border-white/[0.06]">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">Legal</p>
              {legalLinks.map((l) => (
                <Link key={l.href} to={l.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-colors">
                  <FileText className="w-4 h-4" /> {l.label}
                </Link>
              ))}
            </div>

            {/* Sign out */}
            <div className="pt-4 mt-4 border-t border-white/[0.06]">
              <button onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
