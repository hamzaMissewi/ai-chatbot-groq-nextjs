import { FreeLLModelsEnum, MessageInputType } from "@/lib/types";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { SYSTEM_MESSAGE } from "@/prompt/systemMessage";
import { NextRequest } from "next/server";
import { Id } from "@/convex/_generated/dataModel";
import Groq from "groq-sdk";
// import { AIMessage, HumanMessage } from "@langchain/core/messages";
// import { APIPromise } from "groq-sdk/src/core";

// // Hamza function
// function sendSSEMessage(
//   // writer: WritableStreamDefaultWriter<Uint8Array>,
//   writer: WritableStreamDefaultWriter<any>,
//   data: StreamMessage
// ) {
//   const encoder = new TextEncoder();
//   return writer.write(
//     encoder.encode(
//       `${SSE_DATA_PREFIX}${JSON.stringify(data)}${SSE_LINE_DELIMITER}`
//     )
//   );
// }

// const tools = await toolClient.lcTools;
// const toolClient = new wxflows({
//   endpoint: process.env.WXFLOWS_ENDPOINT || "",
//   apikey: process.env.WXFLOWS_APIKEY
// });
//
//
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY
// });

export async function POST(request: NextRequest) {
  try {
    const { messages, msg, chatId, modelName } = (await request.json()) as {
      chatId: Id<"chats">;
      msg: string;
      messages: MessageInputType[];
      modelName?: string;
    };
    // HAMZA INIT
    // Create stream with larger queue strategy for better performance
    // const streamInit = new TransformStream({}, { highWaterMark: 1024 });
    // // const writer: WritableStreamDefaultWriter<Uint8Array> = streamInit.writable.getWriter();
    // const writer = streamInit.writable.getWriter();
    // // // Send initial connection established message
    // await sendSSEMessage(writer, { type: StreamMessageType.Connected });

    const convex = getConvexClient();

    // Hamza
    // const stream = new TransformStream({}, { highWaterMark: 1024 });
    // const writer = stream.writable.getWriter();
    //
    // const response = new Response(stream.readable, {
    //   headers: {
    //     "Content-Type": "text/event-stream",
    //     // "Cache-Control": "no-cache, no-transform",
    //     Connection: "keep-alive",
    //     "X-Accel-Buffering": "no" // Disable buffering for nginx which is required for SSE to work properly
    //   }
    // });

    // await sendSSEMessage(writer, { type: StreamMessageType.Done });

    const createMessageInput: {
      chatId: Id<"chats">;
      content: string;
      model?: string; // keyof typeof FreeLLModelsEnum;
    } = {
      chatId: chatId as Id<"chats">,
      content: msg,
      model: modelName,
      // getEnumKeyByValue(FreeLLModelsEnum, modelName)
    };

    await convex.mutation(api.messages.send, createMessageInput);

    // Safely handle undefined or null messages
    const processedMessages =
      // messages && Array.isArray(messages)
      messages.length > 0
        ? messages.reduce((acc, m) => {
            // if (m && m.parts && m.parts[0] && m.parts[0].text) {
            acc.push({
              // role: m.role === "assistant" ? "system" : "user",
              role: m.role === "user" ? "user" : "system",
              content: m.content,
              // role: m.getType() === "human" ? "user" : "system",
            });
            return acc;
          }, [] as MessageInputType[])
        : [];

    const enhancedMessages: MessageInputType[] = [
      // { role: "assistant", content: SYSTEM_MESSAGE },
      { role: "system", content: SYSTEM_MESSAGE },
      ...processedMessages,
      { role: "user", content: msg },
    ];

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const stream = await groq.chat.completions.create({
      messages: enhancedMessages,
      model: modelName || FreeLLModelsEnum.deepseek_llama,
      stream: true, // IMPORTANT
      max_tokens: 2048,
      temperature: 0.6,
      // model: modelName && Object.values(FreeLLModelsEnum).includes(
      //   modelName as unknown as FreeLLModelsEnum,
      // )
    });
    // })) as APIPromise<ChatCompletion>;

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
      },
    });

    // const openaiModel = new ChatOpenAI({ model: "gpt-4o" });
    // const dd = await openaiModel.invoke(messages[0]);
    // const result = await streamText({
    //   model: dd, // OpenAI's model that supports images
    //   messages,
    // });
    // return Response.json({ result }, { status: 200 });

    return new Response(responseStream);
  } catch (error: any) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred processing your request",
        details: error?.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
