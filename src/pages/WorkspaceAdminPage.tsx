import { useQuery, useMutation } from "convex/react";
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users, Plus, Trash2, Edit3, Save, X,
  Shield, Settings, Calendar, UserPlus,
  MapPin, Briefcase, ArrowLeft, ExternalLink, Copy,
  Check, Search, Sparkles,
  Send, DoorOpen, Lock, Unlock,
} from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

/* ═══════════════════════════════════════
   ADMIN DASHBOARD — Full Workspace Management
   ═══════════════════════════════════════ */

type AdminTab = "members" | "rooms" | "meetings" | "visitors" | "settings" | "ai";

const ROOM_TYPES = [
  { value: "personal_office", label: "Personal Office", icon: "🏠" },
  { value: "office", label: "Shared Office", icon: "🏢" },
  { value: "conference", label: "Conference Room", icon: "📊" },
  { value: "auditorium", label: "Auditorium", icon: "🎭" },
  { value: "training", label: "Training Room", icon: "🎓" },
  { value: "presentation", label: "Presentation Stage", icon: "🖥️" },
  { value: "one_on_one", label: "1-on-1 Room", icon: "🤝" },
  { value: "lounge", label: "Lounge", icon: "☕" },
  { value: "custom", label: "Custom", icon: "✨" },
];

const ROOM_COLORS = [
  "#7c3aed", "#db2777", "#2563eb", "#059669",
  "#d97706", "#dc2626", "#8b5cf6", "#0891b2",
  "#c026d3", "#4f46e5", "#0d9488", "#e11d48",
];

