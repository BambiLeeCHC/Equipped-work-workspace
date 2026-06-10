import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/* ═══════════════════════════════════════════════════════
   E-QUIPPED: WORK[SPACE] — CORE API
   Tenant-isolated, role-based, audit-logged
   ═══════════════════════════════════════════════════════ */

const TIER_LIMITS: Record<string, number> = {
  starter: 5,
  team: 15,
  business: 50,
  enterprise: 500,
};

const AVATAR_COLORS = [
  "#7c3aed", "#db2777", "#2563eb", "#059669",
  "#d97706", "#dc2626", "#8b5cf6", "#0891b2",
  "#c026d3", "#4f46e5", "#0d9488", "#e11d48",
];

const DEFAULT_ROOMS = [
  { name: "Main Office", type: "office" as const, capacity: 20, position: { x: 2, y: 1 }, size: { w: 3, h: 2 }, color: "#7c3aed", icon: "building" },
  { name: "Auditorium", type: "auditorium" as const, capacity: 100, position: { x: 6, y: 1 }, size: { w: 3, h: 3 }, color: "#2563eb", icon: "presentation" },
  { name: "Training Room", type: "training" as const, capacity: 10, position: { x: 2, y: 4 }, size: { w: 2, h: 2 }, color: "#059669", icon: "graduation-cap" },
  { name: "Presentation Stage", type: "presentation" as const, capacity: 50, position: { x: 5, y: 5 }, size: { w: 3, h: 2 }, color: "#db2777", icon: "monitor" },
  { name: "1-on-1 Room", type: "one_on_one" as const, capacity: 2, position: { x: 10, y: 2 }, size: { w: 2, h: 2 }, color: "#d97706", icon: "users" },
  { name: "Lounge", type: "lounge" as const, capacity: 15, position: { x: 10, y: 5 }, size: { w: 2, h: 2 }, color: "#0891b2", icon: "coffee" },
];

// ─── Audit helper ─────────────────────────────
async function logAudit(
  ctx: any,
  workspaceId: any,
  userId: any,
  action: string,
  resource: string,
  details?: string,
) {
  await ctx.db.insert("workspaceAuditLog", {
    workspaceId,
    userId,
    action,
    resource,
    details,
    timestamp: Date.now(),
  });
}

// ─── Auth + membership helper ─────────────────
async function requireMember(ctx: any, workspaceId: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  const member = await ctx.db
    .query("workspaceMembers")
    .withIndex("by_workspace_user", (q: any) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId),
    )
    .first();
  if (!member || member.status !== "active") throw new Error("Not a workspace member");
  return { userId, member };
}

async function requireAdmin(ctx: any, workspaceId: any) {
  const { userId, member } = await requireMember(ctx, workspaceId);
  if (member.role !== "owner" && member.role !== "admin") {
    throw new Error("Admin access required");
  }
  return { userId, member };
}

/* ═══════════════════════════════════════
   WORKSPACE CRUD
   ═══════════════════════════════════════ */

/* Platform admins who can always create workspaces */
const PLATFORM_ADMIN_EMAILS = [
  "mr.trestokes@yahoo.com",
];

