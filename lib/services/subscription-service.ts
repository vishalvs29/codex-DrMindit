import Stripe from "stripe";
import { ApiError } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";

const stripeApiVersion = "2026-04-22.dahlia";
let stripeClient: Stripe | null = null;

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new ApiError("STRIPE_SECRET_KEY is not configured.", 503, "BILLING_NOT_CONFIGURED");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: stripeApiVersion });
  }

  return stripeClient;
}

export async function getActiveSubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: { userId, status: "active" }
  });
}

export async function isPremiumUser(userId: string) {
  const [user, activeSubscription] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    getActiveSubscription(userId)
  ]);

  return Boolean(
    activeSubscription || user?.plan === "PREMIUM" || user?.plan === "ORGANIZATION"
  );
}

export async function getOrCreateStripeCustomer(user: { id: string; clerkId: string; email: string; name?: string | null }) {
  const stripe = getStripeClient();
  const existing = await prisma.subscription.findFirst({
    where: { userId: user.id, stripeCustomerId: { not: "" } }
  });

  if (existing?.stripeCustomerId) {
    return existing.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name ?? undefined,
    metadata: {
      clerkId: user.clerkId,
      userId: user.id
    }
  });

  return customer.id;
}

type PlanSelection = "premium" | "organization";

const planPrices: Record<PlanSelection, string | undefined> = {
  premium: process.env.STRIPE_PREMIUM_PRICE_ID,
  organization: process.env.STRIPE_ORGANIZATION_PRICE_ID
};

function resolvePlanPrice(plan: PlanSelection) {
  const price = planPrices[plan];
  if (!price) {
    throw new ApiError(`Stripe price ID for ${plan} is not configured.`, 503, "BILLING_NOT_CONFIGURED");
  }
  return price;
}

export function validateStripePriceIds() {
  const premium = process.env.STRIPE_PREMIUM_PRICE_ID;
  const org = process.env.STRIPE_ORGANIZATION_PRICE_ID;

  const looksLikePriceId = (v?: string) => typeof v === "string" && /^price_/.test(v);

  if (!looksLikePriceId(premium)) {
    throw new ApiError("STRIPE_PREMIUM_PRICE_ID is not configured or invalid.", 503, "BILLING_NOT_CONFIGURED");
  }

  if (!looksLikePriceId(org)) {
    // allow organization price to be optional in some deployments, but warn by throwing the same error
    throw new ApiError("STRIPE_ORGANIZATION_PRICE_ID is not configured or invalid.", 503, "BILLING_NOT_CONFIGURED");
  }

  return true;
}

