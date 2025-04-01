"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { TrashIcon, ChatBubbleIcon } from "@radix-ui/react-icons";
import TimeAgo from "react-timeago";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/cn";
import { useNavigation } from "@/lib/navigation";
import { useRouter } from "next/navigation";
import CreateChatDialog from "@/components/CreateChatModal";
import type React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

function ChatRow({
  chat,
  onDelete,
}: {
  chat: Doc<"chats">;
  onDelete: (id: Id<"chats">) => void;
}) {
  const router = useRouter();
  const { closeMobileNav } = useNavigation();

  const lastMessage = useQuery(api.messages.getLastMessage, {
    chatId: chat._id,
  });

  const handleClick = () => {
    router.push(`/dashboard/chat/${chat._id}`);
    closeMobileNav();
  };

  const handleSecondOpenChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/dashboard/chat/langchain/${chat._id}`);
    closeMobileNav();
  };

  return (
    <div
      className="group cursor-pointer rounded-xl border border-gray-200/30 bg-white/50 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white/80 hover:shadow-md"
      onClick={handleClick}
      // onContextMenu={handleSecondOpenChat}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <p className="flex-1 truncate text-sm font-medium text-gray-600">
            {lastMessage ? (
              <>
                {lastMessage.role === "user" ? "You: " : "AI: "}
                {lastMessage.content.replace(/\\n/g, "\n")}
              </>
            ) : (
              <span className="text-gray-600">New conversation</span>
            )}
          </p>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="-mr-2 -mt-2 ml-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(chat._id);
                  }}
                >
                  <TrashIcon className="h-4 w-4 text-gray-400 transition-colors hover:text-red-500" />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <p>Delete chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="-mr-2 -mt-2 ml-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  onClick={(e) => handleSecondOpenChat(e)}
                >
                  <ChatBubbleIcon className="h-4 w-4 text-gray-400 transition-colors hover:text-gray-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open chat second interface (test)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {lastMessage && (
          <p className="mt-1.5 text-xs font-medium text-gray-400">
            <TimeAgo date={lastMessage.createdAt} />
          </p>
        )}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const { isMobileNavOpen, closeMobileNav } = useNavigation();
  const chats = useQuery(api.chats.listChats);
  const deleteChat = useMutation(api.chats.deleteChat);

  const handleDeleteChat = async (id: Id<"chats">) => {
    await deleteChat({ id });
    // If we're currently viewing this chat, redirect to dashboard
    if (window.location.pathname.includes(id)) {
      router.push("/dashboard");
    }
  };

  return (
    <>
      {/* Background Overlay for mobile */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={closeMobileNav}
        />
      )}

      <div
        className={cn(
          "fixed bottom-0 left-0 top-14 z-50 flex w-72 transform flex-col border-r border-gray-200/50 bg-gray-50/80 backdrop-blur-xl transition-transform duration-300 ease-in-out md:relative md:inset-y-0 md:top-0 md:translate-x-0",
          isMobileNavOpen ? "translate-x-0" : "hidden",
          // isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-gray-200/50 p-4">
          {/*<Button*/}
          {/*  onClick={handleNewChat}*/}
          {/*  className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/50 shadow-sm hover:shadow transition-all duration-200"*/}
          {/*>*/}
          {/*  <PlusIcon className="mr-2 h-4 w-4" /> New Chat*/}
          {/*</Button>*/}

          <CreateChatDialog />
        </div>

        <div className="scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent flex-1 space-y-2.5 overflow-y-auto p-4">
          {chats?.map((chat) => (
            <ChatRow key={chat._id} chat={chat} onDelete={handleDeleteChat} />
          ))}
        </div>
      </div>
    </>
  );
}