export default function WorkspaceAdminPage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>("members");

  const dashboard = useQuery(
    api.admin.getAdminDashboard,
    workspaceId ? { workspaceId: workspaceId as Id<"workspaces"> } : "skip"
  );

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const { workspace, members, rooms, meetings, visitors, recentAudit: _recentAudit } = dashboard;

  const TABS: { id: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "members", label: "Members", icon: Users, badge: members.length },
    { id: "rooms", label: "Rooms", icon: DoorOpen, badge: rooms.length },
    { id: "meetings", label: "Meetings", icon: Calendar, badge: meetings.filter((m: any) => m.status === "scheduled" || m.status === "active").length || undefined },
    { id: "visitors", label: "Visitors", icon: ExternalLink, badge: visitors.filter((v: any) => v.status === "pending" || v.status === "approved").length || undefined },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "ai", label: "AI Assistant", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 text-white">
      {/* Top bar */}
      <div
        className="sticky top-0 z-40 border-b border-white/[0.06]"
        style={{
          background: "linear-gradient(180deg, rgba(8,8,14,0.97) 0%, rgba(12,12,20,0.95) 100%)",
          backdropFilter: "blur(20px) saturate(1.4)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/workspace/${workspaceId}`)}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Workspace
            </button>
            <div className="w-px h-6 bg-white/10" />
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center shadow-md shadow-fuchsia-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-sm">{workspace?.name} — Admin</h1>
              <p className="text-[10px] text-gray-500">{members.length} members · {rooms.length} rooms</p>
            </div>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 pb-2 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border whitespace-nowrap ${
                  active
                    ? "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30"
                    : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-white/[0.06]"
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
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "members" && (
          <MembersPanel
            workspaceId={workspaceId!}
            members={members}
            rooms={rooms}
            departments={workspace?.departments || []}
          />
        )}
        {activeTab === "rooms" && (
          <RoomsPanel
            workspaceId={workspaceId!}
            rooms={rooms}
            members={members}
          />
        )}
        {activeTab === "meetings" && (
          <MeetingsPanel
            workspaceId={workspaceId!}
            meetings={meetings}
            rooms={rooms}
            members={members}
          />
        )}
        {activeTab === "visitors" && (
          <VisitorsPanel
            workspaceId={workspaceId!}
            visitors={visitors}
            members={members}
          />
        )}
        {activeTab === "settings" && (
          <SettingsPanel workspaceId={workspaceId!} workspace={workspace} />
        )}
        {activeTab === "ai" && (
          <AIAssistantPanel
            workspaceId={workspaceId!}
            members={members}
            rooms={rooms}
          />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MEMBERS PANEL
   ═══════════════════════════════════════ */
function MembersPanel({ workspaceId, members, rooms, departments: _departments }: {
  workspaceId: string;
  members: any[];
  rooms: any[];
  departments: string[];
}) {
  const updateMember = useMutation(api.admin.adminUpdateMember);
  const createOffice = useMutation(api.admin.adminCreatePersonalOffice);
  const createAllOffices = useMutation(api.admin.adminCreateAllPersonalOffices);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDept, setEditDept] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editRole, setEditRole] = useState("");

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return members.filter((m: any) =>
      m.displayName.toLowerCase().includes(s) ||
      (m.department || "").toLowerCase().includes(s) ||
      (m.jobTitle || "").toLowerCase().includes(s)
    );
  }, [members, search]);

  const grouped = useMemo(() => {
    const g: Record<string, any[]> = {};
    for (const m of filtered) {
      const dept = m.department || "Unassigned";
      if (!g[dept]) g[dept] = [];
      g[dept].push(m);
    }
    return g;
  }, [filtered]);

  const membersWithoutOffice = members.filter((m: any) => !m.assignedRoomId && m.status === "active");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Team Members</h2>
          <p className="text-sm text-gray-500">{members.length} members across {Object.keys(grouped).length} departments</p>
        </div>
        <div className="flex items-center gap-2">
          {membersWithoutOffice.length > 0 && (
            <button
              onClick={() => createAllOffices({ workspaceId: workspaceId as Id<"workspaces"> })}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/20 text-xs font-bold hover:bg-fuchsia-500/25 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Create All Offices ({membersWithoutOffice.length})
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members, departments, titles..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500/40"
        />
      </div>

      {/* Member list by department */}
      {Object.entries(grouped).sort(([a], [b]) => a === "Unassigned" ? 1 : b === "Unassigned" ? -1 : a.localeCompare(b)).map(([dept, deptMembers]) => (
        <div key={dept} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-fuchsia-400" />
              <h3 className="font-bold text-sm">{dept}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{deptMembers.length}</span>
            </div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {deptMembers.map((m: any) => {
              const isEditing = editingId === m._id;
              const assignedRoom = m.assignedRoomId ? rooms.find((r: any) => r._id === m.assignedRoomId) : null;

              return (
                <div key={m._id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ backgroundColor: m.avatarColor || "#7c3aed" }}
                    >
                      {(m.displayName || "?")[0]?.toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{m.displayName}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          m.role === "owner" ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" :
                          m.role === "admin" ? "bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/20" :
                          "bg-white/10 text-gray-400"
                        }`}>
                          {m.role}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                          m.status === "active" ? "bg-emerald-500/15 text-emerald-400" :
                          m.status === "invited" ? "bg-blue-500/15 text-blue-400" :
                          "bg-red-500/15 text-red-400"
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        {m.jobTitle && <span className="text-xs text-gray-500">{m.jobTitle}</span>}
                        {assignedRoom && (
                          <span className="text-[10px] text-gray-600 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" /> {assignedRoom.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!m.assignedRoomId && m.status === "active" && (
                        <button
                          onClick={() => createOffice({
                            workspaceId: workspaceId as Id<"workspaces">,
                            memberId: m._id,
                          })}
                          title="Create personal office"
                          className="p-2 rounded-lg text-gray-500 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-colors"
                        >
                          <DoorOpen className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (isEditing) {
                            setEditingId(null);
                          } else {
                            setEditingId(m._id);
                            setEditDept(m.department || "");
                            setEditTitle(m.jobTitle || "");
                            setEditRole(m.role);
                          }
                        }}
                        className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-3 ml-14 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase mb-1 block">Department</label>
                          <input
                            value={editDept}
                            onChange={(e) => setEditDept(e.target.value)}
                            placeholder="e.g. Engineering"
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500/40"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase mb-1 block">Job Title</label>
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="e.g. Sr. Developer"
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500/40"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase mb-1 block">Role</label>
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                          >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                            <option value="owner">Owner</option>
                            <option value="guest">Guest</option>
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          await updateMember({
                            workspaceId: workspaceId as Id<"workspaces">,
                            memberId: m._id,
                            department: editDept || undefined,
                            jobTitle: editTitle || undefined,
                            role: editRole as any,
                          });
                          setEditingId(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 text-xs font-bold hover:bg-fuchsia-500/30 transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Changes
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   ROOMS PANEL
   ═══════════════════════════════════════ */
function RoomsPanel({ workspaceId, rooms, members }: {
  workspaceId: string;
  rooms: any[];
  members: any[];
}) {
  const createRoom = useMutation(api.admin.adminCreateRoom);
  const updateRoom = useMutation(api.admin.adminUpdateRoom);
  const deleteRoom = useMutation(api.admin.adminDeleteRoom);
  const [showCreate, setShowCreate] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "", type: "office" as string, capacity: 10,
    color: "#7c3aed", department: "", description: "",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Room Management</h2>
          <p className="text-sm text-gray-500">{rooms.length} rooms configured</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 text-sm font-bold hover:bg-fuchsia-500/30 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Room
        </button>
      </div>

      {/* Create room form */}
      {showCreate && (
        <div className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-5 space-y-4">
          <h3 className="font-bold text-sm text-fuchsia-300 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create New Room
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Room Name</label>
              <input
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                placeholder="e.g. Marketing War Room"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500/40"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Type</label>
              <select
                value={newRoom.type}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Capacity</label>
              <input
                type="number"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Department</label>
              <input
                value={newRoom.department}
                onChange={(e) => setNewRoom({ ...newRoom, department: e.target.value })}
                placeholder="Optional"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Color</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {ROOM_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewRoom({ ...newRoom, color: c })}
                    className={`w-7 h-7 rounded-lg border-2 transition-all ${newRoom.color === c ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Description</label>
              <input
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                placeholder="Optional"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (!newRoom.name.trim()) return;
                await createRoom({
                  workspaceId: workspaceId as Id<"workspaces">,
                  name: newRoom.name,
                  type: newRoom.type as any,
                  capacity: newRoom.capacity,
                  color: newRoom.color,
                  department: newRoom.department || undefined,
                  description: newRoom.description || undefined,
                  isLive: true,
                });
                setNewRoom({ name: "", type: "office", capacity: 10, color: "#7c3aed", department: "", description: "" });
                setShowCreate(false);
              }}
              className="px-4 py-2 rounded-lg bg-fuchsia-600 text-white text-xs font-bold hover:bg-fuchsia-500 transition-colors"
            >
              Create Room
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 text-xs font-bold hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rooms grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room: any) => {
          const assignedMember = room.assignedTo ? members.find((m: any) => m.userId === room.assignedTo) : null;
          const typeInfo = ROOM_TYPES.find((t) => t.value === room.type) || { icon: "🏠", label: room.type };

          return (
            <div
              key={room._id}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-white/[0.12] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: room.color + "20", border: `1px solid ${room.color}40` }}
                  >
                    {typeInfo.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{room.name}</h3>
                    <p className="text-[10px] text-gray-500">{typeInfo.label} · Cap {room.capacity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => updateRoom({
                      workspaceId: workspaceId as Id<"workspaces">,
                      roomId: room._id,
                      isLive: !(room.isLive ?? true),
                    })}
                    title={room.isLive !== false ? "Make Offline" : "Make Live"}
                    className={`p-1.5 rounded-lg transition-colors ${room.isLive !== false ? "text-emerald-400 hover:bg-emerald-500/10" : "text-gray-500 hover:bg-white/10"}`}
                  >
                    {room.isLive !== false ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${room.name}"?`)) {
                        deleteRoom({
                          workspaceId: workspaceId as Id<"workspaces">,
                          roomId: room._id,
                        });
                      }
                    }}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {room.department && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-400 mb-2 inline-block">
                  {room.department}
                </span>
              )}
              {room.description && (
                <p className="text-xs text-gray-500 mb-2">{room.description}</p>
              )}
              {assignedMember && (
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ backgroundColor: assignedMember.avatarColor }}
                  >
                    {assignedMember.displayName[0]}
                  </div>
                  {assignedMember.displayName}'s office
                </div>
              )}

              <div className="flex items-center gap-2 mt-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  room.isLive !== false
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-gray-500/15 text-gray-400"
                }`}>
                  {room.isLive !== false ? "● LIVE" : "○ OFFLINE"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MEETINGS PANEL
   ═══════════════════════════════════════ */
function MeetingsPanel({ workspaceId, meetings, rooms, members }: {
  workspaceId: string;
  meetings: any[];
  rooms: any[];
  members: any[];
}) {
  const scheduleMeeting = useMutation(api.admin.adminScheduleMeeting);
  const cancelMeeting = useMutation(api.admin.adminCancelMeeting);
  const [showSchedule, setShowSchedule] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", roomId: "",
    date: "", time: "", duration: 60,
    departments: [] as string[],
    individualIds: [] as string[],
  });

  const departments = useMemo(() => {
    const depts = new Set<string>();
    members.forEach((m: any) => { if (m.department) depts.add(m.department); });
    return Array.from(depts).sort();
  }, [members]);

  const active = meetings.filter((m: any) => m.status === "active");
  const scheduled = meetings.filter((m: any) => m.status === "scheduled");
  const past = meetings.filter((m: any) => m.status === "ended" || m.status === "cancelled").slice(0, 20);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Meetings</h2>
          <p className="text-sm text-gray-500">{active.length} active · {scheduled.length} scheduled</p>
        </div>
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 text-sm font-bold hover:bg-fuchsia-500/30 transition-colors"
        >
          <Calendar className="w-4 h-4" /> Schedule Meeting
        </button>
      </div>

      {showSchedule && (
        <div className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-5 space-y-4">
          <h3 className="font-bold text-sm text-fuchsia-300">Schedule New Meeting</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Weekly Standup"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500/40"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Room</label>
              <select
                value={form.roomId}
                onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
              >
                <option value="">Select room...</option>
                {rooms.map((r: any) => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Duration (min)</label>
              <select
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
              >
                {[15, 30, 45, 60, 90, 120].map(d => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Description</label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Department invite */}
          {departments.length > 0 && (
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-2 block">Invite Departments</label>
              <div className="flex flex-wrap gap-2">
                {departments.map(dept => (
                  <button
                    key={dept}
                    onClick={() => setForm(f => ({
                      ...f,
                      departments: f.departments.includes(dept)
                        ? f.departments.filter(d => d !== dept)
                        : [...f.departments, dept],
                    }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      form.departments.includes(dept)
                        ? "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30"
                        : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Individual invite */}
          <div>
            <label className="text-[10px] text-gray-500 uppercase mb-2 block">Invite Individuals</label>
            <div className="flex flex-wrap gap-2">
              {members.filter((m: any) => m.status === "active").map((m: any) => (
                <button
                  key={m._id}
                  onClick={() => setForm(f => ({
                    ...f,
                    individualIds: f.individualIds.includes(m.userId)
                      ? f.individualIds.filter((id: string) => id !== m.userId)
                      : [...f.individualIds, m.userId],
                  }))}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    form.individualIds.includes(m.userId)
                      ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                      : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                    style={{ backgroundColor: m.avatarColor }}
                  >
                    {m.displayName[0]}
                  </div>
                  {m.displayName}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (!form.title || !form.roomId || !form.date || !form.time) return;
                const scheduledAt = new Date(`${form.date}T${form.time}`).getTime();
                await scheduleMeeting({
                  workspaceId: workspaceId as Id<"workspaces">,
                  roomId: form.roomId as Id<"workspaceRooms">,
                  title: form.title,
                  description: form.description || undefined,
                  scheduledAt,
                  scheduledEndAt: scheduledAt + form.duration * 60000,
                  invitedDepartments: form.departments.length ? form.departments : undefined,
                  invitedMemberIds: form.individualIds.length ? form.individualIds as Id<"users">[] : undefined,
                });
                setShowSchedule(false);
                setForm({ title: "", description: "", roomId: "", date: "", time: "", duration: 60, departments: [], individualIds: [] });
              }}
              className="px-4 py-2 rounded-lg bg-fuchsia-600 text-white text-xs font-bold hover:bg-fuchsia-500 transition-colors"
            >
              Schedule Meeting
            </button>
            <button onClick={() => setShowSchedule(false)} className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 text-xs font-bold hover:bg-white/10 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active meetings */}
      {active.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active Now
          </h3>
          {active.map((m: any) => {
            const room = rooms.find((r: any) => r._id === m.roomId);
            const elapsed = m.startedAt ? Math.round((Date.now() - m.startedAt) / 60000) : 0;
            return (
              <div key={m._id} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm">{m.title}</h4>
                    <p className="text-xs text-gray-500">{room?.name} · {elapsed}m elapsed · {m.participantIds?.length || 0} participants</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">LIVE</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scheduled meetings */}
      {scheduled.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-violet-400 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" /> Upcoming
          </h3>
          {scheduled.map((m: any) => {
            const room = rooms.find((r: any) => r._id === m.roomId);
            return (
              <div key={m._id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">{m.title}</h4>
                  <p className="text-xs text-gray-500">
                    {room?.name} · {m.scheduledAt ? new Date(m.scheduledAt).toLocaleString() : "TBD"}
                    {m.invitedDepartments?.length ? ` · ${m.invitedDepartments.join(", ")}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => cancelMeeting({ workspaceId: workspaceId as Id<"workspaces">, meetingId: m._id })}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-bold hover:bg-red-500/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Past meetings */}
      {past.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-500">Past Meetings</h3>
          {past.map((m: any) => (
            <div key={m._id} className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-3 opacity-60">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-xs">{m.title}</h4>
                  <p className="text-[10px] text-gray-600">{m.startedAt ? new Date(m.startedAt).toLocaleString() : "—"}</p>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${m.status === "cancelled" ? "bg-red-500/10 text-red-400" : "bg-gray-500/10 text-gray-500"}`}>
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   VISITORS PANEL
   ═══════════════════════════════════════ */
function VisitorsPanel({ workspaceId, visitors, members }: {
  workspaceId: string;
  visitors: any[];
  members: any[];
}) {
  const createVisitor = useMutation(api.admin.adminCreateVisitorSession);
  const updateVisitorStatus = useMutation(api.admin.adminUpdateVisitorStatus);
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", company: "", purpose: "",
    hostId: "", date: "", time: "",
  });

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleCopy = (token: string) => {
    const url = `${baseUrl}/visit/${token}`;
    navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  const pending = visitors.filter((v: any) => v.status === "pending" || v.status === "approved");
  const checkedIn = visitors.filter((v: any) => v.status === "checked_in");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Visitor Access</h2>
          <p className="text-sm text-gray-500">Schedule appointments and generate access links</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 text-sm font-bold hover:bg-fuchsia-500/30 transition-colors"
        >
          <UserPlus className="w-4 h-4" /> New Visitor
        </button>
      </div>

      {showCreate && (
        <div className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-5 space-y-4">
          <h3 className="font-bold text-sm text-fuchsia-300">Schedule Visitor Appointment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Visitor Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500/40" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500/40" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Company</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Optional"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Purpose</label>
              <input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="Product demo"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500/40" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Host</label>
              <select value={form.hostId} onChange={(e) => setForm({ ...form, hostId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none">
                <option value="">Select host...</option>
                {members.filter((m: any) => m.status === "active").map((m: any) => (
                  <option key={m._id} value={m.userId}>{m.displayName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Date & Time</label>
              <div className="flex gap-2">
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none" />
                <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-28 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (!form.name || !form.email || !form.purpose || !form.hostId || !form.date) return;
                const scheduledAt = new Date(`${form.date}T${form.time || "09:00"}`).getTime();
                await createVisitor({
                  workspaceId: workspaceId as Id<"workspaces">,
                  visitorName: form.name,
                  visitorEmail: form.email,
                  visitorCompany: form.company || undefined,
                  purpose: form.purpose,
                  hostMemberId: form.hostId as Id<"users">,
                  scheduledAt,
                });
                setShowCreate(false);
                setForm({ name: "", email: "", company: "", purpose: "", hostId: "", date: "", time: "" });
              }}
              className="px-4 py-2 rounded-lg bg-fuchsia-600 text-white text-xs font-bold hover:bg-fuchsia-500 transition-colors"
            >
              Create & Get Link
            </button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 text-xs font-bold hover:bg-white/10 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pending / Upcoming visitors */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-violet-400">Upcoming Visitors</h3>
          {pending.map((v: any) => {
            const host = members.find((m: any) => m.userId === v.hostMemberId);
            return (
              <div key={v._id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm">{v.visitorName}</h4>
                    <p className="text-xs text-gray-500">
                      {v.visitorEmail}{v.visitorCompany ? ` · ${v.visitorCompany}` : ""} · {v.purpose}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      Host: {host?.displayName || "Unknown"} · {new Date(v.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(v.accessToken)}
                      title="Copy visitor link"
                      className="p-2 rounded-lg text-gray-400 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-colors"
                    >
                      {copied === v.accessToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {v.status === "pending" && (
                      <button
                        onClick={() => updateVisitorStatus({
                          workspaceId: workspaceId as Id<"workspaces">,
                          sessionId: v._id,
                          status: "approved",
                        })}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/25 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => updateVisitorStatus({
                        workspaceId: workspaceId as Id<"workspaces">,
                        sessionId: v._id,
                        status: "cancelled",
                      })}
                      className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-bold hover:bg-red-500/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    v.status === "approved" ? "bg-emerald-500/15 text-emerald-400" : "bg-yellow-500/15 text-yellow-400"
                  }`}>
                    {v.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-gray-600 flex items-center gap-1">
                    <ExternalLink className="w-2.5 h-2.5" /> {baseUrl}/visit/{v.accessToken}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Currently checked in */}
      {checkedIn.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-emerald-400">In Office Now</h3>
          {checkedIn.map((v: any) => (
            <div key={v._id} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">{v.visitorName}</h4>
                <p className="text-xs text-gray-500">{v.purpose}</p>
              </div>
              <button
                onClick={() => updateVisitorStatus({
                  workspaceId: workspaceId as Id<"workspaces">,
                  sessionId: v._id,
                  status: "completed",
                })}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-gray-300 text-[10px] font-bold hover:bg-white/15 transition-colors"
              >
                Check Out
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SETTINGS PANEL
   ═══════════════════════════════════════ */
function SettingsPanel({ workspaceId, workspace }: {
  workspaceId: string;
  workspace: any;
}) {
  const updateWorkspace = useMutation(api.admin.adminUpdateWorkspace);
  const [name, setName] = useState(workspace?.name || "");
  const [brandColor, setBrandColor] = useState(workspace?.brandColor || "#7c3aed");
  const [brandAccent, setBrandAccent] = useState(workspace?.brandAccent || "#db2777");
  const [deptInput, setDeptInput] = useState("");
  const [departments, setDepartments] = useState<string[]>(workspace?.departments || []);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold">Workspace Settings</h2>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-5">
        <div>
          <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Workspace Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-fuchsia-500/40"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Brand Colors</label>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] text-gray-500 mb-1">Primary</p>
              <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 mb-1">Accent</p>
              <input type="color" value={brandAccent} onChange={(e) => setBrandAccent(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Departments</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {departments.map((d, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                {d}
                <button
                  onClick={() => setDepartments(departments.filter((_, j) => j !== i))}
                  className="text-gray-500 hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={deptInput}
              onChange={(e) => setDeptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && deptInput.trim()) {
                  setDepartments([...departments, deptInput.trim()]);
                  setDeptInput("");
                }
              }}
              placeholder="Add department..."
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none"
            />
            <button
              onClick={() => {
                if (deptInput.trim()) {
                  setDepartments([...departments, deptInput.trim()]);
                  setDeptInput("");
                }
              }}
              className="px-3 py-2 rounded-lg bg-fuchsia-500/15 text-fuchsia-400 text-xs font-bold hover:bg-fuchsia-500/25 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={async () => {
            await updateWorkspace({
              workspaceId: workspaceId as Id<"workspaces">,
              name: name || undefined,
              brandColor,
              brandAccent,
              departments,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fuchsia-600 text-white text-sm font-bold hover:bg-fuchsia-500 transition-colors"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   AI ASSISTANT PANEL
   ═══════════════════════════════════════ */
function AIAssistantPanel({ workspaceId, members: _members, rooms: _rooms }: {
  workspaceId: string;
  members: any[];
  rooms: any[];
}) {
  const createRoom = useMutation(api.admin.adminCreateRoom);
  const createAllOffices = useMutation(api.admin.adminCreateAllPersonalOffices);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Hey! I'm your workspace AI assistant. I can help you manage rooms, schedule meetings, assign departments, and more. Try asking me something like:\n\n• \"Create a conference room for the Sales team\"\n• \"Schedule a standup for Engineering tomorrow at 9am\"\n• \"Create personal offices for everyone\"\n• \"Set up departments: Engineering, Sales, Marketing, Design\"" },
  ]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || processing) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setProcessing(true);

    // Simple intent matching (client-side for now)
    const lower = userMsg.toLowerCase();
    let response = "";

    try {
      if (lower.includes("personal office") && (lower.includes("everyone") || lower.includes("all"))) {
        const result = await createAllOffices({ workspaceId: workspaceId as Id<"workspaces"> });
        response = `✅ Done! Created ${result.created} personal offices. Each team member now has their own default office space. Check the Rooms tab to see them all.`;
      } else if (lower.includes("create") && (lower.includes("room") || lower.includes("office") || lower.includes("conference"))) {
        // Extract room details
        let roomType = "office";
        if (lower.includes("conference")) roomType = "conference";
        else if (lower.includes("lounge")) roomType = "lounge";
        else if (lower.includes("training")) roomType = "training";
        else if (lower.includes("auditorium")) roomType = "auditorium";
        else if (lower.includes("presentation")) roomType = "presentation";

        // Try to extract a name from quotes or after "called"
        const nameMatch = userMsg.match(/["']([^"']+)["']/) || userMsg.match(/called\s+(.+?)(?:\s+for|\s*$)/i);
        const roomName = nameMatch?.[1] || `New ${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room`;

        const deptMatch = userMsg.match(/for\s+(?:the\s+)?(\w+)\s+(?:team|dept|department)/i);
        const dept = deptMatch?.[1] || undefined;

        await createRoom({
          workspaceId: workspaceId as Id<"workspaces">,
          name: roomName,
          type: roomType as any,
          capacity: roomType === "conference" ? 12 : roomType === "auditorium" ? 100 : 10,
          department: dept,
          isLive: true,
        });
        response = `✅ Created "${roomName}" (${roomType})${dept ? ` for ${dept} team` : ""}. It's live and ready to use!`;
      } else if (lower.includes("schedule") && lower.includes("meeting")) {
        response = "📅 To schedule a meeting, I need a few details. Head over to the *Meetings* tab and click \"Schedule Meeting\" — you can pick the room, invite departments or individuals, and set the time. I'll have full natural-language scheduling soon!";
      } else if (lower.includes("department")) {
        response = "🏢 To set up departments, go to the *Settings* tab and add them there. Then head to *Members* to assign each person. You can also click the edit button next to any member to change their department.";
      } else {
        response = "I understand you want to: \"" + userMsg + "\"\n\nHere's what I can do right now:\n• Create rooms (conference, office, lounge, etc.)\n• Create personal offices for all members\n• Guide you through scheduling meetings\n• Help with department setup\n\nTry rephrasing or use the admin tabs directly for more complex operations. Full AI task execution is coming soon!";
      }
    } catch (e: any) {
      response = `❌ Something went wrong: ${e.message}`;
    }

    setMessages(prev => [...prev, { role: "ai", text: response }]);
    setProcessing(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-fuchsia-400" /> AI Assistant
      </h2>

      {/* Chat messages */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden" style={{ minHeight: "400px" }}>
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-fuchsia-500/20 text-fuchsia-100 border border-fuchsia-500/20"
                  : "bg-white/[0.04] text-gray-200 border border-white/[0.06]"
              }`}>
                {msg.role === "ai" && (
                  <div className="flex items-center gap-1.5 text-fuchsia-400 text-[10px] font-bold mb-1">
                    <Sparkles className="w-3 h-3" /> AI ASSISTANT
                  </div>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          {processing && (
            <div className="flex justify-start">
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-white/[0.06] p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me to create rooms, schedule meetings, assign departments..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500/40"
            />
            <button
              onClick={handleSend}
              disabled={processing}
              className="px-4 py-3 rounded-xl bg-fuchsia-600 text-white font-bold hover:bg-fuchsia-500 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
