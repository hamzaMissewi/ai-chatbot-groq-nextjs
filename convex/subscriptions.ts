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
  },
  handler: async (ctx, args) => {
    // const user = await ctx.auth.getUserIdentity();
    // if (!user) {
    //   throw new Error("Unauthorized Hamza");
    // }

    const createSub = await ctx.db.insert("subscriptions", {
      ...args,
      userId: args.userId,
      createdAt: Date.now(),
    });

    return createSub;
  },
});

export const updateSubscription = mutation({
  args: {
    userId: v.string(),
    stripeCurrentPeriodEnd: v.optional(v.number()),
    stripeCancelAtPeriodEnd: v.optional(v.boolean()),
    stripePriceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // const user = await ctx.auth.getUserIdentity();
    // if (!user) {
    //   throw new Error("Unauthorized");
    // }

    // TODO

    const subscription = await ctx.db
      .query("subscriptions")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    if (!subscription) {
      console.error("Subscription not found");
      return null
    }

    await ctx.db.patch(subscription._id, {
      //   ...args,
      stripeCurrentPeriodEnd: args.stripeCurrentPeriodEnd,
      stripeCancelAtPeriodEnd: args.stripeCancelAtPeriodEnd,
    });

    return subscription._id;
  },
});

export const deleteSubscription = mutation({
  args: { subscriptionId: v.id("subscriptions"), userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
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
    const subscription = await ctx.db
      .query("subscriptions")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    return subscription;
  },
});
