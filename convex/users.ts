import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveUsers = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const chat = await ctx.db.insert("chats", {
      title: args.title,
      userId: identity.subject,
      createdAt: Date.now(),
    });

    return chat;
  },
});

export const createUser = mutation({
  args: {
    userId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }

    const user = await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
      // updatedAt: Date.now(),
    });

    return user;
  },
});

export const updateUser = mutation({
  args: {
    // userId: v.id("users"),
    // imageUrl: v.union(v.optional(v.string()), v.null),
    clerkUserId: v.string(),
    imageUrl: v.optional(v.string()),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    console.log("identity ", identity);

    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }

    const existingUser = await ctx.db
      .query("users")
      //   .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("userId"), args.clerkUserId))
      .first();

    if (!existingUser) {
      // throw new Error("User not found");
      const user = await ctx.db.insert("users", {
        ...args,
        userId: args.clerkUserId,
        createdAt: Date.now(),
        // updatedAt: Date.now(),
      });
      return user;
    }

    if (!args.imageUrl || !args.name || !args.email) return;

    const user = await ctx.db.patch(existingUser._id, {
      ...args,
      updatedAt: Date.now(),
    });

    return user;
  },
});

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    return user;
  },
});
