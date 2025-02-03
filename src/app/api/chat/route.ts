import Groq from "groq-sdk";
import { ChatRequestBody, SSE_DATA_PREFIX, SSE_LINE_DELIMITER, StreamMessage, StreamMessageType } from "@/lib/types";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const systemPrompt =
  "You are a friendly and knowledgeable academic assistant, " +
  "coding assistant and a teacher of anything related to AI and Machine Learning. " +
  "Your role is to help users with anything related to academics, " +
  "provide detailed explanations, and support learning across various domains.";


// Hamza function
function sendSSEMessage(
  writer: WritableStreamDefaultWriter<Uint8Array>,
  data: StreamMessage
) {
  const encoder = new TextEncoder();
  return writer.write(
    encoder.encode(
      `${SSE_DATA_PREFIX}${JSON.stringify(data)}${SSE_LINE_DELIMITER}`
    )
  );
}


export async function POST(request) {


  try {
    const { messages, msg, chatId } = (await request.json()) as ChatRequestBody;

    // HAMZA INIT
    // Create stream with larger queue strategy for better performance
    const streamInit = new TransformStream({}, { highWaterMark: 1024 });

    const writer = streamInit.writable.getWriter();
    // Send initial connection established message
    await sendSSEMessage(writer, { type: StreamMessageType.Connected });

    if (chatId) {
      const convex = getConvexClient();
      // Send user message to Convex
      await convex.mutation(api.messages.send, {
        chatId,
        content: msg
      });
    }

    // Safely handle undefined or null messages
    const processedMessages = messages && Array.isArray(messages)
      ? messages.reduce((acc, m) => {
        if (m && m.parts && m.parts[0] && m.parts[0].text) {
          acc.push({
            role: m.role === "model" ? "assistant" : "user",
            content: m.parts[0].text
          });
        }
        return acc;
      }, [])
      : [];

    const enhancedMessages = [
      { role: "system", content: systemPrompt },
      ...processedMessages,
      { role: "user", content: msg }
    ];

    const stream = await groq.chat.completions.create({
      messages: enhancedMessages,
      // model: "llama3-8b-8192", // Choose your preferred model
      model: "deepseek-r1-distill-qwen-32b",
      stream: true,
      max_tokens: 1024,
      temperature: 0.7
    });

    // Create a custom readable stream to parse the chunks
    const responseStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;

            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(responseStream);
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({
      error: "An error occurred processing your request",
      details: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
