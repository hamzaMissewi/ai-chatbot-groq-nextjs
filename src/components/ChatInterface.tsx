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
import { FreeLLModelsEnum, MessageInputType } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingDots } from "@/components/Loading";
import { useGetGroqModels } from "@/components/hooks/useGetGroqModels";
import { cn } from "@/lib/cn";
// import { getEnumKeyByValue } from "@/lib/lib";
// import { Loader2 } from "lucide-react";
import { ChatInput } from "./other/ChatWindow";
import { TbBrandOpenai } from "react-icons/tb";
// import { modelEnum } from "@/convex/schema";

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

export const formatMessage = (content: string): string => {
  // First unescape backslashes
  content = content.replace(/\\\\/g, "\\");

  // Then handle newlines
  content = content.replace(/\\n/g, "\n");

  // Remove only the markers but keep the content between them
  content = content
    // replace(/<think>|<\/think>/g, "")
    .replace(/---START---\n?/g, "")
    .replace(/\n?---END---/g, "");

  // Trim any extra whitespace that might be left
  return content.trim();
};

interface ChatInterfaceProps {
  chatId: Id<"chats">;
  initialMessages: MessageInputType[];
  chatTitle?: string;
}

function ChatInterface({
  chatId,
  initialMessages = [
    {
      role: "assistant",
      content:
        "Hello! I'm ready to assist you. What would you like to explore today ?",
    },
  ],
  chatTitle,
}: ChatInterfaceProps) {
  // const [messages, setMessages] = useState([
  //   {
  //     role: "model",
  //     parts: [{ text: "Hello! I'm ready to assist you. What would you like to explore today?" }]
  //   }
  // ]);

  const { groqModels } = useGetGroqModels();
  const convex = getConvexClient();
  const [messages, setMessages] = useState<MessageInputType[]>(initialMessages);
  const [modelValue, setModelValue] = useState<string | undefined>(undefined);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current !== null)
      messagesEndRef.current!.scrollIntoView({ behavior: "smooth" });
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
      { role: "user", content: message },
      // { role: "assistant", content: "" }
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages],
          msg: message,
          chatId: chatId,
          modelName: modelValue,
          // modelName: getEnumKeyByValue(FreeLLModelsEnum, modelValue),
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          const aiResponse = fullResponse.replace(/<think>|<\/think>/g, "");

          if (done) {
            const storeResponseId = await convex.mutation(api.messages.store, {
              chatId,
              content: aiResponse,
              role: "assistant",
              model: modelValue || FreeLLModelsEnum.deepseek_llama,
              // getEnumKeyByValue(FreeLLModelsEnum, modelValue) || deepseek_llama
            });

            if (storeResponseId) {
              setMessages((messages) => [
                ...messages,
                { role: "assistant", content: aiResponse },
              ]);
            }

            break;
          }

          const text = decoder.decode(value || new Uint8Array([]), {
            stream: true,
          });
          fullResponse += text;

          setMessages((messages) => {
            // if (value.length === 1) {
            if (value.length < 1) {
              return [...messages, { role: "assistant", content: aiResponse }];
            }
            const lastMessage = messages[messages.length - 1];
            lastMessage.content = aiResponse;

            const otherMessages = messages.slice(0, messages.length - 1);
            return [...otherMessages, lastMessage];
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        `Something wrong went when AI tried to answer your question !`,
      );
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content: "Apologies, an unexpected error occurred. Please try again.",
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // if (e.key === "Enter" && !e.shiftKey) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bottom-0 flex w-full flex-grow items-center justify-center overflow-auto">
      <div className="w-full max-w-7xl rounded-2xl border border-[#3A3A3C] shadow-2xl">
        <div className="mx-4 mt-20 flex flex-nowrap items-center justify-around space-x-4 rounded-lg bg-[#3A3A3C] p-3 md:p-5 lg:justify-between">
          <div className="flex flex-1 items-center gap-3 md:gap-4">
            <div className="rounded-full p-2">
              {/* <Zap className="h-6 w-6 text-[#5E5CE6]" /> */}
              <TbBrandOpenai className={"size-6"} />
            </div>
            <h1 className="truncate text-xl font-bold uppercase text-white ring-offset-accent-foreground hover:animate-pulse hover:text-[#00ff99] focus:ring-1 focus:ring-ring md:text-2xl">
              {/*{chatTitle || messages?.[0]?.content?.length > 0 ? messages[0].content?.split(/\n/g)[0] : "New Chat"}*/}
              {chatTitle ||
              // (messages.length > 0 && messages?.[0]?.content !== undefined)
              (messages.length > 0 && messages[0]?.content !== undefined)
                ? messages[0]?.content //?.split(/\n/g)[0]
                : "New conversation"}
            </h1>
          </div>

          {/*SELECT*/}
          <div className={"flex flex-wrap items-center justify-end gap-2"}>
            {modelValue && (
              <p className={"flex-1 truncate text-base text-white"}>
                Selected Model
              </p>
            )}
            <Select
              defaultValue={FreeLLModelsEnum.deepseek_llama}
              value={modelValue}
              onValueChange={(e) => {
                // if (Object.values(FreeLLModelsEnum).includes(e as unknown as FreeLLModelsEnum)) {
                setModelValue(e);
              }}
            >
              <SelectTrigger className="w-fit space-x-2 font-semibold text-[#00ff99] hover:bg-[#00ff99] hover:text-black">
                <SelectValue placeholder="Select IA LLM" />
              </SelectTrigger>
              <SelectContent className={"flex flex-col gap-4"}>
                <ScrollArea className={"h-[250px]"}>
                  {/*<SelectItem value={FreeLLModelsEnum.openai_v3}>Open Ai V3</SelectItem>*/}
                  {/*<SelectItem value={FreeLLModelsEnum.gemini_v2}>Gemini V2</SelectItem>*/}
                  {/*<SelectItem value={FreeLLModelsEnum.llama_v3}>Llama 3</SelectItem>*/}
                  {/*<SelectItem value={FreeLLModelsEnum.deepseek_llama}>Deepseek + Llama</SelectItem>*/}
                  {/*<SelectItem value={FreeLLModelsEnum.deepseek_alibaba}>Deepseek Alibaba</SelectItem>*/}
                  {/*<SelectItem value={FreeLLModelsEnum.hugging_face}>Hugging Face</SelectItem>*/}

                  {groqModels.map((model) => (
                    // hover:border-t-pink-500
                    <SelectItem
                      // onChange={(e)=>{
                      // console.log('item e.target',e.target)
                      // if (Object.values(FreeLLModelsEnum).includes(e.target)) {
                      //   setLlmModel(e as FreeLLModelsEnum);
                      // }
                      className={
                        "cursor-pointer shadow-md ring-1 ring-inset hover:shadow-[#00ff99]"
                      }
                      key={model.id}
                      value={model.id}
                    >
                      {model.id.replace(/\\/g, " ")}
                    </SelectItem>
                  ))}
                  <ScrollBar className={"pl-4"} orientation={"vertical"} />
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="top-20 flex h-[80vh] flex-1 flex-col items-center justify-center p-4 md:p-6">
          <ScrollArea className="space-y-4 pb-10">
            {/*<div className="space-y-4">*/}
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`my-4 flex gap-3 ${
                    message.role === "user"
                      ? "flex-row-reverse items-center"
                      : "flex-col"
                  }`}
                >
                  <div className={"flex items-center space-x-2"}>
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-white",
                        message.role === "user"
                          ? "hover:bg-blue-200"
                          : "hover:bg-amber-100",
                      )}
                    >
                      {message.role === "user" ? (
                        <User className="h-5 w-5 text-[#5E5CE6]" />
                      ) : (
                        <Bot className="h-5 w-5 text-[#5E5CE6]" />
                      )}
                    </div>
                    {message.model && message.role === "assistant" && (
                      <p className={"flex-1 truncate text-base text-white"}>
                        Model{" "}
                        <span
                          className={"uppercase tracking-wide text-[#00ff99]"}
                        >
                          "{message.model.replace(/[_-]/g, " ")}"
                        </span>
                      </p>
                    )}
                  </div>
                  {/* <div
                    //  md:max-w-[85%] w-[90%]
                    className={`flex w-full flex-grow items-start gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message?.content !== "" && (
                      // <ScrollArea className={"prose prose-invert max-w-none"}>
                      <ReactMarkdown className={"w-full text-justify"}>
                        {formatMessage(message.content)}
                      </ReactMarkdown>
                      //   <ScrollBar
                      //     orientation={"horizontal"}
                      //     className={"w-full"}
                      //   />
                      // </ScrollArea>
                    )}
                  </div> */}
                  <div
                    className={`rounded-2xl px-4 py-0 shadow-lg ${
                      message.role === "user"
                        ? "flex justify-end bg-[#5E5CE6] text-white"
                        : "flex justify-start overflow-auto bg-[#3A3A3C] text-white"
                    }`}
                  >
                    {/* <div className="prose prose-invert max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatMessage(message.content),
                        }}
                      />
                    </div> */}

                    <div
                      //  md:max-w-[85%] w-[90%]
                      className={`flex w-full flex-grow items-start gap-3 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message?.content !== "" && (
                        // <ScrollArea className={"prose prose-invert max-w-none"}>
                        <ReactMarkdown className={"w-full text-justify"}>
                          {formatMessage(message.content)}
                        </ReactMarkdown>
                        //   <ScrollBar
                        //     orientation={"horizontal"}
                        //     className={"w-full"}
                        //   />
                        // </ScrollArea>
                      )}
                      {/* <ScrollBar
                        orientation={"horizontal"}
                        className={"w-[60%]"}
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {isLoading && <LoadingDots />}
            <ScrollBar orientation={"vertical"} />
          </ScrollArea>

          <div className="mt-auto flex w-full flex-wrap items-center justify-center gap-3">
            {/* TODO */}
            <ChatInput
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              onKeyPress={handleKeyPress}
              actions={
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setMessage("")}
                >
                  Cancel
                </Button>
              }
            />

            {/* <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              // className="h-[40px] text-white bg-[#3A3A3C] border-gray-100 focus:border-blue-200 resize-none rounded-xl"
              className="h-[20px] max-w-[70%] flex-1 resize-none rounded-xl border-gray-100 bg-[#3A3A3C] text-white focus:border-blue-200"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="h-[50px] w-[50px] transform rounded-xl bg-[#5E5CE6] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#4B3FD6]"
              onClick={sendMessage}
              disabled={!message.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className={"animate-spin"} />
              ) : (
                <Send className="h-7 w-7 text-white" />
              )}
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;

// function EditMessage({
//   message,
//   onEdit,
//   onCancel,
// }: {
//   message: Message;
//   onEdit: (message: Message) => void;
//   onCancel: () => void;
// }) {
//   const [editValue, setEditValue] = useState(message.content as string);

//   return (
//     <ChatInput
//       value={editValue}
//       onChange={(e) => setEditValue(e.target.value)}
//       onSubmit={(e) => {
//         e.preventDefault();
//         onEdit({ type: "human", content: editValue });
//       }}
//       actions={
//         <Button variant="outline" type="button" onClick={onCancel}>
//           Cancel
//         </Button>
//       }
//     />
//   );
// }
