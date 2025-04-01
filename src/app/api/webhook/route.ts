import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { getConvexClient } from "@/lib/convex";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
// import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Signature is missing", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );

    const convex = getConvexClient();

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;

        await handleSessionCompleted(session);
        break;

      case "customer.subscription.created":
        // const subscription = event.data.object as Stripe.Checkout.Session;

        const subscription = await stripe.subscriptions.retrieve(
          event.data.object.id,
        );

        console.log("subscription created metadata", subscription.metadata);

        // const { orderNumber, customerName, customerEmail, clerkUserId } =
        //   subscription.metadata;

        const createdSub = await convex.mutation(
          api.subscriptions.createSubscription,
          {
            userId: subscription.metadata.userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: Math.floor(
              subscription.current_period_end * 1000,
            ),
            stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        );

        console.log("created subscription id: ", createdSub);
        break;

      case "customer.subscription.updated":
        const updateSubscription = await stripe.subscriptions.retrieve(
          event.data.object.id,
        );
        const updatedSub = await convex.mutation(
          api.subscriptions.updateSubscription,
          {
            userId: updateSubscription.metadata.userId,
            stripePriceId: updateSubscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: Math.floor(
              updateSubscription.current_period_end * 1000,
            ),
            stripeCancelAtPeriodEnd: updateSubscription.cancel_at_period_end,
          },
        );
        console.log("updated subscription id: ", updatedSub);
        break;

      case "customer.subscription.deleted":
        const deleteSub = await stripe.subscriptions.retrieve(
          event.data.object.id,
        );
        await convex.mutation(api.subscriptions.deleteSubscription, {
          userId: deleteSub.metadata.userId,
          subscriptionId: deleteSub.id as Id<"subscriptions">,
        });
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed: " + (error as Error).message },
      { status: 400 },
    );
  }
}

// async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
//   //   await prisma.userSubscription.deleteMany({
//   const convex = await getConvexClient();

//   await convex.mutation(api.subscriptions.deleteSubscription, {
//     // userId: subscription.customer as string,
//     userId: subscription.metadata.userId,
//     subscriptionId: subscription.id as Id<"subscriptions">,
//   });
// }

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (!userId) {
    throw new Error("User ID is missing in session metadata");
  }

  await (
    await clerkClient()
  ).users.updateUserMetadata(userId, {
    privateMetadata: {
      stripeCustomerId: session.customer as string,
    },
  });
}
