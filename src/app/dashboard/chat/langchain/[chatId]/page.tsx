import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getConvexClient } from "@/lib/convex";
import { auth } from "@clerk/nextjs/server";
import LangchainChatInterface from "@/components/other/LangchainChatInterface";

interface ChatPageProps {
  params: Promise<{
    chatId: Id<"chats">;
  }>;
}

async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;

  // Get user authentication
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const convex = getConvexClient();

  try {
    // Check if chat exists & user is authorized to view it
    const chat = await convex.query(api.chats.getChat, {
      id: chatId,
      userId,
    });

    if (!chat) {
      console.log(
        "⚠️ Chat not found or unauthorized, redirecting to dashboard",
      );
      redirect("/dashboard");
    }
    const initialMessages = await convex.query(api.messages.list, { chatId });

    return (
      <div className="flex min-h-screen flex-col items-center justify-center overflow-auto p-4">
        <h1 className="mb-8 text-3xl font-bold text-white">
          LangChain AI assistant (TEST)
        </h1>

        <LangchainChatInterface
          chatId={chatId}
          chatTitle={chat.title}
          initialMessages={initialMessages}
        />

        <div className="mt-8 text-sm text-gray-500">Powered by Hamza AI</div>
      </div>
    );
  } catch (error) {
    console.error("🔥 Error loading chat:", error);
    redirect("/dashboard");
  }
}

export default ChatPage;
