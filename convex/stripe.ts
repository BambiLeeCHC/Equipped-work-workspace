import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { action, internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

declare const process: { env: Record<string, string | undefined> };

/* ═══════════════════════════════════════════════════════════════
   PAYMENT LINK MAP
   ═══════════════════════════════════════════════════════════════
   Stripe Payment Links are created externally and their URLs
   stored as env vars. The frontend reads these to redirect users
   to the correct Stripe-hosted checkout page.
   ═══════════════════════════════════════════════════════════════ */

const PAYMENT_LINKS: Record<string, string> = {
  "pro_weekly":          "https://buy.stripe.com/14AcN67wVcktc7e4FP4c802",
  "pro_monthly":         "https://buy.stripe.com/eVq6oIeZn98h0owc8h4c809",
  "pro_yearly":          "https://buy.stripe.com/28E7sM18xgAJgnuegp4c803",
  "business_weekly":     "https://buy.stripe.com/cNidRaeZnckt0ow6NX4c804",
  "business_monthly":    "https://buy.stripe.com/6oUcN69F31FP9Z67S14c808",
  "business_yearly":     "https://buy.stripe.com/eVq5kE04t84d5IQdcl4c805",
  "workspace_starter":   "https://buy.stripe.com/5kQ5kE4kJ3NXc7e7S14c80b",
  "workspace_team":      "https://buy.stripe.com/9B6fZi5oNdoxb3a7S14c806",
  "workspace_business":  "https://buy.stripe.com/3cI7sM04t3NXfjq2xH4c80a",
  "workspace_enterprise":"https://buy.stripe.com/14AdRabNbfwF3AIgox4c807",
};

/* ── Get Payment Link URL ── */
export const getPaymentLink = action({
  args: {
    tier: v.string(),
    billing: v.optional(v.string()),
  },
  handler: async (_ctx, { tier, billing }) => {
    const cycle = billing ?? "monthly";
    let key = "";

    if (tier === "pro" || tier === "business") {
      key = `${tier}_${cycle}`;
    } else if (tier.startsWith("workspace_")) {
      key = tier;
    } else {
      throw new Error(`Unknown tier: ${tier}`);
    }

    const url = PAYMENT_LINKS[key];
    if (!url) throw new Error(`No payment link configured for: ${key}`);

    return { url };
  },
});

/* ── Legacy: Create Checkout Session (uses STRIPE_SECRET_KEY) ── */
export const createCheckoutSession = action({
  args: {
    tier: v.union(v.literal("pro"), v.literal("business")),
    billing: v.optional(v.union(v.literal("weekly"), v.literal("monthly"), v.literal("yearly"))),
  },
  handler: async (ctx, { tier, billing }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";

    // If no stripe key, fall back to payment links
    if (!stripeKey) {
      const cycle = billing ?? "monthly";
      const key = `${tier}_${cycle}`;
      const url = PAYMENT_LINKS[key] ?? "";
      if (url) return { url, sessionId: "payment_link" };
      throw new Error("Stripe not configured — no secret key or payment link available");
    }

    const config = TIER_CONFIG[tier];
    if (!config) throw new Error(`Unknown tier: ${tier}`);

    const cycle = billing ?? "monthly";
    const envKey = cycle === "weekly" ? config.weeklyEnv
                 : cycle === "yearly"  ? config.yearlyEnv
                 : config.monthlyEnv;

    const priceId = process.env[envKey] ?? "";
    if (!priceId) throw new Error(`Price not configured for ${tier} (${cycle}). Set ${envKey} env var.`);

    const user = await ctx.runQuery(internal.stripe.getUserInfo, { userId });

    let customerId: string | null = user?.stripeCustomerId ?? null;
    if (!customerId) {
      const customerRes = await fetch("https://api.stripe.com/v1/customers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: user?.email ?? "",
          name: user?.name ?? "",
          "metadata[convex_user_id]": userId,
        }),
      });
      const customer = await customerRes.json() as Record<string, any>;
      if (customer.error) throw new Error(customer.error.message);
      customerId = String(customer.id);

      await ctx.runMutation(internal.stripe.saveStripeCustomerId, {
        userId,
        stripeCustomerId: customerId,
      });
    }

    const baseUrl = process.env.SITE_URL || "https://equipped-work-45125672.viktor.space";
    const successUrl = `${baseUrl}/dashboard?upgraded=${tier}`;
    const cancelUrl = `${baseUrl}/pricing`;

    const params = new URLSearchParams({
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      mode: config.mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      "metadata[convex_user_id]": userId,
      "metadata[tier]": tier,
      "metadata[billing]": cycle,
      allow_promotion_codes: "true",
    });

    const sessionRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    const session = await sessionRes.json() as Record<string, any>;
    if (session.error) throw new Error(session.error.message);

    return { url: String(session.url), sessionId: String(session.id) };
  },
});

