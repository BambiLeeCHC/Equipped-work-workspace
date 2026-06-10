// @ts-nocheck
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Users, BarChart3, Shield, Eye, AlertTriangle, Building2,
  ChevronDown, ChevronUp, Lock, Unlock, Crown, Search, TrendingUp,
  Camera, Printer, Monitor, Code
} from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const TIER_COLORS: Record<string, string> = {
  free: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  pro: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  elite: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  master: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

const TIER_LABELS: Record<string, string> = {
  free: "FREE",
  pro: "PRO",
  elite: "ELITE",
  master: "MASTER",
};

const EVENT_ICONS: Record<string, typeof Camera> = {
  screenshot_attempt: Camera,
  print_attempt: Printer,
  screen_record_attempt: Monitor,
  devtools_open: Code,
};

export function AdminDashboard() {
  const isAdmin = useQuery(api.admin.isAdmin);
  const users = useQuery(api.admin.listUsers);
  const analytics = useQuery(api.admin.getAnalytics);
  const setTier = useMutation(api.admin.setUserTier);
  const setRole = useMutation(api.admin.setUserRole);
  const blockUser = useMutation(api.admin.blockUser);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "analytics" | "security">("users");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  if (isAdmin === false) return <Navigate to="/dashboard" replace />;
  if (isAdmin === undefined) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-fuchsia-500 border-t-transparent rounded-full" />
    </div>
  );

  const filteredUsers = users?.filter(
    (u: any) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  const tabs = [
    { id: "users" as const, label: "Users", icon: Users, count: users?.length },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
    { id: "security" as const, label: "Security", icon: Shield, count: analytics?.securityEvents.length },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Shield className="w-6 h-6 text-fuchsia-600" />
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage students, monitor usage, and review security events.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Total Users" value={analytics?.users.total ?? 0} icon={Users} color="fuchsia" />
        <StatCard label="New (7d)" value={analytics?.users.recent ?? 0} icon={TrendingUp} color="emerald" />
        <StatCard label="Views (24h)" value={analytics?.views.last24h ?? 0} icon={Eye} color="blue" />
        <StatCard label="Unique Visitors" value={analytics?.uniqueVisitors ?? 0} icon={Users} color="cyan" />
        <StatCard label="Security Events" value={analytics?.securityEvents?.length ?? 0} icon={AlertTriangle} color="amber" />
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-muted/40 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}>
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB: Users */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30"
            />
          </div>

          {/* User list */}
          <div className="rounded-xl border overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2.5 bg-muted/30 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-4">User</div>
              <div className="col-span-2">Subscription</div>
              <div className="col-span-2 text-center">Workspaces</div>
              <div className="col-span-2 text-center">Role</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>

            {filteredUsers?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">No users found</div>
            )}

            {filteredUsers?.map((u: any) => (
              <UserRow
                key={u._id}
                user={u}
                expanded={expandedUser === u._id}
                onToggle={() => setExpandedUser(expandedUser === u._id ? null : u._id)}
                onSetTier={(tier) => setTier({ targetUserId: u._id as Id<"users">, tier })}
                onSetRole={(role) => setRole({ targetUserId: u._id as Id<"users">, role })}
                onBlock={(blocked) => blockUser({ targetUserId: u._id as Id<"users">, blocked })}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB: Analytics */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* View stats */}
          <div className="rounded-xl border p-5 space-y-4">
            <h3 className="font-bold flex items-center gap-2"><Eye className="w-4 h-4 text-blue-500" /> Page Views</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <MiniStat label="Last 24h" value={analytics?.views.last24h ?? 0} />
              <MiniStat label="Last 7d" value={analytics?.views.last7d ?? 0} />
              <MiniStat label="Last 30d" value={analytics?.views.last30d ?? 0} />
              <MiniStat label="All time" value={analytics?.views.total ?? 0} />
              <MiniStat label="Unique visitors" value={analytics?.uniqueVisitors ?? 0} />
            </div>
          </div>

          {/* Daily views chart (30 days) */}
          {analytics?.dailyViews && (
            <div className="rounded-xl border p-5 space-y-4">
              <h3 className="font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan-500" /> Daily Views (Last 30 Days)</h3>
              <div className="flex items-end gap-[3px] h-32">
                {Object.entries(analytics.dailyViews).map(([date, count]: [string, any]) => {
                  const maxDay = Math.max(...Object.values(analytics.dailyViews as Record<string, number>), 1);
                  const pct = (count / maxDay) * 100;
                  return (
                    <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-cyan-500 to-cyan-400 transition-all duration-300 min-h-[2px] group-hover:from-cyan-400 group-hover:to-cyan-300"
                        style={{ height: `${Math.max(pct, 2)}%` }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap z-10">
                        {date.slice(5)}: {count}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{Object.keys(analytics.dailyViews)[0]?.slice(5)}</span>
                <span>{Object.keys(analytics.dailyViews).slice(-1)[0]?.slice(5)}</span>
              </div>
            </div>
          )}

          {/* Workspace stats */}
          {analytics?.workspaces && (
            <div className="rounded-xl border p-5 space-y-4">
              <h3 className="font-bold flex items-center gap-2"><Building2 className="w-4 h-4 text-violet-500" /> Workspaces</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MiniStat label="Total Workspaces" value={analytics.workspaces.total ?? 0} />
                <MiniStat label="Total Members" value={analytics.workspaces.totalMembers ?? 0} />
                <MiniStat label="Avg Members/WS" value={analytics.workspaces.total ? Math.round(analytics.workspaces.totalMembers / analytics.workspaces.total) : 0} />
              </div>
            </div>
          )}

          {/* Tier breakdown */}
          <div className="rounded-xl border p-5 space-y-4">
            <h3 className="font-bold flex items-center gap-2"><Crown className="w-4 h-4 text-amber-500" /> Subscription Tiers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(analytics?.tiers ?? {}).map(([tier, count]: [string, any]) => (
                <div key={tier} className={`rounded-xl p-3 text-center ${TIER_COLORS[tier] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>
                  <p className="text-2xl font-extrabold">{count}</p>
                  <p className="text-xs font-bold uppercase">{TIER_LABELS[tier] || tier.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top pages */}
          <div className="rounded-xl border p-5 space-y-3">
            <h3 className="font-bold flex items-center gap-2"><BarChart3 className="w-4 h-4 text-fuchsia-500" /> Top Pages</h3>
            {(!analytics?.topPages || analytics?.topPages.length === 0) && (
              <p className="text-sm text-muted-foreground">No page views recorded yet.</p>
            )}
            <div className="space-y-2">
              {analytics?.topPages?.map((page: any, i: number) => {
                const maxCount = analytics.topPages[0]?.count ?? 1;
                const pct = (page.count / maxCount) * 100;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-6 text-right font-mono">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">{page.path}</span>
                        <span className="text-xs font-bold text-muted-foreground ml-2">{page.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 transition-all duration-500"
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Security */}
      {activeTab === "security" && (
        <div className="space-y-4">
          <div className="rounded-xl border p-5">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Recent Security Events (7 days)
            </h3>
            {(!analytics?.securityEvents || analytics.securityEvents.length === 0) ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 mx-auto text-emerald-300 mb-2" />
                <p className="text-sm text-muted-foreground">No security events detected. All clear! ✅</p>
              </div>
            ) : (
              <div className="space-y-2">
                {analytics.securityEvents.map((event: any, i: any) => {
                  const Icon = EVENT_ICONS[event.eventType] || AlertTriangle;
                  const time = new Date(event.timestamp);
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {event.eventType.replace(/_/g, " ").replace(/\b\w/g, (c: any) => c.toUpperCase())}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {event.path && <span className="font-mono">{event.path}</span>}
                          {event.path && " · "}
                          {time.toLocaleDateString()} {time.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof Users; color: string }) {
  const colors: Record<string, string> = {
    fuchsia: "from-fuchsia-500/10 to-fuchsia-500/5 text-fuchsia-700 dark:text-fuchsia-300",
    emerald: "from-emerald-500/10 to-emerald-500/5 text-emerald-700 dark:text-emerald-300",
    blue: "from-blue-500/10 to-blue-500/5 text-blue-700 dark:text-blue-300",
    amber: "from-amber-500/10 to-amber-500/5 text-amber-700 dark:text-amber-300",
    cyan: "from-cyan-500/10 to-cyan-500/5 text-cyan-700 dark:text-cyan-300",
  };
  return (
    <div className={`rounded-xl p-4 bg-gradient-to-br ${colors[color]} border`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 opacity-60" />
        <span className="text-xs font-medium opacity-70">{label}</span>
      </div>
      <p className="text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center p-3 rounded-xl bg-muted/30">
      <p className="text-xl font-extrabold">{value}</p>
      <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

function UserRow({ user, expanded, onToggle, onSetTier, onBlock, onSetRole }: {
  user: any;
  expanded: boolean;
  onToggle: () => void;
  onSetTier: (tier: string) => void;
  onBlock: (blocked: boolean) => void;
  onSetRole: (role: "admin" | "user") => void;
}) {
  const tiers = ["free", "starter", "team", "business", "enterprise"] as const;
  const joinDate = user._creationTime ? new Date(user._creationTime) : null;
  const subTier = user.subscriptionTier || user.tier || "free";

  return (
    <div className={`border-t transition-colors ${user.blocked ? "bg-red-50/50 dark:bg-red-950/10" : ""}`}>
      {/* Main row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={onToggle}>
        {/* User info */}
        <div className="md:col-span-4 flex items-center gap-3 min-w-0">
          <div className="size-9 rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-500 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">{(user.name || user.email || "?").charAt(0).toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold truncate">{user.name || "Unnamed"}</p>
              {user.blocked && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">BLOCKED</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        {/* Subscription */}
        <div className="md:col-span-2 flex items-center">
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${TIER_COLORS[subTier] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>
            {(subTier || "FREE").toUpperCase()}
          </span>
        </div>

        {/* Workspaces */}
        <div className="md:col-span-2 text-center">
          <span className="text-sm font-bold">{user.workspaceCount ?? 0}</span>
          <span className="text-xs text-muted-foreground ml-1">workspace{(user.workspaceCount ?? 0) !== 1 ? "s" : ""}</span>
        </div>

        {/* Role */}
        <div className="md:col-span-2 text-center">
          {user.role === "admin" ? (
            <Crown className="w-4 h-4 text-amber-500 mx-auto" />
          ) : (
            <span className="text-xs text-muted-foreground">User</span>
          )}
        </div>

        {/* Expand */}
        <div className="md:col-span-2 text-center">
          {expanded ? <ChevronUp className="w-4 h-4 mx-auto text-muted-foreground" /> : <ChevronDown className="w-4 h-4 mx-auto text-muted-foreground" />}
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t bg-muted/10 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Info */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Details</p>
              <div className="text-sm space-y-1">
                {joinDate && <p><span className="text-muted-foreground">Joined:</span> {joinDate.toLocaleDateString()}</p>}
                <p><span className="text-muted-foreground">Subscription:</span> {(subTier || "Free").toUpperCase()}</p>
                <p><span className="text-muted-foreground">Workspaces:</span> {user.workspaceCount ?? 0}</p>
                {user.workspaceRoles?.length > 0 && (
                  <p><span className="text-muted-foreground">Roles:</span> {[...new Set(user.workspaceRoles)].join(", ")}</p>
                )}
              </div>
            </div>

            {/* Tier control */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Set Tier</p>
              <div className="flex flex-wrap gap-1.5">
                {tiers.map((t) => (
                  <button key={t} onClick={(e) => { e.stopPropagation(); onSetTier(t); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      subTier === t
                        ? (TIER_COLORS[t] || "bg-gray-200 text-gray-800") + " ring-2 ring-offset-1 ring-fuchsia-300"
                        : "bg-muted hover:bg-muted/80"
                    }`}>
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Role + Access */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Role & Access</p>
              <button
                onClick={(e) => { e.stopPropagation(); onSetRole(user.role === "admin" ? "user" : "admin"); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all w-full ${
                  user.role === "admin"
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300"
                    : "bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200 dark:bg-fuchsia-950 dark:text-fuchsia-300"
                }`}>
                <Crown className="w-4 h-4" />
                {user.role === "admin" ? "Revoke Admin" : "Make Admin"}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onBlock(!user.blocked); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all w-full ${
                  user.blocked
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950 dark:text-red-300"
                }`}>
                {user.blocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {user.blocked ? "Unblock User" : "Block User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