export function formatAmountCents(amountCents: number, currency = "INR") {
  try {
    const amount = amountCents / 100;
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amountCents}`;
  }
}

export async function createStripeCheckoutSession(
  user: { id: string; clerkId: string; email: string; name?: string | null },
  plan: PlanSelection = "premium"
) {
  validateStripePriceIds();
  const stripe = getStripeClient();
  const customerId = await getOrCreateStripeCustomer(user);
  const priceId = resolvePlanPrice(plan);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    success_url: process.env.STRIPE_SUCCESS_URL ?? "https://localhost:3000/?checkout=success",
    cancel_url: process.env.STRIPE_CANCEL_URL ?? "https://localhost:3000/?checkout=cancel",
    subscription_data: {
      metadata: {
        userId: user.id,
        clerkId: user.clerkId,
        plan: plan
      }
    },
    metadata: {
      userId: user.id,
      clerkId: user.clerkId,
      plan: plan
    }
  });

  return session;
}

export async function createStripeCustomerPortalSession(user: { id: string; clerkId: string; email: string; name?: string | null }) {
  const stripe = getStripeClient();
  const customerId = await getOrCreateStripeCustomer(user);

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: process.env.STRIPE_PORTAL_RETURN_URL ?? "https://localhost:3000/profile"
  });

  return portalSession;
}

function normalizeMetadata(metadata: Stripe.MetadataParam | Record<string, unknown> | null | undefined) {
  if (!metadata) {
    return undefined;
  }

  if (Array.isArray(metadata)) {
    return Object.fromEntries(metadata);
  }

  return JSON.parse(JSON.stringify(metadata));
}

async function recordBillingHistory(params: {
  userId: string;
  subscriptionId?: string;
  invoiceId?: string;
  paymentIntentId?: string;
  amountCents: number;
  currency: string;
  status: string;
  eventType: string;
  description?: string;
  metadata?: Stripe.MetadataParam | null;
}) {
  return prisma.billingHistory.create({
    data: {
      userId: params.userId,
      subscriptionId: params.subscriptionId,
      stripeInvoiceId: params.invoiceId,
      stripePaymentIntent: params.paymentIntentId,
      amountCents: params.amountCents,
      currency: params.currency,
      status: params.status,
      eventType: params.eventType,
      description: params.description,
      metadata: normalizeMetadata(params.metadata)
    }
  });
}

export async function trackUsage({
  userId,
  subscriptionId,
  feature,
  quantity = 1,
  periodStart,
  periodEnd,
  metadata
}: {
  userId: string;
  subscriptionId?: string;
  feature: string;
  quantity?: number;
  periodStart: Date;
  periodEnd: Date;
  metadata?: Stripe.MetadataParam | Record<string, unknown> | null;
}) {
  return prisma.usageTracking.create({
    data: {
      userId,
      subscriptionId,
      feature,
      quantity,
      periodStart,
      periodEnd,
      metadata: normalizeMetadata(metadata)
    }
  });
}

async function resolveUserFromMetadata(metadata: Stripe.MetadataParam | null | undefined, customerId: string) {
  if (metadata?.userId && typeof metadata.userId === "string") {
    return prisma.user.findUnique({ where: { id: metadata.userId } });
  }

  if (metadata?.clerkId && typeof metadata.clerkId === "string") {
    return prisma.user.findUnique({ where: { clerkId: metadata.clerkId } });
  }

  return prisma.subscription.findFirst({ where: { stripeCustomerId: customerId } }).then((subscription) =>
    subscription ? prisma.user.findUnique({ where: { id: subscription.userId } }) : null
  );
}

export async function upsertSubscriptionFromStripe(
  subscription: Stripe.Subscription | Stripe.Response<Stripe.Subscription>,
  metadata: Stripe.MetadataParam | null | undefined
) {
  const subscriptionRecord = subscription as Stripe.Subscription;
  const customerId = typeof subscriptionRecord.customer === "string" ? subscriptionRecord.customer : subscriptionRecord.customer?.id;
  if (!customerId) {
    throw new ApiError("Stripe subscription does not contain a customer.", 400, "BILLING_INVALID_EVENT");
  }

  const user = await resolveUserFromMetadata(metadata, customerId);

  if (!user) {
    throw new ApiError("Could not associate Stripe subscription with a user.", 404, "BILLING_USER_NOT_FOUND");
  }

  const priceId = subscriptionRecord.items.data[0]?.price?.id ?? null;
  const planFromMetadata = (metadata?.plan as string) || undefined;
  const tier = planFromMetadata === "organization" ? "ORGANIZATION" : "PREMIUM";
  const currentPeriodRaw = (subscriptionRecord as unknown as Record<string, unknown>)["current_period_end"];
  const currentPeriodStartRaw = (subscriptionRecord as unknown as Record<string, unknown>)["current_period_start"];
  const currentPeriodEnd = typeof currentPeriodRaw === "number" ? new Date(currentPeriodRaw * 1000) : null;
  const currentPeriodStart = typeof currentPeriodStartRaw === "number" ? new Date(currentPeriodStartRaw * 1000) : null;

  const subscriptionRecordDb = await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscriptionRecord.id },
    create: {
      userId: user.id,
      clerkId: user.clerkId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionRecord.id,
      status: subscriptionRecord.status,
      tier,
      priceId,
      currentPeriodStart,
      currentPeriodEnd
    },
    update: {
      status: subscriptionRecord.status,
      stripeCustomerId: customerId,
      priceId,
      tier,
      currentPeriodStart,
      currentPeriodEnd,
      clerkId: user.clerkId
    }
  });

  const invoiceId = typeof subscriptionRecord.latest_invoice === "string"
    ? subscriptionRecord.latest_invoice
    : typeof subscriptionRecord.latest_invoice === "object" && subscriptionRecord.latest_invoice?.id
      ? subscriptionRecord.latest_invoice.id
      : undefined;

  await recordBillingHistory({
    userId: user.id,
    subscriptionId: subscriptionRecordDb.id,
    invoiceId,
    paymentIntentId: undefined,
    amountCents: 0,
    currency: subscriptionRecord.currency ?? "inr",
    status: subscriptionRecord.status,
    eventType: "subscription.updated",
    description: `Stripe subscription ${subscriptionRecord.status}`,
    metadata
  });

  return subscriptionRecordDb;
}

export async function handleStripeWebhook(payload: string, signature: string) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new ApiError("STRIPE_WEBHOOK_SECRET is not configured.", 503, "BILLING_NOT_CONFIGURED");
  }

  const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (!session.subscription || !session.customer) {
        throw new ApiError("Invalid checkout session webhook payload.", 400, "BILLING_INVALID_EVENT");
      }
      const subscription = await stripe.subscriptions.retrieve(session.subscription.toString(), {
        expand: ["items.data.price"]
      });
      await upsertSubscriptionFromStripe(subscription, session.metadata);
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await upsertSubscriptionFromStripe(subscription, subscription.metadata);
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const invoiceSubscription = (invoice as unknown as Record<string, unknown>)["subscription"];
      if (typeof invoiceSubscription === "string") {
        const subscription = await stripe.subscriptions.retrieve(invoiceSubscription, {
          expand: ["items.data.price"]
        });
        await upsertSubscriptionFromStripe(subscription, subscription.metadata);
      }

      const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
      if (customerId) {
        const subscription = await prisma.subscription.findFirst({ where: { stripeCustomerId: customerId } });
        if (subscription) {
          const invoicePaymentIntent = (invoice as unknown as Record<string, unknown>)["payment_intent"];

          await recordBillingHistory({
            userId: subscription.userId,
            subscriptionId: subscription.id,
            invoiceId: invoice.id,
            paymentIntentId: typeof invoicePaymentIntent === "string" ? invoicePaymentIntent : undefined,
            amountCents: typeof invoice.amount_paid === "number" ? invoice.amount_paid : 0,
            currency: invoice.currency ?? "inr",
            status: invoice.status ?? "unknown",
            eventType: "invoice.payment_succeeded",
            description: "Stripe invoice payment succeeded",
            metadata: invoice.metadata
          });
        }
      }
      break;
    }
    default:
      break;
  }

  return event.type;
}
