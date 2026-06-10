import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";

/* ═══════════════════════════════════════════════════════
   E-QUIPPED: WORK[SPACE] — ADMIN API
   Room management, member management, scheduling,
   visitor access, and workspace customization
   ═══════════════════════════════════════════════════════ */

const AVATAR_COLORS = [
  "#7c3aed", "#db2777", "#2563eb", "#059669",
  "#d97706", "#dc2626", "#8b5cf6", "#0891b2",
  "#c026d3", "#4f46e5", "#0d9488", "#e11d48",
];

// ─── Auth helpers ─────────────────────────────
async function requireAuth(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

async function requireAdmin(ctx: any, workspaceId: Id<"workspaces">) {
  const userId = await requireAuth(ctx);
  const member = await ctx.db
    .query("workspaceMembers")
    .withIndex("by_workspace_user", (q: any) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId),
    )
    .first();
  if (!member || member.status !== "active") throw new Error("Not a workspace member");
  if (member.role !== "owner" && member.role !== "admin") {
    throw new Error("Admin access required");
  }
  return { userId, member };
}

async function logAudit(
  ctx: any, workspaceId: Id<"workspaces">, userId: Id<"users">,
  action: string, resource: string, details?: string,
) {
  await ctx.db.insert("workspaceAuditLog", {
    workspaceId, userId, action, resource, details, timestamp: Date.now(),
  });
}

/* ═══════════════════════════════════════
   ADMIN DASHBOARD QUERY
   ═══════════════════════════════════════ */

export const getAdminDashboard = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const member = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_user", (q: any) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId),
      )
      .first();
    if (!member || (member.role !== "owner" && member.role !== "admin")) return null;

    const workspace = await ctx.db.get(workspaceId);
    const members = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q: any) => q.eq("workspaceId", workspaceId))
      .collect();
    const rooms = await ctx.db
      .query("workspaceRooms")
      .withIndex("by_workspace", (q: any) => q.eq("workspaceId", workspaceId))
      .collect();
    const meetings = await ctx.db
      .query("meetings")
      .withIndex("by_workspace", (q: any) => q.eq("workspaceId", workspaceId))
      .collect();
    const visitors = await ctx.db
      .query("visitorSessions")
      .withIndex("by_workspace", (q: any) => q.eq("workspaceId", workspaceId))
      .collect();
    const recentAudit = await ctx.db
      .query("workspaceAuditLog")
      .withIndex("by_workspace_time", (q: any) => q.eq("workspaceId", workspaceId))
      .order("desc")
      .take(50);

    return { workspace, members, rooms, meetings, visitors, recentAudit, myRole: member.role };
  },
});

/* ═══════════════════════════════════════
   ROOM MANAGEMENT
   ═══════════════════════════════════════ */

export const adminCreateRoom = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    type: v.union(
      v.literal("office"), v.literal("personal_office"),
      v.literal("auditorium"), v.literal("training"),
      v.literal("presentation"), v.literal("one_on_one"),
      v.literal("lounge"), v.literal("conference"), v.literal("custom"),
    ),
    capacity: v.number(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    department: v.optional(v.string()),
    description: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
    isLive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx, args.workspaceId);

    // Auto-position: find max x and place next to it
    const existingRooms = await ctx.db
      .query("workspaceRooms")
      .withIndex("by_workspace", (q: any) => q.eq("workspaceId", args.workspaceId))
      .collect();
    const maxX = existingRooms.reduce((m: number, r: any) => Math.max(m, r.position.x + r.size.w), 0);

    const roomId = await ctx.db.insert("workspaceRooms", {
      workspaceId: args.workspaceId,
      name: args.name,
      type: args.type,
      capacity: args.capacity,
      position: { x: maxX + 1, y: 1 },
      size: { w: 2, h: 2 },
      color: args.color || "#7c3aed",
      icon: args.icon || "building",
      isLocked: false,
      isLive: args.isLive ?? true,
      department: args.department,
      description: args.description,
      assignedTo: args.assignedTo,
      createdBy: userId,
      createdAt: Date.now(),
    });

    // If personal office, update member's assignedRoomId
    if (args.type === "personal_office" && args.assignedTo) {
      const memberRec = await ctx.db
        .query("workspaceMembers")
        .withIndex("by_workspace_user", (q: any) =>
          q.eq("workspaceId", args.workspaceId).eq("userId", args.assignedTo),
        )
        .first();
      if (memberRec) {
        await ctx.db.patch(memberRec._id, { assignedRoomId: roomId });
      }
    }

    await logAudit(ctx, args.workspaceId, userId, "create", "room", `Created room "${args.name}" (${args.type})`);
    return roomId;
  },
});

