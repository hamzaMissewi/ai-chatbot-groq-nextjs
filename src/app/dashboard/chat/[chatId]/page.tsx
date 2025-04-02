import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import { getConvexClient } from "@/lib/convex";
import { auth } from "@clerk/nextjs/server";

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
      <div className="flex max-w-4xl flex-1">
        <ChatInterface
          chatId={chatId}
          chatTitle={chat.title}
          initialMessages={initialMessages}
        />
        {/* <div className="mt-8 text-sm text-gray-500">Powered by Hamza Missaoui</div> */}
      </div>
    );
  } catch (error) {
    console.error("🔥Error loading chat:", error);
    redirect("/dashboard");
  }
}

export default ChatPage;
