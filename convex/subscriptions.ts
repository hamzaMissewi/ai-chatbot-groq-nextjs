import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";

export const createSubscription = mutation({
  args: {
    userId: v.string(),
    stripeSubscriptionId: v.string(),
    stripeCustomerId: v.string(),
    stripePriceId: v.optional(v.string()),
    stripeCurrentPeriodEnd: v.optional(v.number()),
    stripeCancelAtPeriodEnd: v.optional(v.boolean()),
    status: v.optional(v.string()),
    plan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const createSub = await ctx.db.insert("subscriptions", {
      ...args,
      // userId: args.userId,
      createdAt: Date.now(),
    });

    return createSub;
  },
});

export const updateSubscription = mutation({
  args: {
    // subId: v.id("subscription"),
    userId: v.string(),
    stripeCurrentPeriodEnd: v.optional(v.number()),
    stripeCancelAtPeriodEnd: v.optional(v.boolean()),
    stripePriceId: v.optional(v.string()),
    status: v.optional(v.string()),
    plan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const subscription = await ctx.db
      .query("subscriptions")
      // .withIndex("by_id", (q) => q.eq(q.field("id"), args.subId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    if (!subscription) {
      console.error("Subscription not found");
      return null;
    }

    await ctx.db.patch(subscription._id, {
      stripeCurrentPeriodEnd: args.stripeCurrentPeriodEnd,
      stripeCancelAtPeriodEnd: args.stripeCancelAtPeriodEnd,
      stripePriceId: args.stripePriceId,
      status: args.status,
      plan: args.plan,
      // updatedAt: Date.now()
    });

    return subscription._id;
  },
});

export const deleteSubscription = mutation({
  args: { subscriptionId: v.id("subscriptions"), userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .filter((q) =>
        q.add(
          q.eq(q.field("_id"), args.subscriptionId),
          q.eq(q.field("userId"), args.userId),
        ),
      )
      .unique();

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    await ctx.db.delete(args.subscriptionId);
  },
});

export const getUserSubscription = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("Unauthorized");
    // }
    const subscription = await ctx.db
      .query("subscriptions")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    return subscription;
  },
});
