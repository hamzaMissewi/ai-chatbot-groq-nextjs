import { mutation } from "./_generated/server";

// export const uploadStorage = mutation({
export const generateStorageUrl = mutation(async (ctx) => {
  // handler: async (ctx, args) => {
  return await ctx.storage.generateUploadUrl();
});
