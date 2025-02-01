import { NextResponse } from "next/server";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const systemPrompt =
  "Your system prompt here. E.g: You are a friendly and knowledgeable academic assistant. Your role is to help users with anything related to academics,";

export async function POST(req) {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt,
  });

  const data = await req.json();

  const chat = model.startChat({
    history: data.messages,
  });

  const result = await chat.sendMessageStream(data.msg);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of result.stream) {
          const content = await chunk.text();
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}