export const createWorkspace = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    tier: v.union(
      v.literal("starter"),
      v.literal("team"),
      v.literal("business"),
      v.literal("enterprise"),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Gate: only platform admins or users with active workspace subscriptions can create
    const user = await ctx.db.get(userId);
    const isAdmin = !!user?.email && PLATFORM_ADMIN_EMAILS.includes(user.email);
    if (!isAdmin) {
      // Check for active workspace subscription
      const sub = await ctx.db
        .query("userSubscriptions")
        .withIndex("by_user", (q: any) => q.eq("userId", userId))
        .first();
      const hasWorkspaceSub = sub && ["starter", "team", "business", "enterprise"].includes(sub.tier);
      if (!hasWorkspaceSub) {
        throw new Error("A workspace plan is required to create a workspace. Visit the pricing page to get started.");
      }
    }

    // Check slug uniqueness
    const existing = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q: any) => q.eq("slug", args.slug))
      .first();
    if (existing) throw new Error("Workspace slug already taken");

    const now = Date.now();
    const maxSeats = TIER_LIMITS[args.tier] || 5;

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      ownerId: userId,
      slug: args.slug,
      tier: args.tier,
      maxSeats,
      settings: {
        allowGuestAccess: false,
        requireMfa: false,
        dataRetentionDays: 365,
        encryptionEnabled: true,
        auditLogEnabled: true,
        customBranding: args.tier === "business" || args.tier === "enterprise",
      },
      createdAt: now,
      updatedAt: now,
    });

    // Add creator as owner
    await ctx.db.insert("workspaceMembers", {
      workspaceId,
      userId,
      role: "owner",
      displayName: "Owner",
      avatarColor: AVATAR_COLORS[0],
      status: "active",
      joinedAt: now,
    });

    // Create default rooms
    for (const room of DEFAULT_ROOMS) {
      await ctx.db.insert("workspaceRooms", {
        workspaceId,
        name: room.name,
        type: room.type,
        capacity: room.capacity,
        position: room.position,
        size: room.size,
        color: room.color,
        icon: room.icon,
        isLocked: false,
        createdBy: userId,
        createdAt: now,
      });
    }

    await logAudit(ctx, workspaceId, userId, "create", "workspace", args.name);

    return workspaceId;
  },
});

export const getMyWorkspaces = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const memberships = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .collect();

    const workspaces = [];
    for (const m of memberships) {
      if (m.status !== "active") continue;
      const ws = await ctx.db.get(m.workspaceId);
      if (ws) {
        const memberCount = (
          await ctx.db
            .query("workspaceMembers")
            .withIndex("by_workspace_status", (q: any) =>
              q.eq("workspaceId", ws._id).eq("status", "active"),
            )
            .collect()
        ).length;
        workspaces.push({ ...ws, memberCount, myRole: m.role });
      }
    }
    return workspaces;
  },
});

export const getWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const { member } = await requireMember(ctx, args.workspaceId);
    const ws = await ctx.db.get(args.workspaceId);
    if (!ws) throw new Error("Workspace not found");

    const members = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q: any) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const rooms = await ctx.db
      .query("workspaceRooms")
      .withIndex("by_workspace", (q: any) => q.eq("workspaceId", args.workspaceId))
      .collect();

    // Get presence for all rooms
    const allPresence = await ctx.db
      .query("roomPresence")
      .withIndex("by_workspace", (q: any) => q.eq("workspaceId", args.workspaceId))
      .collect();

    // Filter stale presence (> 30s old)
    const now = Date.now();
    const activePresence = allPresence.filter((p: any) => now - p.lastPingAt < 30000);

    return {
      workspace: ws,
      members: members.filter((m: any) => m.status === "active"),
      rooms,
      presence: activePresence,
      myRole: member.role,
    };
  },
});

/* ═══════════════════════════════════════
   ROOM MANAGEMENT
   ═══════════════════════════════════════ */

export const createRoom = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    type: v.union(
      v.literal("office"),
      v.literal("auditorium"),
      v.literal("training"),
      v.literal("presentation"),
      v.literal("one_on_one"),
      v.literal("lounge"),
    ),
    capacity: v.number(),
    position: v.object({ x: v.number(), y: v.number() }),
    size: v.object({ w: v.number(), h: v.number() }),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx, args.workspaceId);

    const roomId = await ctx.db.insert("workspaceRooms", {
      workspaceId: args.workspaceId,
      name: args.name,
      type: args.type,
      capacity: args.capacity,
      position: args.position,
      size: args.size,
      color: args.color,
      icon: args.type === "office" ? "building" : args.type === "auditorium" ? "presentation" : args.type === "training" ? "graduation-cap" : args.type === "presentation" ? "monitor" : args.type === "one_on_one" ? "users" : "coffee",
      isLocked: false,
      createdBy: userId,
      createdAt: Date.now(),
    });

    await logAudit(ctx, args.workspaceId, userId, "create", "room", args.name);
    return roomId;
  },
});

export const updateRoomPosition = mutation({
  args: {
    roomId: v.id("workspaceRooms"),
    position: v.object({ x: v.number(), y: v.number() }),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    await requireAdmin(ctx, room.workspaceId);
    await ctx.db.patch(args.roomId, { position: args.position });
  },
});

/* ═══════════════════════════════════════
   PRESENCE & NAVIGATION
   ═══════════════════════════════════════ */