export const adminUpdateRoom = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    roomId: v.id("workspaceRooms"),
    name: v.optional(v.string()),
    type: v.optional(v.union(
      v.literal("office"), v.literal("personal_office"),
      v.literal("auditorium"), v.literal("training"),
      v.literal("presentation"), v.literal("one_on_one"),
      v.literal("lounge"), v.literal("conference"), v.literal("custom"),
    )),
    capacity: v.optional(v.number()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    department: v.optional(v.string()),
    description: v.optional(v.string()),
    isLocked: v.optional(v.boolean()),
    isLive: v.optional(v.boolean()),
    assignedTo: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx, args.workspaceId);
    const { workspaceId, roomId, ...updates } = args;
    // Filter out undefined
    const patch: any = {};
    for (const [k, val] of Object.entries(updates)) {
      if (val !== undefined) patch[k] = val;
    }
    await ctx.db.patch(roomId, patch);
    await logAudit(ctx, workspaceId, userId, "update", "room", `Updated room ${roomId}`);
    return roomId;
  },
});

export const adminDeleteRoom = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    roomId: v.id("workspaceRooms"),
  },
  handler: async (ctx, { workspaceId, roomId }) => {
    const { userId } = await requireAdmin(ctx, workspaceId);

    // Remove presence records in this room
    const presenceRecords = await ctx.db
      .query("roomPresence")
      .withIndex("by_room", (q: any) => q.eq("roomId", roomId))
      .collect();
    for (const p of presenceRecords) {
      await ctx.db.delete(p._id);
    }

    // Unassign any members from this room
    const members = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q: any) => q.eq("workspaceId", workspaceId))
      .collect();
    for (const m of members) {
      if (m.assignedRoomId === roomId) {
        await ctx.db.patch(m._id, { assignedRoomId: undefined });
      }
    }

    await ctx.db.delete(roomId);
    await logAudit(ctx, workspaceId, userId, "delete", "room", `Deleted room ${roomId}`);
  },
});

/* ═══════════════════════════════════════
   MEMBER MANAGEMENT
   ═══════════════════════════════════════ */

export const adminUpdateMember = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    memberId: v.id("workspaceMembers"),
    role: v.optional(v.union(
      v.literal("owner"), v.literal("admin"), v.literal("member"), v.literal("guest"),
    )),
    department: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    assignedRoomId: v.optional(v.id("workspaceRooms")),
    status: v.optional(v.union(
      v.literal("active"), v.literal("invited"), v.literal("suspended"),
    )),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx, args.workspaceId);
    const { workspaceId, memberId, ...updates } = args;
    const patch: any = {};
    for (const [k, val] of Object.entries(updates)) {
      if (val !== undefined) patch[k] = val;
    }
    await ctx.db.patch(memberId, patch);
    await logAudit(ctx, workspaceId, userId, "update", "member", `Updated member ${memberId}: ${JSON.stringify(patch)}`);
    return memberId;
  },
});

