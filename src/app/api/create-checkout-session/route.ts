import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { priceId, planName } = await req.json();

    const user = await currentUser();
    // const user = await auth();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const stripeCustomerId = user.privateMetadata.stripeCustomerId as
      | string
      | undefined;

    // Validate priceId
    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 },
      );
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BASE_URL;

    // const successUrl = `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${crypto.randomUUID()}`;
    const successUrl = `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}&plan_type=${planName}`;
    const cancelUrl = `${baseUrl}/subscription/failed`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // Uncommented the line_items section which is required for subscriptions
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      // success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
      // cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId: user.id },
      // NEW
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
      customer_email: stripeCustomerId
        ? undefined
        : user.emailAddresses[0].emailAddress,
      // TODO
      custom_text: {
        terms_of_service_acceptance: {
          message: `I have read AI Assitant App's [terms of service](${process.env.NEXT_PUBLIC_BASE_URL}/subscription/tos) and agree to them.`,
        },
      },
      consent_collection: {
        terms_of_service: "required",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 400 },
      );
    }

    // console.log("session.url", session.url);
    return NextResponse.json({
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 },
    );
  }
}