const TIER_CONFIG: Record<string, {
  weeklyEnv: string;
  monthlyEnv: string;
  yearlyEnv: string;
  mode: "subscription";
}> = {
  pro: {
    weeklyEnv: "STRIPE_PRICE_PRO_WEEKLY",
    monthlyEnv: "STRIPE_PRICE_PRO",
    yearlyEnv: "STRIPE_PRICE_PRO_YEARLY",
    mode: "subscription",
  },
  business: {
    weeklyEnv: "STRIPE_PRICE_BIZ_WEEKLY",
    monthlyEnv: "STRIPE_PRICE_BIZ",
    yearlyEnv: "STRIPE_PRICE_BIZ_YEARLY",
    mode: "subscription",
  },
};

/* ═══════════════════════════════════════════════════════════════
   THANK YOU EMAIL
   ═══════════════════════════════════════════════════════════════ */

const TIER_DISPLAY_NAMES: Record<string, string> = {
  pro: "E-Quipped: Work Pro",
  business: "E-Quipped: Work Business",
  workspace_starter: "E-Quipped: Work[space] Starter",
  workspace_team: "E-Quipped: Work[space] Team",
  workspace_business: "E-Quipped: Work[space] Business",
  workspace_enterprise: "E-Quipped: Work[space] Enterprise",
};