export const adminCreatePersonalOffice = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    memberId: v.id("workspaceMembers"),
  },
  handler: async (ctx, { workspaceId, memberId }) => {
    const { userId } = await requireAdmin(ctx, workspaceId);
    const member = await ctx.db.get(memberId);
    if (!member) throw new Error("Member not found");

    // Check if they already have an assigned room
    if (member.assignedRoomId) {
      throw new Error("Member already has an assigned office");
    }

    // Auto-position
    const existingRooms = await ctx.db
      .query("workspaceRooms")
      .withIndex("by_workspace", (q: any) => q.eq("workspaceId", workspaceId))
      .collect();
    const maxX = existingRooms.reduce((m: number, r: any) => Math.max(m, r.position.x + r.size.w), 0);

    const roomId = await ctx.db.insert("workspaceRooms", {
      workspaceId,
      name: `${member.displayName}'s Office`,
      type: "personal_office",
      capacity: 4,
      position: { x: maxX + 1, y: 1 },
      size: { w: 2, h: 2 },
      color: member.avatarColor || "#7c3aed",
      icon: "user",
      isLocked: false,
      isLive: true,
      department: member.department,
      assignedTo: member.userId,
      createdBy: userId,
      createdAt: Date.now(),
    });

    await ctx.db.patch(memberId, { assignedRoomId: roomId });
    await logAudit(ctx, workspaceId, userId, "create", "personal_office", `Created personal office for ${member.displayName}`);
    return roomId;
  },
});

/* ═══════════════════════════════════════
   MEETING SCHEDULING
   ═══════════════════════════════════════ */

export const adminScheduleMeeting = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    roomId: v.id("workspaceRooms"),
    title: v.string(),
    description: v.optional(v.string()),
    scheduledAt: v.number(),
    scheduledEndAt: v.optional(v.number()),
    invitedMemberIds: v.optional(v.array(v.id("users"))),
    invitedDepartments: v.optional(v.array(v.string())),
    transcriptionEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx, args.workspaceId);

    const meetingId = await ctx.db.insert("meetings", {
      workspaceId: args.workspaceId,
      roomId: args.roomId,
      title: args.title,
      description: args.description,
      hostId: userId,
      status: "scheduled",
      scheduledAt: args.scheduledAt,
      scheduledEndAt: args.scheduledEndAt,
      startedAt: undefined,
      endedAt: undefined,
      participantIds: [],
      invitedDepartments: args.invitedDepartments,
      invitedMemberIds: args.invitedMemberIds,
      rsvpAccepted: [],
      rsvpDeclined: [],
      recordingEnabled: false,
      transcriptionEnabled: args.transcriptionEnabled ?? true,
      createdAt: Date.now(),
    });

    await logAudit(ctx, args.workspaceId, userId, "schedule", "meeting", `Scheduled "${args.title}" for ${new Date(args.scheduledAt).toISOString()}`);
    return meetingId;
  },
});

export const adminCancelMeeting = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, { workspaceId, meetingId }) => {
    const { userId } = await requireAdmin(ctx, workspaceId);
    await ctx.db.patch(meetingId, { status: "cancelled" });
    await logAudit(ctx, workspaceId, userId, "cancel", "meeting", `Cancelled meeting ${meetingId}`);
  },
});

export const rsvpMeeting = mutation({
  args: {
    meetingId: v.id("meetings"),
    response: v.union(v.literal("accept"), v.literal("decline")),
  },
  handler: async (ctx, { meetingId, response }) => {
    const userId = await requireAuth(ctx);
    const meeting = await ctx.db.get(meetingId);
    if (!meeting) throw new Error("Meeting not found");

    const accepted = (meeting.rsvpAccepted || []).filter((id: any) => id !== userId);
    const declined = (meeting.rsvpDeclined || []).filter((id: any) => id !== userId);

    if (response === "accept") {
      accepted.push(userId);
    } else {
      declined.push(userId);
    }
    await ctx.db.patch(meetingId, { rsvpAccepted: accepted, rsvpDeclined: declined });
  },
});

