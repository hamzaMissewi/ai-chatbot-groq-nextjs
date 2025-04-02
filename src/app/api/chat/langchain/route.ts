import { ChatGroq } from "@langchain/groq";
import { NextResponse } from "next/server";
import { getEnumKeyByValue } from "@/lib/lib";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import Groq from "groq-sdk";
import { submitQuestionStream } from "@/lib/langgraph";
import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import {
  FreeLLModelsEnum,
  MessageInputType,
  SSE_DATA_PREFIX,
  SSE_LINE_DELIMITER,
  StreamMessage,
  StreamMessageType,
} from "@/lib/types";
// import {
//   ChatPromptTemplate,
//   MessagesPlaceholder,
//   PromptTemplate,
// } from "@langchain/core/prompts";

// TODO ROUTE OF SONNY
const STREAM_LANGGRAPH = true;

export const runtime = "edge";

function sendSSEMessage(
  writer: WritableStreamDefaultWriter<any>,
  data: StreamMessage,
) {
  const encoder = new TextEncoder();
  return writer.write(
    encoder.encode(
      `${SSE_DATA_PREFIX}${JSON.stringify(data)}${SSE_LINE_DELIMITER}`,
    ),
  );
}

export async function POST(req: Request) {
  try {
    const { messages, chatId, modelName: modelInput } = await req.json();

    // Initialize Groq with your API key (get it from https://console.groq.com/)
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: "Groq API key not configured" },
        { status: 500 },
      );
    }

    let modelName: string = FreeLLModelsEnum.deepseek_llama;
    // modelId = "mixtral-8x7b-32768"
    // modelName = "llama2-70b-4096";

    if (modelInput) {
      const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });
      try {
        const retrieve = await groq.models.retrieve(modelInput);
        modelName = retrieve.id;
      } catch (error) {}
    }

    const model = new ChatGroq({
      apiKey: groqApiKey,
      model: modelName, //|| "llama2-70b-4096",
      // model: "mixtral-8x7b-32768", // or "llama2-70b-4096"
      temperature: 0.5,
      streaming: true,
    });

    // Process the last user message
    const lastUserMessage = messages[messages.length - 1].content;

    // TODO

    const createMessageInput: {
      chatId: Id<"chats">;
      content: string;
      model?: keyof typeof FreeLLModelsEnum;
    } = {
      chatId: chatId as Id<"chats">,
      content: lastUserMessage,
      model: modelName
        ? getEnumKeyByValue(FreeLLModelsEnum, modelName)
        : undefined,
      // model: Object.keys(FreeLLModelsEnum).find(key => FreeLLModelsEnum[key as keyof string] === model)
    };

    const convex = getConvexClient();
    await convex.mutation(api.messages.send, createMessageInput);

    const response = await model.invoke(lastUserMessage);

    if (STREAM_LANGGRAPH) {
      const stream = new TransformStream({}, { highWaterMark: 1024 });
      const writer = stream.writable.getWriter();
      stream.readable;

      // Create a chat prompt template
      // const chatPrompt = ChatPromptTemplate.fromMessages([
      //   ["system", "You are a helpful AI assistant. Respond concisely and helpfully."],
      //   new MessagesPlaceholder("chat_history"),
      //   ["human", "{input}"]
      // ]);

      // Create the AI chain
      // const chain = RunnableSequence.from([
      //   {
      //     input: new RunnablePassthrough(),
      //     chat_history: ({chat_history}) => chat_history || []
      //   },
      //   chatPrompt,
      //   groqModel, // Primary model
      //   new StringOutputParser()
      // ]);

      async function streaming() {
        try {
          await sendSSEMessage(writer, { type: StreamMessageType.Connected });

          // // Send user message to Convex
          // await convex.mutation(api.messages.send, {
          //     chatId,
          //     content: newMessage,
          // });

          const langChainMessages = [
            ...messages
              .slice(0, messages.length - 1)
              .map(
                (msg: MessageInputType) =>
                  msg.content &&
                  (msg.role === "user"
                    ? new HumanMessage(msg.content)
                    : new AIMessage(msg.content)),
              ),
            new HumanMessage(lastUserMessage),
          ];

          const eventStream = await submitQuestionStream(
            model,
            langChainMessages,
            chatId,
          );

          // Process the events
          for await (const event of eventStream) {
            console.log("🔄 Event:", event);

            if (event.event === "on_chat_model_stream") {
              const token = event.data.chunk;
              if (token) {
                // Access the text property from the AIMessageChunk
                const text = token.content.at(0)?.["text"];
                if (text) {
                  await sendSSEMessage(writer, {
                    type: StreamMessageType.Token,
                    token: text,
                  });
                }
              }
            } else if (event.event === "on_tool_start") {
              await sendSSEMessage(writer, {
                type: StreamMessageType.ToolStart,
                tool: event.name || "unknown",
                input: event.data.input,
              });
            } else if (event.event === "on_tool_end") {
              const toolMessage = new ToolMessage(event.data.output);

              await sendSSEMessage(writer, {
                type: StreamMessageType.ToolEnd,
                tool: toolMessage.lc_kwargs.name || "unknown",
                output: event.data.output,
              });
            }
          }
          await sendSSEMessage(writer, { type: StreamMessageType.Done });
        } catch (streamError) {
          console.error("Error in event stream:", streamError);
          await sendSSEMessage(writer, {
            type: StreamMessageType.Error,
            error:
              streamError instanceof Error
                ? streamError.message
                : "Stream processing failed",
          });
        } finally {
          try {
            await writer.close();
          } catch (closeError) {
            console.error("Error closing writer:", closeError);
          }
        }
      }

      streaming();

      // TODO
      return Response.json(
        { content: response.content, streamReadable: stream.readable },
        {
          headers: {
            "Content-Type": "text/event-stream",
            // "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no", // Disable buffering for nginx which is required for SSE to work properly
          },
        },
      );
    }

    return NextResponse.json({ content: response.content });
  } catch (error) {
    console.error("[GROQ_ERROR]", error);
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 },
    );
  }
}