export const joinRoom = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    roomId: v.id("workspaceRooms"),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireMember(ctx, args.workspaceId);

    // Remove from any other room
    const existingPresence = await ctx.db
      .query("roomPresence")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .collect();
    for (const p of existingPresence) {
      await ctx.db.delete(p._id);
    }

    // Check room capacity
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    const currentOccupants = await ctx.db
      .query("roomPresence")
      .withIndex("by_room", (q: any) => q.eq("roomId", args.roomId))
      .collect();
    if (currentOccupants.length >= room.capacity) {
      throw new Error("Room is at capacity");
    }

    const now = Date.now();
    await ctx.db.insert("roomPresence", {
      workspaceId: args.workspaceId,
      roomId: args.roomId,
      userId,
      position: { x: Math.random() * 80 + 10, y: Math.random() * 60 + 20 },
      isVideoOn: false,
      isAudioOn: false,
      isScreenSharing: false,
      joinedAt: now,
      lastPingAt: now,
    });

    await logAudit(ctx, args.workspaceId, userId, "join", "room", room.name);
  },
});

export const leaveRoom = mutation({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const { userId } = await requireMember(ctx, args.workspaceId);
    const presence = await ctx.db
      .query("roomPresence")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .collect();
    for (const p of presence) {
      await ctx.db.delete(p._id);
    }
  },
});

export const heartbeat = mutation({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    const presence = await ctx.db
      .query("roomPresence")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .first();
    if (presence) {
      await ctx.db.patch(presence._id, { lastPingAt: Date.now() });
    }
    // Update member lastSeenAt
    const member = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_user", (q: any) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .first();
    if (member) {
      await ctx.db.patch(member._id, { lastSeenAt: Date.now() });
    }
  },
});

export const toggleMedia = mutation({
  args: {
    isVideoOn: v.optional(v.boolean()),
    isAudioOn: v.optional(v.boolean()),
    isScreenSharing: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    const presence = await ctx.db
      .query("roomPresence")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .first();
    if (presence) {
      const patch: any = {};
      if (args.isVideoOn !== undefined) patch.isVideoOn = args.isVideoOn;
      if (args.isAudioOn !== undefined) patch.isAudioOn = args.isAudioOn;
      if (args.isScreenSharing !== undefined) patch.isScreenSharing = args.isScreenSharing;
      await ctx.db.patch(presence._id, patch);
    }
  },
});

/* ═══════════════════════════════════════
   MEMBER MANAGEMENT
   ═══════════════════════════════════════ */

export const inviteMember = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("member"), v.literal("guest")),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx, args.workspaceId);
    const ws = await ctx.db.get(args.workspaceId);
    if (!ws) throw new Error("Workspace not found");

    // Check seat limit
    const activeMembers = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_status", (q: any) =>
        q.eq("workspaceId", args.workspaceId).eq("status", "active"),
      )
      .collect();
    if (activeMembers.length >= ws.maxSeats) {
      throw new Error(`Seat limit reached (${ws.maxSeats}). Upgrade your plan for more seats.`);
    }

    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    await ctx.db.insert("workspaceMembers", {
      workspaceId: args.workspaceId,
      userId, // placeholder — will be replaced when they accept
      role: args.role,
      displayName: args.displayName,
      avatarColor: color,
      status: "invited",
      invitedBy: userId,
      invitedEmail: args.email,
      joinedAt: Date.now(),
    });

    await logAudit(ctx, args.workspaceId, userId, "invite", "member", args.email);
  },
});

export const removeMember = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    memberId: v.id("workspaceMembers"),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx, args.workspaceId);
    const member = await ctx.db.get(args.memberId);
    if (!member) throw new Error("Member not found");
    if (member.role === "owner") throw new Error("Cannot remove workspace owner");

    await ctx.db.patch(args.memberId, { status: "suspended" as const });
    await logAudit(ctx, args.workspaceId, userId, "remove", "member", member.displayName);
  },
});

/* ═══════════════════════════════════════
   MEETINGS
   ═══════════════════════════════════════ */

