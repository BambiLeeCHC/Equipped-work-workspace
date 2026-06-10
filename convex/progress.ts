import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/* ── queries ── */

export const getSubscription = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { tier: "free" as const };
    const sub = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    return sub ?? { tier: "free" as const };
  },
});

export const getUserTier = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return "free" as const;
    const sub = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    return (sub?.tier ?? "free") as "free" | "pro" | "business" | "elite" | "master";
  },
});

export const getUserXp = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { totalXp: 0, level: 1, currentStreak: 0 };
    const xp = await ctx.db
      .query("userXp")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    return xp ?? { totalXp: 0, level: 1, currentStreak: 0 };
  },
});

export const getAllProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("lessonProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getLessonProgress = query({
  args: { lessonId: v.string() },
  handler: async (ctx, { lessonId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return ctx.db
      .query("lessonProgress")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", userId).eq("lessonId", lessonId),
      )
      .first();
  },
});

/* ── mutations ── */

export const markContentComplete = mutation({
  args: { lessonId: v.string() },
  handler: async (ctx, { lessonId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("lessonProgress")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", userId).eq("lessonId", lessonId),
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        contentCompleted: true,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("lessonProgress", {
        userId,
        lessonId,
        contentCompleted: true,
        sandboxPassed: false,
        quizPassed: false,
        quizAttempts: 0,
        updatedAt: Date.now(),
      });
    }
  },
});

export const submitSandbox = mutation({
  args: {
    lessonId: v.string(),
    response: v.string(),
    score: v.number(),
    passed: v.boolean(),
  },
  handler: async (ctx, { lessonId, response, score, passed }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("lessonProgress")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", userId).eq("lessonId", lessonId),
      )
      .first();

    const update = {
      sandboxScore: score,
      sandboxPassed: passed,
      sandboxResponse: response,
      updatedAt: Date.now(),
    };

    if (existing) {
      // Only upgrade — don't downgrade a pass
      if (!existing.sandboxPassed || passed) {
        await ctx.db.patch(existing._id, update);
      }
    } else {
      await ctx.db.insert("lessonProgress", {
        userId,
        lessonId,
        contentCompleted: true,
        ...update,
        quizPassed: false,
        quizAttempts: 0,
      });
    }

    // Award XP if first pass
    if (passed && (!existing || !existing.sandboxPassed)) {
      await addXp(ctx, userId, 25);
    }
  },
});

export const submitQuiz = mutation({
  args: {
    lessonId: v.string(),
    score: v.number(),
    passed: v.boolean(),
    xpReward: v.number(),
  },
  handler: async (ctx, { lessonId, score, passed, xpReward }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("lessonProgress")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", userId).eq("lessonId", lessonId),
      )
      .first();

    const now = Date.now();

    if (existing) {
      const wasAlreadyPassed = existing.quizPassed;
      await ctx.db.patch(existing._id, {
        quizScore: score,
        quizPassed: existing.quizPassed || passed,
        quizAttempts: existing.quizAttempts + 1,
        completedAt: passed ? now : existing.completedAt,
        updatedAt: now,
      });
      // XP only on first pass
      if (passed && !wasAlreadyPassed) {
        await addXp(ctx, userId, xpReward);
      }
    } else {
      await ctx.db.insert("lessonProgress", {
        userId,
        lessonId,
        contentCompleted: true,
        sandboxPassed: true,
        quizScore: score,
        quizPassed: passed,
        quizAttempts: 1,
        completedAt: passed ? now : undefined,
        updatedAt: now,
      });
      if (passed) {
        await addXp(ctx, userId, xpReward);
      }
    }
  },
});

/* ── XP helper ── */

async function addXp(
  ctx: { db: any },
  userId: any,
  amount: number,
) {
  const existing = await ctx.db
    .query("userXp")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();

  const today = new Date().toISOString().slice(0, 10);

  if (existing) {
    const newTotal = existing.totalXp + amount;
    const newLevel = Math.floor(newTotal / 500) + 1;
    const streak =
      existing.lastActivityDate === today
        ? existing.currentStreak
        : existing.lastActivityDate ===
            new Date(Date.now() - 86400000).toISOString().slice(0, 10)
          ? existing.currentStreak + 1
          : 1;
    await ctx.db.patch(existing._id, {
      totalXp: newTotal,
      level: newLevel,
      currentStreak: streak,
      lastActivityDate: today,
      updatedAt: Date.now(),
    });
  } else {
    await ctx.db.insert("userXp", {
      userId,
      totalXp: amount,
      level: 1,
      currentStreak: 1,
      lastActivityDate: today,
      updatedAt: Date.now(),
    });
  }
}
