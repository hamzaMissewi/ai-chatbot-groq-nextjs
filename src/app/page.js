'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Zap } from "lucide-react";
import ReactMarkdown from 'react-markdown';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [{ text: "Hello! I'm ready to assist you. What would you like to explore today?" }],
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
      { role: "user", parts: [{ text: message }] },
      { role: "model", parts: [{ text: "" }] },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: [...messages],
          msg: message,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value || new Uint8Array(), { stream: true });
          fullResponse += text;
          setMessages((messages) => {
            const lastMessage = messages[messages.length - 1];
            const otherMessages = messages.slice(0, messages.length - 1);
            return [
              ...otherMessages,
              {
                ...lastMessage,
                parts: [{ text: fullResponse }],
              },
            ];
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "model",
          parts: [{ text: "Apologies, an unexpected error occurred. Please try again." }],
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#2C2C2E] rounded-2xl shadow-2xl border border-[#3A3A3C] overflow-hidden">
        <div className="bg-[#3A3A3C] p-4 md:p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#4A4A4C] p-2 rounded-full">
              <Zap className="w-6 h-6 text-[#5E5CE6]" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">AI Companion</h1>
          </div>
        </div>

        <div className="p-4 md:p-6 flex flex-col h-[75vh]">
          <ScrollArea className="flex-grow mb-4 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-[#3A3A3C]">
                      {message.role === "user" ? (
                        <User className="h-5 w-5 text-[#5E5CE6]" />
                      ) : (
                        <Bot className="h-5 w-5 text-[#5E5CE6]" />
                      )}
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-lg ${
                        message.role === "user"
                          ? "bg-[#5E5CE6] text-white"
                          : "bg-[#3A3A3C] text-white"
                      }`}
                    >
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{message.parts[0].text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center">
                  <div className="animate-pulse rounded-full h-8 w-8 bg-[#5E5CE6]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
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