export const startMeeting = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    roomId: v.id("workspaceRooms"),
    title: v.string(),
    transcriptionEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireMember(ctx, args.workspaceId);
    const now = Date.now();

    const meetingId = await ctx.db.insert("meetings", {
      workspaceId: args.workspaceId,
      roomId: args.roomId,
      title: args.title,
      hostId: userId,
      status: "active",
      startedAt: now,
      participantIds: [userId],
      recordingEnabled: false,
      transcriptionEnabled: args.transcriptionEnabled ?? true,
      createdAt: now,
    });

    await logAudit(ctx, args.workspaceId, userId, "start", "meeting", args.title);
    return meetingId;
  },
});

export const endMeeting = mutation({
  args: { meetingId: v.id("meetings") },
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) throw new Error("Meeting not found");

    const { userId } = await requireMember(ctx, meeting.workspaceId);

    await ctx.db.patch(args.meetingId, {
      status: "ended",
      endedAt: Date.now(),
    });

    await logAudit(ctx, meeting.workspaceId, userId, "end", "meeting", meeting.title);
  },
});

export const getActiveMeetings = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    await requireMember(ctx, args.workspaceId);
    return await ctx.db
      .query("meetings")
      .withIndex("by_workspace_status", (q: any) =>
        q.eq("workspaceId", args.workspaceId).eq("status", "active"),
      )
      .collect();
  },
});

export const getMeetingHistory = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    await requireMember(ctx, args.workspaceId);
    const meetings = await ctx.db
      .query("meetings")
      .withIndex("by_workspace", (q: any) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .take(50);
    return meetings;
  },
});

/* ═══════════════════════════════════════
   TRANSCRIPTS & INSIGHTS
   ═══════════════════════════════════════ */

export const addTranscriptChunk = mutation({
  args: {
    meetingId: v.id("meetings"),
    text: v.string(),
    speakerName: v.string(),
    confidence: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) throw new Error("Meeting not found");
    const { userId } = await requireMember(ctx, meeting.workspaceId);

    await ctx.db.insert("meetingTranscripts", {
      meetingId: args.meetingId,
      workspaceId: meeting.workspaceId,
      speakerId: userId,
      speakerName: args.speakerName,
      text: args.text,
      timestamp: Date.now(),
      confidence: args.confidence,
    });
  },
});

export const getTranscript = query({
  args: { meetingId: v.id("meetings") },
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) throw new Error("Meeting not found");
    await requireMember(ctx, meeting.workspaceId);

    return await ctx.db
      .query("meetingTranscripts")
      .withIndex("by_meeting_time", (q: any) => q.eq("meetingId", args.meetingId))
      .collect();
  },
});

export const saveInsights = mutation({
  args: {
    meetingId: v.id("meetings"),
    summary: v.string(),
    keyTakeaways: v.array(v.string()),
    actionItems: v.array(v.object({
      text: v.string(),
      assignee: v.optional(v.string()),
      dueDate: v.optional(v.string()),
      completed: v.boolean(),
    })),
    decisions: v.array(v.string()),
    sentiment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) throw new Error("Meeting not found");
    await requireMember(ctx, meeting.workspaceId);

    return await ctx.db.insert("meetingInsights", {
      meetingId: args.meetingId,
      workspaceId: meeting.workspaceId,
      summary: args.summary,
      keyTakeaways: args.keyTakeaways,
      actionItems: args.actionItems,
      decisions: args.decisions,
      sentiment: args.sentiment,
      generatedAt: Date.now(),
    });
  },
});

export const getInsights = query({
  args: { meetingId: v.id("meetings") },
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) throw new Error("Meeting not found");
    await requireMember(ctx, meeting.workspaceId);

    return await ctx.db
      .query("meetingInsights")
      .withIndex("by_meeting", (q: any) => q.eq("meetingId", args.meetingId))
      .first();
  },
});

/* ═══════════════════════════════════════
   AUDIT LOG
   ═══════════════════════════════════════ */

export const getAuditLog = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.workspaceId);
    return await ctx.db
      .query("workspaceAuditLog")
      .withIndex("by_workspace_time", (q: any) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .take(100);
  },
});

/* ═══════════════════════════════════════
   WORKSPACE SETTINGS
   ═══════════════════════════════════════ */

