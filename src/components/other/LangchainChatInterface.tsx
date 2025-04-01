"use client";
import React, { useEffect, useRef, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { FreeLLModelsEnum, MessageInputType } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import { ChatInput } from "./ChatWindow";
import { cn } from "@/lib/cn";

const formatMessage = (content: string): string => {
  // First unescape backslashes
  content = content.replace(/\\\\/g, "\\");

  // Then handle newlines
  content = content.replace(/\\n/g, "\n");

  // Remove only the markers but keep the content between them
  content = content.replace(/---START---\n?/g, "").replace(/\n?---END---/g, "");

  // Trim any extra whitespace that might be left
  return content.trim();
};

interface ChatInterfaceProps {
  chatId: Id<"chats">;
  initialMessages: Doc<"messages">[];
  chatTitle?: string;
}

export default function LangchainChatInterface({
  chatId,
  initialMessages,
  chatTitle,
}: ChatInterfaceProps) {
  const convex = getConvexClient();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageInputType[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  // const [llmModel, setllmModel] = useState<FreeLLModelsEnum | undefined>(
  //   undefined,
  // );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current !== null)
      messagesEndRef.current!.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const sendMessage = async () => {
    // if (!input.trim()) return;
    if (!input.trim() || isLoading) return;

    setInput("");
    setIsLoading(true);
    const userMessage: MessageInputType = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("/api/chat/langchain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          chatId: chatId,
          modelName: FreeLLModelsEnum.deepseek_llama,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant" as const, content: data.content },
      ]);

      await convex.mutation(api.messages.store, {
        chatId,
        content: data.response,
        role: "assistant",
        model: "deepseek_llama",
        // llmModel
        //   ? getEnumKeyByValue(FreeLLModelsEnum, llmModel.toString())
        //   : undefined, //
      });

      // if (response.body) {
      //   const reader = response.body.getReader();
      //   const decoder = new TextDecoder();
      //   let fullResponse = "";
      //
      //
      //   while (true) {
      //     const { done, value } = await reader.read();
      //     if (done) {
      //       // console.log("full response", fullResponse);
      //       await convex.mutation(api.messages.store, {
      //         chatId,
      //         content: fullResponse,
      //         role: "assistant",
      //         model: llmModel ? getEnumKeyByValue(FreeLLModelsEnum, llmModel.toString()) : "deepseek_llama"
      //       });
      //       break;
      //     }
      //     const text = decoder.decode(value || new Uint8Array([]), { stream: true });
      //     fullResponse += text;
      //
      //     setMessages((messages) => {
      //       // const lastMessage = messages[messages.length - 1];
      //       const otherMessages = messages.slice(0, messages.length - 1);
      //       return [...otherMessages];
      //     });
      //   }
      // }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 h-96 overflow-y-auto rounded-lg border p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
            Start new conversation with Hamza AI
            {/*{chatTitle}*/}
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {/* <div className={"prose prose-invert max-w-none w-full"}> */}
                {/* <ReactMarkdown className={cn("w-full h-fit text-justify",message.role==="user" ? "text-white bg-blue-800":"text-black")}> */}
                <ReactMarkdown className={cn("h-fit w-full text-justify")}>
                  {formatMessage(message.content)}
                </ReactMarkdown>
                {/* <ScrollBar
                          orientation={"horizontal"}
                          className={"w-full"}
                        /> */}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="mb-4 text-left">
            <div className="inline-block rounded-lg bg-gray-200 p-3 text-gray-800">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* TODO */}
      <ChatInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
        onKeyPress={handleKeyPress}
        actions={
          <Button variant="outline" type="button" onClick={() => setInput("")}>
            Cancel
          </Button>
        }
      />

      {/* <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          // type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 rounded-lg border p-2"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form> */}
    </div>
  );
}
