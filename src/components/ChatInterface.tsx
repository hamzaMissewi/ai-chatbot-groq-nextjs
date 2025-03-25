"use client";
import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Bot, Send, User, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

// const formatToolOutput = (output: unknown): string => {
//   if (typeof output === "string") return output;
//   return JSON.stringify(output, null, 2);
// };

// const formatTerminalOutput = (
//   tool: string,
//   input: unknown,
//   output: unknown
// ) => {
//   const terminalHtml = `<div class="bg-[#1e1e1e] text-white font-mono p-2 rounded-md my-2 overflow-x-auto whitespace-normal max-w-[600px]">
//       <div class="flex items-center gap-1.5 border-b border-gray-700 pb-1">
//         <span class="text-red-500">●</span>
//         <span class="text-yellow-500">●</span>
//         <span class="text-green-500">●</span>
//         <span class="text-gray-400 ml-1 text-sm">~/${tool}</span>
//       </div>
//       <div class="text-gray-400 mt-1">$ Input</div>
//       <pre class="text-yellow-400 mt-0.5 whitespace-pre-wrap overflow-x-auto">${formatToolOutput(input)}</pre>
//       <div class="text-gray-400 mt-2">$ Output</div>
//       <pre class="text-green-400 mt-0.5 whitespace-pre-wrap overflow-x-auto">${formatToolOutput(output)}</pre>
//     </div>`;
//
//   return `---START---\n${terminalHtml}\n---END---`;
// };

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
}

function ChatInterface({ chatId, initialMessages }: ChatInterfaceProps) {
  // const [messages, setMessages] = useState([
  //   {
  //     role: "model",
  //     parts: [{ text: "Hello! I'm ready to assist you. What would you like to explore today?" }]
  //   }
  // ]);

  const [messages, setMessages] = useState<{
    role: "user" | "assistant",
    content: string,
  }[]>(initialMessages);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message }
      // { role: "user", parts: [{ text: message }] },
      // { role: "model", parts: [{ text: "" }] }
      // { role: "model", content: "" }
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: [...messages],
          msg: message,
          chatId: chatId
        })
      });

      if (!response.ok) throw new Error("Network response was not ok");

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        const convex = getConvexClient();


        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("full response", fullResponse);

            await convex.mutation(api.messages.store, {
              chatId,
              content: fullResponse,
              role: "assistant"
            });
            break;
          }
          const text = decoder.decode(value || new Uint8Array([]), { stream: true });
          fullResponse += text;

          setMessages((messages) => {
            // const lastMessage = messages[messages.length - 1];
            const otherMessages = messages.slice(0, messages.length - 1);
            return [
              ...otherMessages,
              {
                // ...lastMessage,
                // parts: [{ text: fullResponse }]
                role: "assistant",
                content: fullResponse,
                chatId
              }
            ];
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something wrong happened when try to respond to your questions");
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",//"model",
          // parts: [{ text: "Apologies, an unexpected error occurred. Please try again." }]
          content: "Apologies, an unexpected error occurred. Please try again."
        }
      ]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  return (
    <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center p-4">
      <div className="max-w-4xl rounded-2xl shadow-2xl border border-[#3A3A3C] ">
        <div className="bg-[#3A3A3C] p-4 md:p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#4A4A4C] p-2 rounded-full">
              <Zap className="w-6 h-6 text-[#5E5CE6]" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Hamza</h1>
          </div>
        </div>

        <div className="p-4 md:p-6 flex flex-col h-[75vh]">
          <ScrollArea className="flex-grow mb-4 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={"w-full"}
                >
                  {/*max-w-[95%] md:max-w-[85%]*/}
                  {/*  <div*/}
                  <ScrollArea
                    className={`flex w-full relative items-start ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                    // className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${
                  >
                    <div
                      className={`flex gap-3 ${
                        message.role === "user" ? "flex-row-reverse max-w-[85%] md:max-w-[75%]" : "flex-row"
                      }`}
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-[#3A3A3C] mt-1">
                        {message.role === "user" ? (
                          <User className="h-5 w-5 text-[#5E5CE6]" />
                        ) : (
                          <Bot className="h-5 w-5 text-[#5E5CE6]" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl  px-4 py-3 shadow-lg ${
                          message.role === "user"
                            ? "bg-[#5E5CE6] text-white"
                            : "bg-[#3A3A3C] text-white"
                        }`}
                      >
                        <div className="prose prose-invert max-w-none">
                          {/*<ReactMarkdown>{message.parts[0].text}</ReactMarkdown>*/}
                          <ScrollArea className={"w-[80%]"}>
                            <ReactMarkdown>{formatMessage(message.content)}</ReactMarkdown>
                            <ScrollBar orientation={"horizontal"} className={"w-full"} />
                          </ScrollArea>
                          {/*<div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />*/}
                        </div>
                      </div>
                    </div>
                    <ScrollBar orientation={"horizontal"} />
                  </ScrollArea>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center">
                  <div className="animate-pulse rounded-full h-8 w-8 bg-[#5E5CE6]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <ScrollBar orientation={"vertical"} className={"h-full"} />
          </ScrollArea>

          <div className="flex gap-3 mt-auto">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="h-[40px] text-white bg-[#3A3A3C] border-gray-100 focus:border-blue-200 resize-none rounded-xl"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="h-[60px] w-[60px] bg-[#5E5CE6] hover:bg-[#4B3FD6] rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={sendMessage}
              disabled={!message.trim() || isLoading}
            >
              <Send className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;