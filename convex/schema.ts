import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// export const modelEnum = v.union(
//   v.literal("openai_v3"),
//   v.literal("deepseek_llama"),
//   v.literal("llama_v3"),
//   v.literal("gemini_v2"),
//   v.literal("deepseek_alibaba"),
//   v.literal("hugging_face"),
//   v.literal("mistral"),
// );

export default defineSchema({
  chats: defineTable({
    title: v.string(),
    userId: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
  messages: defineTable({
    chatId: v.id("chats"),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    model: v.optional(v.string()), //v.optional(modelEnum),
    createdAt: v.number(),
  }).index("by_chat", ["chatId"]),
  subscriptions: defineTable({
    userId: v.string(),
    stripeSubscriptionId: v.string(),
    stripeCustomerId: v.string(),
    stripePriceId: v.optional(v.string()),
    // stripeCurrentPeriodEnd: v.optional(v.string()),
    stripeCurrentPeriodEnd: v.optional(v.number()),
    stripeCancelAtPeriodEnd: v.optional(v.boolean()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
  users: defineTable({
    userId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_user_id", ["userId"]),
});
