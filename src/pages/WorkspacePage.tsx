import { useQuery, useMutation } from "convex/react";
// useAuthActions removed — sign-out handled by WorkspaceNavbar
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2, Users,
  Shield, Plus, Lock,
  ChevronRight, Activity,
  Eye, Wifi, ShieldCheck,
  Settings, Map, UserCheck,
  Video as VideoIcon, Calendar,
  Clock, Coffee, Moon,
  Phone, MapPin, XCircle, ArrowRight,
  Play, Square, Mic, AlertCircle,

} from "lucide-react";
import { DeviceSetupWizard } from "../components/DeviceSetup";
import { WorkspaceLogo } from "../components/WorkspaceLogo";
import OfficeFloorMap from "../components/OfficeFloorMap";
import { RoomInterior } from "../components/RoomInterior";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

/* ═══════════════════════════════════════════════════
   (Room icons/gradients moved to RoomInterior/OfficeFloorMap components)
   ═══════════════════════════════════════════════════ */



/* ═══════════════════════════════════════════════════
   WORKSPACE LOBBY (list of workspaces)
   ═══════════════════════════════════════════════════ */
export function WorkspaceLobby() {
  const workspaces = useQuery(api.workspace.getMyWorkspaces);
  const createWorkspace = useMutation(api.workspace.createWorkspace);
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const slug = newSlug.trim() || newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const id = await createWorkspace({ name: newName, slug, tier: "starter" });
      navigate(`/workspace/${id}`);
    } catch (e: any) {
      alert(e.message);
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 text-white">
      {/* Security banner */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20">
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center gap-2 text-sm text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>End-to-end encrypted · Tenant-isolated · SOC 2 compliant infrastructure</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-10">
          <div>
            <WorkspaceLogo size="lg" />
            <p className="text-gray-400 mt-2 text-sm sm:text-base">Your intelligent virtual workspace</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 font-semibold transition-all shadow-lg shadow-fuchsia-500/20 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" /> New Workspace
          </button>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-10">
          {[
            { icon: Shield, label: "AES-256 Encryption", desc: "Data encrypted at rest & in transit" },
            { icon: Eye, label: "Zero-Knowledge", desc: "We can't see your data" },
            { icon: Lock, label: "Tenant Isolation", desc: "Complete data separation" },
            { icon: Activity, label: "Full Audit Log", desc: "Every action tracked" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <badge.icon className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">{badge.label}</p>
                <p className="text-xs text-gray-500">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Workspace grid */}
        {workspaces === undefined ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-400 mb-2">No workspaces yet</h2>
            <p className="text-gray-500 mb-6">Create your first workspace to get started</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 font-semibold"
            >
              Create Workspace
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((ws: any) => (
              <button
                key={ws._id}
                onClick={() => navigate(`/workspace/${ws._id}`)}
                className="group text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-fuchsia-500/40 hover:bg-white/8 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{ws.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 uppercase font-bold">
                      {ws.tier}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {ws.memberCount} member{ws.memberCount !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-emerald-500" /> Encrypted
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-3 text-fuchsia-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Enter workspace <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-md p-6 rounded-2xl bg-gray-900 border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Create Workspace</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Workspace Name</label>
                <input
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-fuchsia-500 focus:outline-none text-white"
                  placeholder="My Company"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL Slug</label>
                <input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-fuchsia-500 focus:outline-none text-white"
                  placeholder="my-company"
                />
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-300">Your workspace is encrypted and isolated by default. No other organization can access your data.</p>
              </div>
              <button
                onClick={handleCreate}
                disabled={creating || !newName.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 font-bold disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-fuchsia-500/20"
              >
                {creating ? "Creating..." : "Create Workspace"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   WORKSPACE VIEW (the actual virtual office)
   ═══════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════
   PRESENCE / STATUS HELPERS
   ═══════════════════════════════════════════════════ */

type PresenceStatusKey =
  | "available" | "busy" | "on_a_call" | "in_a_meeting"
  | "away" | "brb" | "dnd" | "on_break" | "offline";

const STATUS_CONFIG: Record<PresenceStatusKey, { label: string; color: string; dotColor: string; icon: React.ElementType }> = {
  available:     { label: "Available",       color: "text-emerald-400", dotColor: "bg-emerald-500", icon: UserCheck },
  busy:          { label: "Busy",            color: "text-orange-400",  dotColor: "bg-orange-500",  icon: AlertCircle },
  on_a_call:     { label: "On a Call",       color: "text-blue-400",    dotColor: "bg-blue-500",    icon: Phone },
  in_a_meeting:  { label: "In a Meeting",    color: "text-violet-400",  dotColor: "bg-violet-500",  icon: VideoIcon },
  away:          { label: "Away",            color: "text-yellow-400",  dotColor: "bg-yellow-500",  icon: Clock },
  brb:           { label: "Be Right Back",   color: "text-cyan-400",    dotColor: "bg-cyan-500",    icon: Coffee },
  dnd:           { label: "Do Not Disturb",  color: "text-red-400",     dotColor: "bg-red-500",     icon: XCircle },
  on_break:      { label: "On Break",        color: "text-pink-400",    dotColor: "bg-pink-500",    icon: Coffee },
  offline:       { label: "Offline",          color: "text-gray-500",    dotColor: "bg-gray-600",    icon: Moon },
};

function StatusBadge({ status, message, until }: { status?: PresenceStatusKey; message?: string; until?: number }) {
  const key = status || "offline";
  const cfg = STATUS_CONFIG[key] || STATUS_CONFIG.offline;
  const Icon = cfg.icon;

  /* Auto-format "until" as relative time */
  let timeLeft = "";
  if (until) {
    const mins = Math.max(0, Math.round((until - Date.now()) / 60000));
    timeLeft = mins > 0 ? ` · ${mins}m left` : "";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dotColor} ${key === "available" ? "animate-pulse" : ""}`} />
      <Icon className="w-3 h-3" />
      {cfg.label}
      {message && <span className="text-gray-500 ml-0.5">— {message}</span>}
      {timeLeft && <span className="text-gray-600">{timeLeft}</span>}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   PANEL 2 — PEOPLE & STATUS
   ═══════════════════════════════════════════════════ */
function PeoplePanel({
  members,
  presence,
  rooms,
  workspaceId: _workspaceId,
  onSetStatus,
}: {
  members: any[];
  presence: any[];
  rooms: any[];
  workspaceId: string;
  onSetStatus: (status: PresenceStatusKey, message?: string, until?: number) => void;
}) {
  const [statusMenu, setStatusMenu] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [breakMinutes, setBreakMinutes] = useState(15);

  /* Group members by department */
  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const m of members) {
      const dept = m.department || "General";
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(m);
    }
    /* Sort: online first within each group */
    for (const key of Object.keys(groups)) {
      groups[key].sort((a: any, b: any) => {
        const aOnline = presence.some((p: any) => p.userId === a.userId) ? 0 : 1;
        const bOnline = presence.some((p: any) => p.userId === b.userId) ? 0 : 1;
        return aOnline - bOnline;
      });
    }
    return groups;
  }, [members, presence]);

  return (
    <div className="h-full overflow-y-auto pb-20">
      {/* My status quick-set */}
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Your Status</h2>
          <button
            onClick={() => setStatusMenu(!statusMenu)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/20 hover:bg-fuchsia-500/25 transition-colors"
          >
            Change
          </button>
        </div>

        {statusMenu && (
          <div className="rounded-xl border border-white/10 bg-gray-950/95 backdrop-blur-xl p-3 space-y-1 mb-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {(Object.keys(STATUS_CONFIG) as PresenceStatusKey[]).filter(k => k !== "offline").map((key) => {
              const cfg = STATUS_CONFIG[key];
              const Icon = cfg.icon;
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (key === "brb" || key === "on_break") {
                      onSetStatus(key, customMessage || undefined, Date.now() + breakMinutes * 60000);
                    } else {
                      onSetStatus(key, customMessage || undefined);
                    }
                    setStatusMenu(false);
                    setCustomMessage("");
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors text-left ${cfg.color}`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.dotColor}`} />
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{cfg.label}</span>
                </button>
              );
            })}
            <div className="pt-2 mt-2 border-t border-white/[0.06] space-y-2">
              <input
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Status message (optional)..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500/40"
              />
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-gray-500">Break timer:</label>
                <select
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Number(e.target.value))}
                  className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none"
                >
                  {[5, 10, 15, 20, 30, 45, 60].map(m => (
                    <option key={m} value={m}>{m} min</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Member list by department */}
      {Object.entries(grouped).map(([dept, deptMembers]) => (
        <div key={dept} className="px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-2 px-2">{dept}</p>
          {deptMembers.map((m: any) => {
            const isOnline = presence.some((p: any) => p.userId === m.userId);
            const inRoom = presence.find((p: any) => p.userId === m.userId);
            const roomName = inRoom ? rooms.find((r: any) => r._id === inRoom.roomId)?.name : null;
            return (
              <div key={m._id} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors">
                <div className="relative shrink-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg"
                    style={{ backgroundColor: m.avatarColor || "#7c3aed" }}
                  >
                    {(m.displayName || "?")[0]?.toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-950 ${isOnline ? STATUS_CONFIG[m.presenceStatus as PresenceStatusKey || "available"]?.dotColor || "bg-emerald-500" : "bg-gray-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{m.displayName}</p>
                  <div className="flex flex-col gap-0.5">
                    <StatusBadge
                      status={isOnline ? (m.presenceStatus || "available") : "offline"}
                      message={m.presenceMessage}
                      until={m.presenceUntil}
                    />
                    {roomName && (
                      <span className="text-[10px] text-gray-600 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> {roomName}
                      </span>
                    )}
                  </div>
                </div>
                {m.role !== "member" && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/20 uppercase">
                    {m.role}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PANEL 3 — MEETING HUB
   ═══════════════════════════════════════════════════ */
function MeetingHub({
  workspaceId: _workspaceId,
  rooms,
  members,
  activeMeetings,
  onJoinRoom,
  onStartMeeting,
}: {
  workspaceId: string;
  rooms: any[];
  members: any[];
  activeMeetings: any[];
  onJoinRoom: (roomId: string) => void;
  onStartMeeting: (roomId: string, roomName: string) => void;
}) {
  const endMeeting = useMutation(api.workspace.endMeeting);

  return (
    <div className="h-full overflow-y-auto pb-20">
      {/* Active meetings */}
      <div className="p-4 border-b border-white/[0.06]">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Meetings ({activeMeetings.length})
        </h2>

        {activeMeetings.length === 0 ? (
          <div className="text-center py-8">
            <VideoIcon className="w-10 h-10 text-gray-700 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No meetings in progress</p>
            <p className="text-xs text-gray-600 mt-1">Start one from a room or below</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeMeetings.map((meeting: any) => {
              const room = rooms.find((r: any) => r._id === meeting.roomId);
              const host = members.find((m: any) => m.userId === meeting.hostId);
              const elapsed = meeting.startedAt ? Math.round((Date.now() - meeting.startedAt) / 60000) : 0;
              return (
                <div
                  key={meeting._id}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-white">{meeting.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                      LIVE · {elapsed}m
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {room?.name || "Unknown room"} · Hosted by {host?.displayName || "Unknown"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Users className="w-3.5 h-3.5" />
                    <span>{meeting.participantIds?.length || 0} participant{(meeting.participantIds?.length || 0) !== 1 ? "s" : ""}</span>
                    {meeting.transcriptionEnabled && (
                      <>
                        <span className="text-gray-700">·</span>
                        <Mic className="w-3.5 h-3.5 text-fuchsia-400" />
                        <span className="text-fuchsia-400">Transcription on</span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onJoinRoom(meeting.roomId)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs hover:bg-emerald-500/30 transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" /> Join Room
                    </button>
                    <button
                      onClick={() => endMeeting({ meetingId: meeting._id })}
                      className="px-3 py-2 rounded-lg bg-red-500/15 text-red-400 font-bold text-xs hover:bg-red-500/25 transition-colors"
                    >
                      <Square className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick start in a room */}
      <div className="p-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Play className="w-3.5 h-3.5 text-fuchsia-400" />
          Start a Meeting
        </h2>
        <div className="space-y-2">
          {rooms.map((room: any) => (
            <button
              key={room._id}
              onClick={() => onStartMeeting(room._id, room.name)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.06] hover:border-fuchsia-500/30 hover:bg-white/[0.03] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-fuchsia-500/15 border border-fuchsia-500/20 flex items-center justify-center">
                  <VideoIcon className="w-4 h-4 text-fuchsia-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{room.name}</p>
                  <p className="text-[10px] text-gray-600">
                    {room.type?.replace(/_/g, " ") || "Room"}
                    {room.capacity ? ` · Up to ${room.capacity}` : ""}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-fuchsia-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Scheduled meetings */}
      <div className="p-4 border-t border-white/[0.06]">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-violet-400" />
          Upcoming
        </h2>
        <div className="text-center py-6">
          <Calendar className="w-8 h-8 text-gray-700 mx-auto mb-2" />
          <p className="text-xs text-gray-600">No scheduled meetings</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   WORKSPACE VIEW — 3-Panel Navigation
   ═══════════════════════════════════════════════════ */

type PanelTab = "map" | "people" | "meetings";

export function WorkspaceView() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const wsData = useQuery(
    api.workspace.getWorkspace,
    workspaceId ? { workspaceId: workspaceId as Id<"workspaces"> } : "skip"
  );
  const activeMeetings = useQuery(
    api.workspace.getActiveMeetings,
    workspaceId ? { workspaceId: workspaceId as Id<"workspaces"> } : "skip"
  );
  const joinRoom = useMutation(api.workspace.joinRoom);
  const leaveRoom = useMutation(api.workspace.leaveRoom);
  const heartbeat = useMutation(api.workspace.heartbeat);
  const toggleMedia = useMutation(api.workspace.toggleMedia);
  const startMeeting = useMutation(api.workspace.startMeeting);
  const setPresenceStatus = useMutation(api.workspace.setPresenceStatus);

  const [activeTab, setActiveTab] = useState<PanelTab>("map");
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showDeviceSetup, setShowDeviceSetup] = useState(false);
  const [virtualBg, setVirtualBg] = useState("none");
  const devicePrefs = useQuery(api.workspace.getDevicePreferences);
  const saveDevicePrefs = useMutation(api.workspace.saveDevicePreferences);

  // Show setup wizard on first visit (no saved prefs yet)
  useEffect(() => {
    if (devicePrefs === null) {
      setShowDeviceSetup(true);
    } else if (devicePrefs?.virtualBackground) {
      setVirtualBg(devicePrefs.virtualBackground);
    }
  }, [devicePrefs]);

  // Heartbeat every 10 seconds
  useEffect(() => {
    if (!workspaceId) return;
    const interval = setInterval(() => {
      heartbeat({ workspaceId: workspaceId as Id<"workspaces"> }).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [workspaceId, heartbeat]);

  const handleJoinRoom = useCallback(async (roomId: string) => {
    if (!workspaceId) return;
    try {
      await joinRoom({
        workspaceId: workspaceId as Id<"workspaces">,
        roomId: roomId as Id<"workspaceRooms">,
      });
      setCurrentRoomId(roomId);
    } catch (e: any) {
      alert(e.message);
    }
  }, [workspaceId, joinRoom]);

  const handleLeaveRoom = useCallback(async () => {
    if (!workspaceId) return;
    await leaveRoom({ workspaceId: workspaceId as Id<"workspaces"> });
    setCurrentRoomId(null);
    setIsVideoOn(false);
    setIsAudioOn(false);
    setIsScreenSharing(false);
  }, [workspaceId, leaveRoom]);

  const handleToggleVideo = async () => {
    const next = !isVideoOn;
    setIsVideoOn(next);
    await toggleMedia({ isVideoOn: next });
  };

  const handleToggleAudio = async () => {
    const next = !isAudioOn;
    setIsAudioOn(next);
    await toggleMedia({ isAudioOn: next });
  };

  const handleStartMeeting = async (roomId: string, roomName: string) => {
    if (!workspaceId) return;
    await startMeeting({
      workspaceId: workspaceId as Id<"workspaces">,
      roomId: roomId as Id<"workspaceRooms">,
      title: `Meeting in ${roomName}`,
      transcriptionEnabled: true,
    });
  };

  const handleSetStatus = useCallback(async (status: PresenceStatusKey, message?: string, until?: number) => {
    if (!workspaceId) return;
    await setPresenceStatus({
      workspaceId: workspaceId as Id<"workspaces">,
      presenceStatus: status,
      presenceMessage: message,
      presenceUntil: until,
    });
  }, [workspaceId, setPresenceStatus]);

  if (!wsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { workspace, members, rooms, presence, myRole } = wsData;
  const currentRoom = rooms.find((r: any) => r._id === currentRoomId);
  const activeMeetingList = activeMeetings || [];
  const activeMeetingCount = activeMeetingList.length;

  const NAV_TABS: { id: PanelTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "map", label: "Map", icon: Map },
    { id: "people", label: "People", icon: Users, badge: presence.length },
    { id: "meetings", label: "Meetings", icon: VideoIcon, badge: activeMeetingCount || undefined },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 text-white flex flex-col">
      {/* ── Top bar (below WorkspaceNavbar) ── */}
      <div className="sticky top-14 z-40 border-b border-white/[0.06]"
        style={{
          background: "linear-gradient(180deg, rgba(8,8,14,0.97) 0%, rgba(12,12,20,0.95) 100%)",
          backdropFilter: "blur(20px) saturate(1.4)",
        }}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => currentRoomId ? handleLeaveRoom() : navigate("/workspace")} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              ← {currentRoomId ? "Leave Room" : "Back"}
            </button>
            <div className="w-px h-6 bg-white/10" />
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center shadow-md shadow-fuchsia-500/20">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-sm">{workspace.name}</h1>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-400" /> Secure</span>
                <span>·</span>
                <span>{members.length} member{members.length !== 1 ? "s" : ""}</span>
                {currentRoom && (
                  <>
                    <span>·</span>
                    <span className="text-fuchsia-400 font-medium">{currentRoom.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {(myRole === "owner" || myRole === "admin") && (
              <button
                onClick={() => navigate(`/workspace/${workspaceId}/admin`)}
                title="Admin Dashboard"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <Shield className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowDeviceSetup(true)}
              title="Device Settings"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Nav tabs (only show when NOT inside a room) ── */}
        {!currentRoomId && (
          <div className="flex items-center gap-1 px-4 sm:px-6 pb-2">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    active
                      ? "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30 shadow-sm shadow-fuchsia-500/10"
                      : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-white/[0.06] hover:border-white/[0.08]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      active ? "bg-fuchsia-500/25 text-fuchsia-300" : "bg-white/10 text-gray-400"
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-auto">
        {currentRoomId ? (
          /* Inside a room — full RoomInterior */
          <div className="p-3 sm:p-4 lg:p-6">
            <RoomInterior
              room={currentRoom}
              presence={presence.filter((p: any) => p.roomId === currentRoomId)}
              members={members}
              activeMeetings={activeMeetingList.filter((m: any) => m.roomId === currentRoomId)}
              isVideoOn={isVideoOn}
              isAudioOn={isAudioOn}
              isScreenSharing={isScreenSharing}
              virtualBg={virtualBg}
              workspaceId={workspaceId!}
              onToggleVideo={handleToggleVideo}
              onToggleAudio={handleToggleAudio}
              onLeave={handleLeaveRoom}
              onStartMeeting={() => handleStartMeeting(currentRoomId, currentRoom?.name || "")}
              onChangeBg={(bg) => {
                setVirtualBg(bg);
                saveDevicePrefs({ virtualBackground: bg, setupCompleted: true });
              }}
            />
          </div>
        ) : (
          /* 3-panel nav view */
          <>
            {activeTab === "map" && (
              <OfficeFloorMap
                workspaceId={workspaceId!}
                rooms={rooms}
                members={members}
                presence={presence}
                onJoinRoom={handleJoinRoom}
              />
            )}
            {activeTab === "people" && (
              <PeoplePanel
                members={members}
                presence={presence}
                rooms={rooms}
                workspaceId={workspaceId!}
                onSetStatus={handleSetStatus}
              />
            )}
            {activeTab === "meetings" && (
              <MeetingHub
                workspaceId={workspaceId!}
                rooms={rooms}
                members={members}
                activeMeetings={activeMeetingList}
                onJoinRoom={handleJoinRoom}
                onStartMeeting={handleStartMeeting}
              />
            )}
          </>
        )}
      </div>

      {/* Device Setup Wizard modal */}
      <DeviceSetupWizard
        isOpen={showDeviceSetup}
        onClose={() => setShowDeviceSetup(false)}
        onComplete={() => setShowDeviceSetup(false)}
      />
    </div>
  );
}

/* RoomInterior moved to src/components/RoomInterior.tsx */
