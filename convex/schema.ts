import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  /* ── user subscription tier ── */
  userSubscriptions: defineTable({
    userId: v.id("users"),
    tier: v.union(
      v.literal("free"),
      v.literal("pro"),
      v.literal("business"),
      // workspace tiers
      v.literal("starter"),
      v.literal("team"),
      v.literal("enterprise"),
      // legacy tiers kept for backward compat
      v.literal("elite"),
      v.literal("master"),
    ),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_stripe_customer", ["stripeCustomerId"]),

  /* ── per-lesson progress ── */
  lessonProgress: defineTable({
    userId: v.id("users"),
    lessonId: v.string(),
    contentCompleted: v.boolean(),
    sandboxScore: v.optional(v.number()),
    sandboxPassed: v.boolean(),
    sandboxResponse: v.optional(v.string()),
    quizScore: v.optional(v.number()),
    quizPassed: v.boolean(),
    quizAttempts: v.number(),
    completedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_lesson", ["userId", "lessonId"]),

  /* ── XP / level / streak ── */
  userXp: defineTable({
    userId: v.id("users"),
    totalXp: v.number(),
    level: v.number(),
    currentStreak: v.number(),
    lastActivityDate: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  /* ── admin roles ── */
  userRoles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user")),
    blocked: v.boolean(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  /* ── page view analytics ── */
  pageViews: defineTable({
    userId: v.optional(v.id("users")),
    path: v.string(),
    userAgent: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_path", ["path"])
    .index("by_user", ["userId"]),

  /* ── screenshot attempt log ── */
  securityEvents: defineTable({
    userId: v.optional(v.id("users")),
    eventType: v.string(),
    path: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_user", ["userId"]),

  /* ═══════════════════════════════════════════════
     E-QUIPPED: WORK[SPACE] TABLES
     ═══════════════════════════════════════════════ */

  /* ── workspaces (tenant isolation root) ── */
  workspaces: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    slug: v.string(),
    tier: v.union(
      v.literal("starter"),
      v.literal("team"),
      v.literal("business"),
      v.literal("enterprise"),
    ),
    maxSeats: v.number(),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    settings: v.object({
      allowGuestAccess: v.boolean(),
      requireMfa: v.boolean(),
      dataRetentionDays: v.number(),
      encryptionEnabled: v.boolean(),
      auditLogEnabled: v.boolean(),
      customBranding: v.boolean(),
    }),
    /* workspace branding */
    companyLogo: v.optional(v.string()),
    brandColor: v.optional(v.string()),
    brandAccent: v.optional(v.string()),
    departments: v.optional(v.array(v.string())),   // defined department list
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_slug", ["slug"])
    .index("by_stripe_customer", ["stripeCustomerId"]),

  /* ── workspace members ── */
  workspaceMembers: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("member"),
      v.literal("guest"),
    ),
    displayName: v.string(),
    avatarColor: v.string(),
    status: v.union(v.literal("active"), v.literal("invited"), v.literal("suspended")),
    invitedBy: v.optional(v.id("users")),
    invitedEmail: v.optional(v.string()),
    lastSeenAt: v.optional(v.number()),
    joinedAt: v.number(),
    /* availability / status */
    presenceStatus: v.optional(v.union(
      v.literal("available"),
      v.literal("busy"),
      v.literal("on_a_call"),
      v.literal("in_a_meeting"),
      v.literal("away"),
      v.literal("brb"),
      v.literal("dnd"),
      v.literal("on_break"),
      v.literal("offline"),
    )),
    presenceMessage: v.optional(v.string()),
    presenceUntil: v.optional(v.number()),
    department: v.optional(v.string()),
    assignedRoomId: v.optional(v.id("workspaceRooms")), // personal office
    jobTitle: v.optional(v.string()),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_user", ["userId"])
    .index("by_workspace_user", ["workspaceId", "userId"])
    .index("by_workspace_status", ["workspaceId", "status"]),

  /* ── rooms within a workspace ── */
  workspaceRooms: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    type: v.union(
      v.literal("office"),
      v.literal("personal_office"),
      v.literal("auditorium"),
      v.literal("training"),
      v.literal("presentation"),
      v.literal("one_on_one"),
      v.literal("lounge"),
      v.literal("conference"),
      v.literal("custom"),
    ),
    capacity: v.number(),
    position: v.object({ x: v.number(), y: v.number() }),
    size: v.object({ w: v.number(), h: v.number() }),
    color: v.string(),
    icon: v.string(),
    isLocked: v.boolean(),
    isLive: v.optional(v.boolean()),                // "Make Room Live" toggle
    allowedRoles: v.optional(v.array(v.string())),
    department: v.optional(v.string()),              // room belongs to department
    description: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),           // personal office owner
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_assigned", ["assignedTo"]),

  /* ── user presence in rooms ── */
  roomPresence: defineTable({
    workspaceId: v.id("workspaces"),
    roomId: v.id("workspaceRooms"),
    userId: v.id("users"),
    position: v.object({ x: v.number(), y: v.number() }),
    isVideoOn: v.boolean(),
    isAudioOn: v.boolean(),
    isScreenSharing: v.boolean(),
    joinedAt: v.number(),
    lastPingAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_workspace", ["workspaceId"])
    .index("by_user", ["userId"]),

  /* ── meetings ── */
  meetings: defineTable({
    workspaceId: v.id("workspaces"),
    roomId: v.id("workspaceRooms"),
    title: v.string(),
    description: v.optional(v.string()),
    hostId: v.id("users"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("active"),
      v.literal("ended"),
      v.literal("cancelled"),
    ),
    scheduledAt: v.optional(v.number()),
    scheduledEndAt: v.optional(v.number()),
    startedAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
    participantIds: v.array(v.id("users")),
    invitedDepartments: v.optional(v.array(v.string())),   // invite whole departments
    invitedMemberIds: v.optional(v.array(v.id("users"))),  // individual invites
    rsvpAccepted: v.optional(v.array(v.id("users"))),
    rsvpDeclined: v.optional(v.array(v.id("users"))),
    recordingEnabled: v.boolean(),
    transcriptionEnabled: v.boolean(),
    isRecurring: v.optional(v.boolean()),
    recurrenceRule: v.optional(v.string()),  // e.g. "weekly:mon,wed,fri"
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_room", ["roomId"])
    .index("by_status", ["status"])
    .index("by_workspace_status", ["workspaceId", "status"]),

  /* ── visitor sessions (external appointment access) ── */
  visitorSessions: defineTable({
    workspaceId: v.id("workspaces"),
    visitorName: v.string(),
    visitorEmail: v.string(),
    visitorCompany: v.optional(v.string()),
    purpose: v.string(),
    hostMemberId: v.id("users"),          // who they're visiting
    roomId: v.optional(v.id("workspaceRooms")),  // assigned room
    accessToken: v.string(),              // unique link token
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("checked_in"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
    scheduledAt: v.number(),
    scheduledEndAt: v.optional(v.number()),
    checkedInAt: v.optional(v.number()),
    checkedOutAt: v.optional(v.number()),
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_token", ["accessToken"])
    .index("by_host", ["hostMemberId"])
    .index("by_workspace_status", ["workspaceId", "status"]),

  /* ── meeting transcripts (chunks) ── */
  meetingTranscripts: defineTable({
    meetingId: v.id("meetings"),
    workspaceId: v.id("workspaces"),
    speakerId: v.id("users"),
    speakerName: v.string(),
    text: v.string(),
    timestamp: v.number(),
    confidence: v.optional(v.number()),
  })
    .index("by_meeting", ["meetingId"])
    .index("by_meeting_time", ["meetingId", "timestamp"]),

  /* ── AI meeting insights ── */
  meetingInsights: defineTable({
    meetingId: v.id("meetings"),
    workspaceId: v.id("workspaces"),
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
    emailSentTo: v.optional(v.array(v.string())),
    generatedAt: v.number(),
  })
    .index("by_meeting", ["meetingId"])
    .index("by_workspace", ["workspaceId"]),

  /* ── user device/media preferences ── */
  userDevicePreferences: defineTable({
    userId: v.id("users"),
    preferredCamera: v.optional(v.string()),
    preferredMic: v.optional(v.string()),
    preferredSpeaker: v.optional(v.string()),
    virtualBackground: v.optional(v.string()), // "none" | "blur" | preset key | custom URL
    setupCompleted: v.boolean(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  /* ── room chat messages ── */
  roomMessages: defineTable({
    workspaceId: v.id("workspaces"),
    roomId: v.id("workspaceRooms"),
    userId: v.id("users"),
    displayName: v.string(),
    avatarColor: v.string(),
    text: v.string(),
    type: v.union(
      v.literal("message"),
      v.literal("reaction"),   // 👏 clap / ✋ raise hand
      v.literal("system"),     // "X joined the room"
    ),
    reactionEmoji: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_time", ["roomId", "timestamp"]),

  /* ── auditorium speaker queue ── */
  speakerQueue: defineTable({
    workspaceId: v.id("workspaces"),
    roomId: v.id("workspaceRooms"),
    userId: v.id("users"),
    displayName: v.string(),
    topic: v.optional(v.string()),
    status: v.union(
      v.literal("waiting"),
      v.literal("speaking"),
      v.literal("done"),
    ),
    position: v.number(),
    joinedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_status", ["roomId", "status"]),

  /* ── workspace audit log (security) ── */
  workspaceAuditLog: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    action: v.string(),
    resource: v.string(),
    details: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_time", ["workspaceId", "timestamp"])
    .index("by_user", ["userId"]),
});

export default schema;