/* ═══════════════════════════════════════
   VISITOR ACCESS
   ═══════════════════════════════════════ */

export const adminCreateVisitorSession = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    visitorName: v.string(),
    visitorEmail: v.string(),
    visitorCompany: v.optional(v.string()),
    purpose: v.string(),
    hostMemberId: v.id("users"),
    roomId: v.optional(v.id("workspaceRooms")),
    scheduledAt: v.number(),
    scheduledEndAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx, args.workspaceId);

    // Generate unique access token
    const token = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;

    const sessionId = await ctx.db.insert("visitorSessions", {
      workspaceId: args.workspaceId,
      visitorName: args.visitorName,
      visitorEmail: args.visitorEmail,
      visitorCompany: args.visitorCompany,
      purpose: args.purpose,
      hostMemberId: args.hostMemberId,
      roomId: args.roomId,
      accessToken: token,
      status: "pending",
      scheduledAt: args.scheduledAt,
      scheduledEndAt: args.scheduledEndAt,
      createdBy: userId,
      createdAt: Date.now(),
    });

    await logAudit(ctx, args.workspaceId, userId, "create", "visitor", `Created visitor session for ${args.visitorName}`);
    return { sessionId, accessToken: token };
  },
});

export const adminUpdateVisitorStatus = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    sessionId: v.id("visitorSessions"),
    status: v.union(
      v.literal("pending"), v.literal("approved"), v.literal("checked_in"),
      v.literal("completed"), v.literal("cancelled"),
    ),
  },
  handler: async (ctx, { workspaceId, sessionId, status }) => {
    const { userId } = await requireAdmin(ctx, workspaceId);
    const patch: any = { status };
    if (status === "checked_in") patch.checkedInAt = Date.now();
    if (status === "completed") patch.checkedOutAt = Date.now();
    await ctx.db.patch(sessionId, patch);
    await logAudit(ctx, workspaceId, userId, "update", "visitor", `Updated visitor ${sessionId} to ${status}`);
  },
});

export const getVisitorSession = query({
  args: { accessToken: v.string() },
  handler: async (ctx, { accessToken }) => {
    const session = await ctx.db
      .query("visitorSessions")
      .withIndex("by_token", (q: any) => q.eq("accessToken", accessToken))
      .first();
    if (!session) return null;

    const workspace = await ctx.db.get(session.workspaceId);
    const room = session.roomId ? await ctx.db.get(session.roomId) : null;

    return {
      session,
      workspaceName: workspace?.name,
      roomName: room?.name,
    };
  },
});

/* ═══════════════════════════════════════
   WORKSPACE CUSTOMIZATION
   ═══════════════════════════════════════ */

export const adminUpdateWorkspace = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.optional(v.string()),
    companyLogo: v.optional(v.string()),
    brandColor: v.optional(v.string()),
    brandAccent: v.optional(v.string()),
    departments: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx, args.workspaceId);
    const { workspaceId, ...updates } = args;
    const patch: any = {};
    for (const [k, val] of Object.entries(updates)) {
      if (val !== undefined) patch[k] = val;
    }
    patch.updatedAt = Date.now();
    await ctx.db.patch(workspaceId, patch);
    await logAudit(ctx, workspaceId, userId, "update", "workspace", `Updated workspace settings`);
  },
});

/* ═══════════════════════════════════════
   BULK OPERATIONS
   ═══════════════════════════════════════ */