export const sendThankYouEmail = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    tier: v.string(),
    billing: v.string(),
    amountCents: v.number(),
  },
  handler: async (_ctx, { email, name, tier, billing, amountCents }) => {
    const apiUrl = process.env.VIKTOR_SPACES_API_URL;
    const projectName = process.env.VIKTOR_SPACES_PROJECT_NAME;
    const projectSecret = process.env.VIKTOR_SPACES_PROJECT_SECRET;

    if (!apiUrl || !projectName || !projectSecret) {
      console.error("Viktor Spaces email env vars not configured");
      return;
    }

    const displayName = name || "there";
    const tierName = TIER_DISPLAY_NAMES[tier] ?? tier;
    const amountStr = `$${(amountCents / 100).toFixed(2)}`;
    const isWorkspace = tier.startsWith("workspace_");

    const subject = `Welcome to ${tierName}! 🎉`;

    const htmlContent = `
<div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #ffffff; border-radius: 12px; overflow: hidden;">
  <!-- Header gradient bar -->
  <div style="height: 4px; background: linear-gradient(90deg, #d946ef, #a855f7, #06b6d4);"></div>

  <div style="padding: 40px 32px;">
    <!-- Logo & Welcome -->
    <h1 style="font-size: 28px; margin: 0 0 8px 0; color: #ffffff;">Welcome to E-Quipped: Work${isWorkspace ? " [Space]" : ""}</h1>
    <p style="color: #a855f7; font-size: 16px; margin: 0 0 24px 0;">Your AI mastery journey starts now.</p>

    <p style="color: #d1d5db; font-size: 15px; line-height: 1.6;">
      Hey ${displayName},
    </p>

    <p style="color: #d1d5db; font-size: 15px; line-height: 1.6;">
      Thank you for subscribing to <strong style="color: #ffffff;">${tierName}</strong> (${billing}, ${amountStr}).
      We're excited to have you on board!
    </p>

    <!-- Divider -->
    <div style="height: 1px; background: linear-gradient(90deg, transparent, #a855f7, transparent); margin: 24px 0;"></div>

    ${isWorkspace ? `
    <!-- Workspace Quick Start -->
    <h2 style="font-size: 20px; color: #06b6d4; margin: 0 0 16px 0;">🏢 Your Workspace Quick Start</h2>
    <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <p style="color: #d1d5db; font-size: 14px; line-height: 1.8; margin: 0;">
        <strong style="color: #ffffff;">1.</strong> Your dedicated workspace is being prepared right now<br>
        <strong style="color: #ffffff;">2.</strong> We'll reach out shortly to get your company branding (logo, colors)<br>
        <strong style="color: #ffffff;">3.</strong> We'll set up your rooms, invite your team, and walk you through everything<br>
        <strong style="color: #ffffff;">4.</strong> Your team will receive custom login credentials
      </p>
    </div>
    ` : `
    <!-- Course Quick Start -->
    <h2 style="font-size: 20px; color: #06b6d4; margin: 0 0 16px 0;">🚀 Quick Start Guide</h2>
    <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <p style="color: #d1d5db; font-size: 14px; line-height: 1.8; margin: 0;">
        <strong style="color: #ffffff;">1.</strong> Log in at <a href="https://equipped-work-45125672.viktor.space" style="color: #a855f7;">equipped-work-45125672.viktor.space</a><br>
        <strong style="color: #ffffff;">2.</strong> Start with Module 1: AI Prompting — it's the foundation for everything<br>
        <strong style="color: #ffffff;">3.</strong> Read the lesson → try it in the AI Sandbox → pass the quiz (80% to advance)<br>
        <strong style="color: #ffffff;">4.</strong> The C.R.A.F.T. framework (Context, Role, Action, Format, Tone) is your key<br>
        <strong style="color: #ffffff;">5.</strong> Earn XP, build streaks, and level up as you complete lessons
      </p>
    </div>
    `}

    <!-- What's Included -->
    <h2 style="font-size: 20px; color: #06b6d4; margin: 0 0 16px 0;">📦 What's Included</h2>
    <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <p style="color: #d1d5db; font-size: 14px; line-height: 1.8; margin: 0;">
        ${isWorkspace ? `
        ✅ AI-powered virtual office with customizable rooms<br>
        ✅ Meeting transcription with AI insights & action items<br>
        ✅ Real-time team presence & smart room assignments<br>
        ✅ Post-meeting email summaries<br>
        ✅ Company branding & custom onboarding
        ` : `
        ✅ All 7 modules, 35 lessons — full curriculum access<br>
        ✅ Live AI Sandbox (GPT-4o, Claude 3.5, Gemini Pro)<br>
        ✅ Mock datasets & auto-populate exercises<br>
        ✅ Quiz-gated progression (mastery-based)<br>
        ✅ XP, levels, streaks & gamification${tier === "business" ? "<br>✅ E-Quipped: Work[space] virtual office included" : ""}
        `}
      </p>
    </div>

    <!-- Contact Section -->
    <div style="height: 1px; background: linear-gradient(90deg, transparent, #d946ef, transparent); margin: 24px 0;"></div>

    <h2 style="font-size: 20px; color: #d946ef; margin: 0 0 16px 0;">📞 Need Help? We're Here.</h2>
    <div style="background: rgba(217, 70, 239, 0.1); border: 1px solid rgba(217, 70, 239, 0.2); border-radius: 8px; padding: 20px;">
      <p style="color: #d1d5db; font-size: 14px; line-height: 1.8; margin: 0;">
        Have questions about the platform? Want a personal walkthrough? Need help getting started?
        <strong style="color: #ffffff;">Don't hesitate to reach out — we're here for you.</strong>
      </p>
      <div style="margin-top: 16px;">
        <p style="color: #ffffff; font-size: 15px; margin: 4px 0;"><strong>Oland Stokes III</strong> — Founder</p>
        <p style="color: #d1d5db; font-size: 14px; margin: 4px 0;">📧 <a href="mailto:equippedbyxixvi@gmail.com" style="color: #a855f7;">equippedbyxixvi@gmail.com</a></p>
        <p style="color: #d1d5db; font-size: 14px; margin: 4px 0;">📱 Text or call anytime — I'll personally help you get the most out of your subscription.</p>
        <p style="color: #d1d5db; font-size: 14px; margin: 4px 0;">📅 Want a live walkthrough? Just reply to this email and we'll set something up.</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
      <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">
        E-Quipped: Work — by XI Eleven XVI Sixteen LLC<br>
        <a href="https://equipped-work-45125672.viktor.space" style="color: #a855f7;">equipped-work-45125672.viktor.space</a>
      </p>
    </div>
  </div>
</div>
    `;

    const textContent = `
Welcome to ${tierName}!

Hey ${displayName},

Thank you for subscribing to ${tierName} (${billing}, ${amountStr}). We're excited to have you!

${isWorkspace ? `QUICK START:
1. Your workspace is being prepared now
2. We'll reach out to get your company branding
3. We'll set up rooms, invite your team, walk you through everything
4. Your team gets custom login credentials` : `QUICK START:
1. Log in at https://equipped-work-45125672.viktor.space
2. Start with Module 1: AI Prompting
3. Read lesson → AI Sandbox → Pass quiz (80%)
4. Master the C.R.A.F.T. framework
5. Earn XP, build streaks, level up`}

NEED HELP?
Oland Stokes III — Founder
Email: equippedbyxixvi@gmail.com
Text or call anytime. Want a live walkthrough? Reply to this email.

---
E-Quipped: Work — by XI Eleven XVI Sixteen LLC
https://equipped-work-45125672.viktor.space
    `;

    try {
      const response = await fetch(`${apiUrl}/api/viktor-spaces/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: projectName,
          project_secret: projectSecret,
          to_email: email,
          subject,
          html_content: htmlContent,
          text_content: textContent,
          email_type: "transactional",
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Failed to send thank-you email:", err);
      }
    } catch (err) {
      console.error("Error sending thank-you email:", err);
    }
  },
});

/* ═══════════════════════════════════════════════════════════════
   NOTIFY OWNER (TREY) ON HIGH-TIER SUBSCRIPTIONS
   ═══════════════════════════════════════════════════════════════ */

export const notifyOwnerNewSubscription = internalAction({
  args: {
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    companyName: v.string(),
    tier: v.string(),
    billing: v.string(),
    amountCents: v.number(),
    currency: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiUrl = process.env.VIKTOR_SPACES_API_URL;
    const projectName = process.env.VIKTOR_SPACES_PROJECT_NAME;
    const projectSecret = process.env.VIKTOR_SPACES_PROJECT_SECRET;
    const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL || "equippedbyxixvi@gmail.com";

    if (!apiUrl || !projectName || !projectSecret) {
      console.error("Viktor Spaces email env vars not configured for owner notification");
      return;
    }

    const tierName = TIER_DISPLAY_NAMES[args.tier] ?? args.tier;
    const amountStr = `$${(args.amountCents / 100).toFixed(2)}`;
    const isWorkspace = args.tier.startsWith("workspace_");

    const subject = `🔔 New ${tierName} Subscription! — ${args.customerName || "New Customer"}`;

    const htmlContent = `
<div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #ffffff; border-radius: 12px; overflow: hidden;">
  <div style="height: 4px; background: linear-gradient(90deg, #22c55e, #06b6d4, #a855f7);"></div>
  <div style="padding: 32px;">
    <h1 style="font-size: 24px; color: #22c55e; margin: 0 0 8px 0;">💰 New Subscription!</h1>
    <p style="color: #d1d5db; font-size: 16px; margin: 0 0 24px 0;">${tierName} — ${amountStr}/${args.billing}</p>

    <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h3 style="color: #22c55e; margin: 0 0 12px 0;">Customer Info</h3>
      <table style="color: #d1d5db; font-size: 14px; border-collapse: collapse;">
        <tr><td style="padding: 4px 16px 4px 0; color: #9ca3af;">Name:</td><td style="padding: 4px 0;"><strong style="color: #fff;">${args.customerName || "Not provided"}</strong></td></tr>
        <tr><td style="padding: 4px 16px 4px 0; color: #9ca3af;">Email:</td><td style="padding: 4px 0;"><a href="mailto:${args.customerEmail}" style="color: #a855f7;">${args.customerEmail || "Not provided"}</a></td></tr>
        <tr><td style="padding: 4px 16px 4px 0; color: #9ca3af;">Phone:</td><td style="padding: 4px 0;"><strong style="color: #fff;">${args.customerPhone || "Not provided"}</strong></td></tr>
        <tr><td style="padding: 4px 16px 4px 0; color: #9ca3af;">Company:</td><td style="padding: 4px 0;"><strong style="color: #fff;">${args.companyName || "Not provided"}</strong></td></tr>
        <tr><td style="padding: 4px 16px 4px 0; color: #9ca3af;">Plan:</td><td style="padding: 4px 0;"><strong style="color: #22c55e;">${tierName}</strong></td></tr>
        <tr><td style="padding: 4px 16px 4px 0; color: #9ca3af;">Billing:</td><td style="padding: 4px 0;">${args.billing} — ${amountStr}</td></tr>
      </table>
    </div>

    ${isWorkspace ? `
    <div style="background: rgba(217, 70, 239, 0.1); border: 1px solid rgba(217, 70, 239, 0.2); border-radius: 8px; padding: 16px;">
      <h3 style="color: #d946ef; margin: 0 0 8px 0;">⚡ Action Required</h3>
      <p style="color: #d1d5db; font-size: 14px; line-height: 1.6; margin: 0;">
        This is a <strong style="color: #fff;">Workspace subscription</strong>. You need to:<br>
        1. Reach out to the customer to get branding assets (logo, colors)<br>
        2. Set up their workspace rooms & invite their team<br>
        3. Schedule a walkthrough/onboarding call<br>
        4. The customer has already received your contact info in their welcome email.
      </p>
    </div>
    ` : `
    <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 8px; padding: 16px;">
      <h3 style="color: #06b6d4; margin: 0 0 8px 0;">📋 Business Plan Customer</h3>
      <p style="color: #d1d5db; font-size: 14px; line-height: 1.6; margin: 0;">
        This customer subscribed to the <strong style="color: #fff;">Business plan</strong> which includes Workspace access.
        They may reach out for workspace setup. Their welcome email includes your contact info.
      </p>
    </div>
    `}

    <p style="color: #6b7280; font-size: 12px; margin-top: 24px; text-align: center;">
      E-Quipped: Work — Automated notification
    </p>
  </div>
</div>
    `;

    const textContent = `
NEW SUBSCRIPTION: ${tierName}

Customer: ${args.customerName || "Not provided"}
Email: ${args.customerEmail || "Not provided"}
Phone: ${args.customerPhone || "Not provided"}
Company: ${args.companyName || "Not provided"}
Plan: ${tierName} (${args.billing}, ${amountStr})

${isWorkspace ? "ACTION REQUIRED: Set up their workspace, get branding, schedule walkthrough." : "Business plan customer — may need workspace setup."}
    `;

    try {
      const response = await fetch(`${apiUrl}/api/viktor-spaces/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: projectName,
          project_secret: projectSecret,
          to_email: ownerEmail,
          subject,
          html_content: htmlContent,
          text_content: textContent,
          email_type: "transactional",
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Failed to send owner notification:", err);
      }
    } catch (err) {
      console.error("Error sending owner notification:", err);
    }
  },
});

