import "server-only";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  trimMessages,
} from "@langchain/core/messages";
import { MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";
import { getDefaultPromptChat } from "@/prompt/systemMessage";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { END, MemorySaver } from "@langchain/langgraph";
import { Id } from "@/convex/_generated/dataModel";
import { ChatGroq } from "@langchain/groq";
import Groq from "groq-sdk";
import { FreeLLModelsEnum } from "./types";
// import { ToolNode } from "@langchain/langgraph/prebuilt";
// import wxflows from "@wxflows/sdk/langchain";

export async function submitQuestionStream(
  model: ChatGroq,
  messages: BaseMessage[],
  chatId: Id<"chats">,
) {
  // Retrieve the tools
  // const toolClient = new wxflows({
  //   endpoint: process.env.WXFLOWS_ENDPOINT || "",
  //   apikey: process.env.WXFLOWS_APIKEY,
  // });
  // const tools = await toolClient.lcTools;
  // const toolNode = new ToolNode(tools);

  const trimmer = trimMessages({
    maxTokens: 10,
    strategy: "last",
    tokenCounter: (msgs) => msgs.length,
    includeSystem: true,
    allowPartial: false,
    startOn: "human",
  });

  const cachedMessages = addCachingHeaders(messages);

  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", async (state) => {
      // Create the system message content
      const systemContent = getDefaultPromptChat();

      // Create the prompt template with system message and messages placeholder
      const promptTemplate = ChatPromptTemplate.fromMessages([
        new SystemMessage(systemContent, {
          cache_control: { type: "ephemeral" },
        }),
        new MessagesPlaceholder("messages"),
      ]);

      // Trim the messages to manage conversation history
      const trimmedMessages = await trimmer.invoke(state.messages);

      // Format the prompt with the current messages
      const prompt = await promptTemplate.invoke({ messages: trimmedMessages });

      // Get response from the model
      const response = await model.invoke(prompt);
      return { messages: [response] };
    })
    // .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue);
  // .addEdge("tools", "agent");

  // const workflow = createWorkflow();

  // Create a checkpoint to save the state of the conversation
  const checkpointer = new MemorySaver();
  const app = workflow.compile({ checkpointer });

  const stream = await app.streamEvents(
    { messages: cachedMessages },
    {
      version: "v2",
      configurable: { thread_id: chatId },
      streamMode: "messages",
      runId: chatId,
    },
  );

  return stream;
}

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }

  // If the last message is a tool message, route back to agent
  if (lastMessage.content && lastMessage._getType() === "tool") {
    return "agent";
  }

  // Otherwise, we stop (reply to the user)
  return END;
}

function addCachingHeaders(messages: BaseMessage[]): BaseMessage[] {
  if (!messages.length) return messages;

  // Create a copy of messages to avoid mutating the original
  const cachedMessages = [...messages];

  // Helper to add cache control
  const addCache = (message: BaseMessage) => {
    message.content = [
      {
        type: "text",
        text: message.content as string,
        cache_control: { type: "ephemeral" },
      },
    ];
  };

  // Cache the last message
  // console.log("🤑🤑🤑 Caching last message");
  addCache(cachedMessages.at(-1)!);

  // Find and cache the second-to-last human message
  let humanCount = 0;
  for (let i = cachedMessages.length - 1; i >= 0; i--) {
    if (cachedMessages[i] instanceof HumanMessage) {
      humanCount++;
      if (humanCount === 2) {
        // console.log("🤑🤑🤑 Caching second-to-last human message");
        addCache(cachedMessages[i]);
        break;
      }
    }
  }

  return cachedMessages;
}

export const initialzeModel = async () => {
  const model = new ChatGroq({
    model: FreeLLModelsEnum.deepseek_llama,
    temperature: 0,
    maxTokens: 4096,
    streaming: true, // stop:None,
    apiKey: process.env.GROQ_API_KEY, // other params...
    callbacks: [
      {
        handleLLMStart: async () => {
          console.log("Starting LLM call");
        },
        handleLLMEnd: async (output) => {
          console.log("End LLM call", output);
          const usage = output.llmOutput?.usage;

          console.log("llm end usage ", usage);

          if (usage) {
            console.log("token usage:", {
              input_tokens: usage.input_tokens,
              output_tokens: usage.output_tokens,
            });
          }
        },
      },
    ],
  }); //.bindTools(tools);

  // const groq = new Groq({
  //   apiKey: process.env.GROQ_API_KEY,
  // });

  // const stream = await groq.chat.completions.create({
  //   messages: [],
  //   model: "llama_v3",
  //   stream: true,
  //   max_tokens: 1024,
  //   temperature: 0.7,
  // });

  // const response = await model.invoke(prompt);
  // return { messages: [response] };
  return model;
};