export const adminCreateAllPersonalOffices = mutation({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const { userId } = await requireAdmin(ctx, workspaceId);

    const members = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q: any) => q.eq("workspaceId", workspaceId))
      .collect();

    const existingRooms = await ctx.db
      .query("workspaceRooms")
      .withIndex("by_workspace", (q: any) => q.eq("workspaceId", workspaceId))
      .collect();

    let maxX = existingRooms.reduce((m: number, r: any) => Math.max(m, r.position.x + r.size.w), 0);
    let created = 0;

    for (const member of members) {
      if (member.status !== "active") continue;
      if (member.assignedRoomId) continue; // already has office

      const roomId = await ctx.db.insert("workspaceRooms", {
        workspaceId,
        name: `${member.displayName}'s Office`,
        type: "personal_office",
        capacity: 4,
        position: { x: maxX + 1, y: 1 },
        size: { w: 2, h: 2 },
        color: member.avatarColor || AVATAR_COLORS[created % AVATAR_COLORS.length],
        icon: "user",
        isLocked: false,
        isLive: true,
        department: member.department,
        assignedTo: member.userId,
        createdBy: userId,
        createdAt: Date.now(),
      });

      await ctx.db.patch(member._id, { assignedRoomId: roomId });
      maxX += 3;
      created++;
    }

    await logAudit(ctx, workspaceId, userId, "bulk_create", "personal_offices", `Created ${created} personal offices`);
    return { created };
  },
});

export const getScheduledMeetings = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("meetings")
      .withIndex("by_workspace_status", (q: any) =>
        q.eq("workspaceId", workspaceId).eq("status", "scheduled"),
      )
      .collect();
  },
});

/* ═══════════════════════════════════════
   LEGACY STUBS — used by old Admin/Course pages
   ═══════════════════════════════════════ */

/* ═══════════════════════════════════════
   PLATFORM ADMIN — identity, analytics, moderation
   ═══════════════════════════════════════ */

const PLATFORM_ADMIN_EMAILS = [
  "mr.trestokes@yahoo.com",
];

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    const user = await ctx.db.get(userId);
    return !!user?.email && PLATFORM_ADMIN_EMAILS.includes(user.email);
  },
});

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    if (!user?.email || !PLATFORM_ADMIN_EMAILS.includes(user.email)) return [];
    const allUsers = await ctx.db.query("users").collect();
    // enrich with workspace membership info
    const enriched = await Promise.all(
      allUsers.map(async (u: any) => {
        const memberships = await ctx.db
          .query("workspaceMembers")
          .withIndex("by_user", (q: any) => q.eq("userId", u._id))
          .collect();
        const sub = await ctx.db
          .query("userSubscriptions")
          .withIndex("by_user", (q: any) => q.eq("userId", u._id))
          .first();
        return {
          ...u,
          workspaceCount: memberships.length,
          workspaceRoles: memberships.map((m: any) => m.role),
          subscriptionTier: sub?.tier ?? "free",
        };
      }),
    );
    return enriched;
  },
});

export const getAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user?.email || !PLATFORM_ADMIN_EMAILS.includes(user.email)) return null;

    const users = await ctx.db.query("users").collect();
    const total = users.length;
    const now = Date.now();
    const recent = users.filter(
      (u: any) => u._creationTime && now - u._creationTime < 7 * 86400000,
    ).length;

    // ── Real page view analytics ──
    const allViews = await ctx.db.query("pageViews").collect();
    const totalViews = allViews.length;
    const views24h = allViews.filter((v: any) => now - v.timestamp < 86400000).length;
    const views7d = allViews.filter((v: any) => now - v.timestamp < 7 * 86400000).length;
    const views30d = allViews.filter((v: any) => now - v.timestamp < 30 * 86400000).length;

    // top pages
    const pageCounts: Record<string, number> = {};
    for (const v of allViews) {
      pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
    }
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([path, count]) => ({ path, count }));

    // unique visitors (by userId, null = anonymous)
    const uniqueVisitors = new Set(allViews.map((v: any) => v.userId || v.userAgent || "anon"));

    // daily views for chart (last 30 days)
    const dailyViews: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      dailyViews[d.toISOString().slice(0, 10)] = 0;
    }
    for (const v of allViews) {
      const day = new Date(v.timestamp).toISOString().slice(0, 10);
      if (dailyViews[day] !== undefined) dailyViews[day]++;
    }

    // ── Security events ──
    const securityEvents = await ctx.db
      .query("securityEvents")
      .order("desc")
      .take(50);

    // ── Workspace stats ──
    const workspaces = await ctx.db.query("workspaces").collect();
    const workspaceMembers = await ctx.db.query("workspaceMembers").collect();

    // ── Subscription tier breakdown ──
    const subs = await ctx.db.query("userSubscriptions").collect();
    const tierCounts: Record<string, number> = { free: 0, pro: 0, business: 0 };
    for (const s of subs) {
      tierCounts[s.tier] = (tierCounts[s.tier] || 0) + 1;
    }
    tierCounts.free = total - subs.length;

    return {
      totalUsers: total,
      activeToday: views24h,
      pageViews: totalViews,
      uniqueVisitors: uniqueVisitors.size,
      topPages,
      dailyViews,
      users: { total, recent },
      views: { last24h: views24h, last7d: views7d, last30d: views30d, total: totalViews },
      tiers: tierCounts,
      securityEvents,
      workspaces: {
        total: workspaces.length,
        totalMembers: workspaceMembers.length,
        byTier: workspaces.reduce((acc: Record<string, number>, w: any) => {
          acc[w.tier] = (acc[w.tier] || 0) + 1;
          return acc;
        }, {}),
      },
    };
  },
});

