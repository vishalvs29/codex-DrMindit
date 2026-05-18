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
  const activeSubscription = await getActiveSubscription(userId);
  return Boolean(activeSubscription);
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

export async function createStripeCheckoutSession(user: { id: string; clerkId: string; email: string; name?: string | null }) {
  if (!process.env.STRIPE_PRICE_ID) {
    throw new ApiError("STRIPE_PRICE_ID is not configured.", 503, "BILLING_NOT_CONFIGURED");
  }

  const stripe = getStripeClient();
  const customerId = await getOrCreateStripeCustomer(user);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1
      }
    ],
    success_url: process.env.STRIPE_SUCCESS_URL ?? "https://localhost:3000/?checkout=success",
    cancel_url: process.env.STRIPE_CANCEL_URL ?? "https://localhost:3000/?checkout=cancel",
    metadata: {
      userId: user.id,
      clerkId: user.clerkId
    }
  });

  return session;
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
  const currentPeriodRaw = (subscriptionRecord as unknown as Record<string, unknown>)["current_period_end"];
  const currentPeriodEnd = typeof currentPeriodRaw === "number" ? new Date(currentPeriodRaw * 1000) : null;

  return prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscriptionRecord.id },
    create: {
      userId: user.id,
      clerkId: user.clerkId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionRecord.id,
      status: subscriptionRecord.status,
      priceId,
      currentPeriodEnd
    },
    update: {
      status: subscriptionRecord.status,
      stripeCustomerId: customerId,
      priceId,
      currentPeriodEnd,
      clerkId: user.clerkId
    }
  });
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
      break;
    }
    default:
      break;
  }

  return event.type;
}
