import { FreeLLModelsEnum } from "./../src/lib/types";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createChat = mutation({
  args: {
    title: v.string(),
    initializeMessage: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const chatId = await ctx.db.insert("chats", {
      title: args.title,
      userId: identity.subject,
      createdAt: Date.now(),
    });

    // const chat = await ctx.db.get(args.chatId);
    // if (!chat) {
    //   throw new Error("Unauthorized");
    // }

    if (chatId && args.initializeMessage) {
      // Save the user message with preserved newlines
      const messageId = await ctx.db.insert("messages", {
        chatId: chatId,
        content: `Hello ${identity.address}, How can i help you today ?`,
        role: "assistant",
        // model: FreeLLModelsEnum.deepseek_llama,
        createdAt: Date.now(),
      });

      console.log("✅ Saved user message:", {
        messageId,
        //   chatId,
      });
    }

    return chatId;
  },
});

export const listChats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    return chats;
  },
});

export const deleteChat = mutation({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const chat = await ctx.db.get(args.id);
    if (!chat || chat.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    // Delete all messages in the chat
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.id))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the chat
    await ctx.db.delete(args.id);
  },
});

export const getChat = query({
  args: { id: v.id("chats"), userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const chat = await ctx.db.get(args.id);

      // Return null if chat doesn't exist or user is not authorized
      if (!chat || chat.userId !== args.userId) {
        console.log("❌ Chat not found or unauthorized", {
          chatExists: !!chat,
          chatUserId: chat?.userId,
          requestUserId: args.userId,
        });
        return null;
      }

      // console.log("✅ Chat found and authorized");
      return chat;
    } catch (error) {
      console.error("🔥 Error in getChat:", error);
      return null;
    }
  },
});