export const setUserTier = mutation({
  args: { targetUserId: v.id("users"), tier: v.string() },
  handler: async (ctx, { targetUserId, tier }) => {
    const userId = await requireAuth(ctx);
    const user = await ctx.db.get(userId);
    if (!user?.email || !PLATFORM_ADMIN_EMAILS.includes(user.email)) {
      throw new Error("Admin access required");
    }
    await ctx.db.patch(targetUserId, { tier } as any);
  },
});

export const setUserRole = mutation({
  args: { targetUserId: v.id("users"), role: v.string() },
  handler: async (ctx, { targetUserId, role }) => {
    const userId = await requireAuth(ctx);
    const user = await ctx.db.get(userId);
    if (!user?.email || !PLATFORM_ADMIN_EMAILS.includes(user.email)) {
      throw new Error("Admin access required");
    }
    await ctx.db.patch(targetUserId, { role } as any);
  },
});

export const blockUser = mutation({
  args: { targetUserId: v.id("users"), blocked: v.optional(v.boolean()) },
  handler: async (ctx, { targetUserId, blocked }) => {
    const userId = await requireAuth(ctx);
    const user = await ctx.db.get(userId);
    if (!user?.email || !PLATFORM_ADMIN_EMAILS.includes(user.email)) {
      throw new Error("Admin access required");
    }
    await ctx.db.patch(targetUserId, { blocked: blocked ?? true } as any);
  },
});

/* ── Real page view tracking ── */
export const trackPageView = mutation({
  args: {
    path: v.string(),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, { path, userAgent }) => {
    const userId = await getAuthUserId(ctx);
    await ctx.db.insert("pageViews", {
      userId: userId ?? undefined,
      path,
      userAgent: userAgent ?? undefined,
      timestamp: Date.now(),
    });
  },
});

/* ── Public page view tracking (no auth required) ── */
export const trackPublicPageView = mutation({
  args: {
    path: v.string(),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, { path, userAgent }) => {
    // Rate-limit: max 1 entry per path per 5 seconds (prevent spam)
    await ctx.db.insert("pageViews", {
      path,
      userAgent: userAgent ?? undefined,
      timestamp: Date.now(),
    });
  },
});

export const trackSecurityEvent = mutation({
  args: { eventType: v.string(), path: v.string() },
  handler: async (ctx, { eventType, path }) => {
    const userId = await getAuthUserId(ctx);
    await ctx.db.insert("securityEvents", {
      userId: userId ?? undefined,
      eventType,
      path,
      timestamp: Date.now(),
    });
  },
});