/* ═══════════════════════════════════════════════════════════════
   INTERNAL HELPERS
   ═══════════════════════════════════════════════════════════════ */

export const getUserInfo = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return null;
    const sub = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    return {
      name: (user as any).name ?? "User",
      email: (user as any).email ?? "",
      stripeCustomerId: (sub as any)?.stripeCustomerId as string | null ?? null,
    };
  },
});

export const saveStripeCustomerId = internalMutation({
  args: {
    userId: v.id("users"),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, { userId, stripeCustomerId }) => {
    const sub = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (sub) {
      await ctx.db.patch(sub._id, { stripeCustomerId, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("userSubscriptions", {
        userId,
        tier: "free",
        stripeCustomerId,
        updatedAt: Date.now(),
      });
    }
  },
});

export const upgradeTier = internalMutation({
  args: {
    stripeCustomerId: v.string(),
    tier: v.union(v.literal("pro"), v.literal("business")),
    stripeSubscriptionId: v.optional(v.string()),
  },
  handler: async (ctx, { stripeCustomerId, tier, stripeSubscriptionId }) => {
    const subs = await ctx.db.query("userSubscriptions").collect();
    const sub = subs.find((s: any) => s.stripeCustomerId === stripeCustomerId);
    if (sub) {
      const patch: Record<string, unknown> = { tier, updatedAt: Date.now() };
      if (stripeSubscriptionId) patch.stripeSubscriptionId = stripeSubscriptionId;
      await ctx.db.patch(sub._id, patch);
    }
  },
});

export const downgradeTier = internalMutation({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, { stripeCustomerId }) => {
    const subs = await ctx.db.query("userSubscriptions").collect();
    const sub = subs.find((s: any) => s.stripeCustomerId === stripeCustomerId);
    if (sub) {
      await ctx.db.patch(sub._id, { tier: "free", updatedAt: Date.now() });
    }
  },
});
