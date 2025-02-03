import Groq from "groq-sdk";
import wxflows from "@wxflows/sdk/langchain";
import { ToolNode } from "@langchain/langgraph/prebuilt";

const groq = new Groq({
  // apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY
  apiKey: process.env.GROQ_API_KEY
});

const systemPrompt =
  "You are a friendly and knowledgeable academic assistant, " +
  "coding assistant and a teacher of anything related to AI and Machine Learning. " +
  "Your role is to help users with anything related to academics, " +
  "provide detailed explanations, and support learning across various domains.";

export async function POST(request) {
  try {
    const { messages, msg } = await request.json();

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


    // Connect to wxflows
    const toolClient = new wxflows({
      endpoint: process.env.WXFLOWS_ENDPOINT || "",
      apikey: process.env.WXFLOWS_APIKEY
    });


// Retrieve the tools
    const tools = await toolClient.lcTools;
    const toolNode = new ToolNode(tools);


    const stream = await groq.chat.completions.create({
      messages: enhancedMessages,
      // model: "mixtral-8x7b-32768",
      // model: "deepseek-ai/deepseek-llm-67b-chat",
      // model: "llama3-8b-8192", // Choose your preferred model
      model: "deepseek-r1-distill-qwen-32b",
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
      tools
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
