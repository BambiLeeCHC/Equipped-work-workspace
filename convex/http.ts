import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();
auth.addHttpRoutes(http);

/* ── Stripe Webhook ── */
http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");
    const webhookSecret = ((globalThis as any).process?.env?.STRIPE_WEBHOOK_SECRET ?? "") as string;

    // If webhook secret is configured, verify signature
    if (webhookSecret && sig) {
      const isValid = await verifyStripeSignature(body, sig, webhookSecret);
      if (!isValid) {
        return new Response("Invalid signature", { status: 400 });
      }
    }

    let event;
    try {
      event = JSON.parse(body);
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    // Handle relevant events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const customerId = session.customer;
        const tier = session.metadata?.tier;
        const billing = session.metadata?.billing;
        const subscriptionId = session.subscription;
        const customerEmail = session.customer_details?.email ?? session.customer_email ?? "";
        const customerName = session.customer_details?.name ?? "";
        const customerPhone = session.customer_details?.phone ?? "";
        const amountTotal = session.amount_total ?? 0;
        const currency = session.currency ?? "usd";

        // Extract custom fields (company name, etc.)
        let companyName = "";
        if (session.custom_fields && Array.isArray(session.custom_fields)) {
          for (const field of session.custom_fields) {
            if (field.key === "company_name" && field.text?.value) {
              companyName = field.text.value;
            }
          }
        }

        // 1. Upgrade tier in database
        if (customerId && tier) {
          const mappedTier = tier.startsWith("workspace_") ? "business" : tier;
          if (mappedTier === "pro" || mappedTier === "business") {
            await ctx.runMutation(internal.stripe.upgradeTier, {
              stripeCustomerId: customerId,
              tier: mappedTier as "pro" | "business",
              stripeSubscriptionId: subscriptionId ?? undefined,
            });
          }
        }

        // 2. Send thank-you email to customer
        if (customerEmail) {
          await ctx.runAction(internal.stripe.sendThankYouEmail, {
            email: customerEmail,
            name: customerName,
            tier: tier ?? "pro",
            billing: billing ?? "monthly",
            amountCents: amountTotal,
          });
        }

        // 3. Notify Trey for Business plan or any Workspace subscription
        const isHighTier = tier === "business" || tier?.startsWith("workspace_");
        if (isHighTier) {
          await ctx.runAction(internal.stripe.notifyOwnerNewSubscription, {
            customerName,
            customerEmail,
            customerPhone,
            companyName,
            tier: tier ?? "unknown",
            billing: billing ?? "monthly",
            amountCents: amountTotal,
            currency,
          });
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        if (customerId) {
          await ctx.runMutation(internal.stripe.downgradeTier, {
            stripeCustomerId: customerId,
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        if (
          subscription.status === "canceled" ||
          subscription.status === "unpaid"
        ) {
          if (customerId) {
            await ctx.runMutation(internal.stripe.downgradeTier, {
              stripeCustomerId: customerId,
            });
          }
        }
        break;
      }
    }

    return new Response("OK", { status: 200 });
  }),
});

/* ── Simple Stripe signature verification ── */
async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string,
): Promise<boolean> {
  try {
    const parts = sigHeader.split(",");
    let timestamp = "";
    let signature = "";
    for (const part of parts) {
      const [key, value] = part.split("=");
      if (key === "t") timestamp = value;
      if (key === "v1") signature = value;
    }
    if (!timestamp || !signature) return false;

    const signedPayload = `${timestamp}.${payload}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
    const expected = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return expected === signature;
  } catch {
    return false;
  }
}

export default http;