export const updateSettings = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    settings: v.object({
      allowGuestAccess: v.boolean(),
      requireMfa: v.boolean(),
      dataRetentionDays: v.number(),
      encryptionEnabled: v.boolean(),
      auditLogEnabled: v.boolean(),
      customBranding: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx, args.workspaceId);
    await ctx.db.patch(args.workspaceId, {
      settings: args.settings,
      updatedAt: Date.now(),
    });
    await logAudit(ctx, args.workspaceId, userId, "update", "settings", JSON.stringify(args.settings));
  },
});

/* ═══════════════════════════════════════════════════════
   DEVICE / MEDIA PREFERENCES
   ═══════════════════════════════════════════════════════ */

export const getDevicePreferences = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("userDevicePreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const saveDevicePreferences = mutation({
  args: {
    preferredCamera: v.optional(v.string()),
    preferredMic: v.optional(v.string()),
    preferredSpeaker: v.optional(v.string()),
    virtualBackground: v.optional(v.string()),
    setupCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("userDevicePreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        userId,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("userDevicePreferences", {
        userId,
        ...args,
        updatedAt: Date.now(),
      });
    }
  },
});

/* ─── set user presence / availability status ─── */
export const setPresenceStatus = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    presenceStatus: v.union(
      v.literal("available"),
      v.literal("busy"),
      v.literal("on_a_call"),
      v.literal("in_a_meeting"),
      v.literal("away"),
      v.literal("brb"),
      v.literal("dnd"),
      v.literal("on_break"),
      v.literal("offline"),
    ),
    presenceMessage: v.optional(v.string()),
    presenceUntil: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const member = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member) throw new Error("Not a member of this workspace");

    await ctx.db.patch(member._id, {
      presenceStatus: args.presenceStatus,
      presenceMessage: args.presenceMessage,
      presenceUntil: args.presenceUntil,
      lastSeenAt: Date.now(),
    });

    return { success: true };
  },
});

/* ─── set user department ─── */
export const setDepartment = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    memberId: v.id("workspaceMembers"),
    department: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Only admins/owners can assign departments
    const caller = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
      throw new Error("Only admins can assign departments");
    }

    await ctx.db.patch(args.memberId, { department: args.department });
    return { success: true };
  },
});

/* ─── Room Chat ─── */
export const getRoomMessages = query({
  args: {
    roomId: v.id("workspaceRooms"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const msgs = await ctx.db
      .query("roomMessages")
      .withIndex("by_room_time", (q) => q.eq("roomId", args.roomId))
      .order("desc")
      .take(args.limit || 50);
    return msgs.reverse();
  },
});

export const sendRoomMessage = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    roomId: v.id("workspaceRooms"),
    text: v.string(),
    type: v.optional(v.union(v.literal("message"), v.literal("reaction"), v.literal("system"))),
    reactionEmoji: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const member = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member) throw new Error("Not a member");

    return await ctx.db.insert("roomMessages", {
      workspaceId: args.workspaceId,
      roomId: args.roomId,
      userId,
      displayName: member.displayName,
      avatarColor: member.avatarColor,
      text: args.text,
      type: args.type || "message",
      reactionEmoji: args.reactionEmoji,
      timestamp: Date.now(),
    });
  },
});

/* ─── Speaker Queue (Auditorium) ─── */
export const getSpeakerQueue = query({
  args: { roomId: v.id("workspaceRooms") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("speakerQueue")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});

export const joinSpeakerQueue = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    roomId: v.id("workspaceRooms"),
    topic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const member = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member) throw new Error("Not a member");

    // Check not already in queue
    const existing = await ctx.db
      .query("speakerQueue")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
    if (existing.some((e) => e.userId === userId && e.status !== "done")) {
      throw new Error("Already in queue");
    }

    const maxPos = existing.reduce((max, e) => Math.max(max, e.position), 0);

    return await ctx.db.insert("speakerQueue", {
      workspaceId: args.workspaceId,
      roomId: args.roomId,
      userId,
      displayName: member.displayName,
      topic: args.topic,
      status: "waiting",
      position: maxPos + 1,
      joinedAt: Date.now(),
    });
  },
});

export const advanceSpeakerQueue = mutation({
  args: {
    roomId: v.id("workspaceRooms"),
    speakerId: v.id("speakerQueue"),
    newStatus: v.union(v.literal("speaking"), v.literal("done")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(args.speakerId, { status: args.newStatus });
    return { success: true };
  },
});
