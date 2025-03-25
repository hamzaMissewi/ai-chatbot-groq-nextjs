import { MessagesAnnotation, START, StateGraph } from "@langchain/langgraph/index";
import { ChatPromptTemplate, MessagesPlaceholder, PromptTemplate } from "@langchain/core/prompts";
import { SSE_DATA_PREFIX, SSE_LINE_DELIMITER, StreamMessage, StreamMessageType } from "@/lib/types";
import { SystemMessage } from "@langchain/core/messages";
import { getDefaultPromptChat } from "@/lib/systemMessage";
import wxflows from "@wxflows/sdk/dist/lib/langchain";
import { ToolNode } from "@langchain/langgraph/prebuilt";


// const systemPrompt =
//   "You are a friendly and knowledgeable academic assistant, " +
//   "coding assistant and a teacher of anything related to AI and Machine Learning. " +
//   "Your role is to help users with anything related to academics, " +
//   "provide detailed explanations, and support learning across various domains.";


// Hamza function
async function sendSSEMessage(
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


export const initStream = async () => {
  // HAMZA INIT
  // Create stream with larger queue strategy for better performance
  const streamInit = new TransformStream({}, { highWaterMark: 1024 });
  const writer = streamInit.writable.getWriter();
  // Send initial connection established message
  await sendSSEMessage(writer, { type: StreamMessageType.Connected });
};


// Connect to wxflows
const toolClient = new wxflows({
  endpoint: process.env.WXFLOWS_ENDPOINT || "",
  apikey: process.env.WXFLOWS_APIKEY
});


// Retrieve the tools
const tools = await toolClient.lcTools;

// const toolNode = new ToolNode(tools);


export const createWorkflow = (model: any) => {
  // const model = initialiseModel();
  const toolNode = new ToolNode(tools);

  const stateGraph = new StateGraph(MessagesAnnotation)
    .addNode("agent", async (state) => {
      // create the system message content
      // const systemContent = SYSTEM_MESSAGE;
      const messageContent = getDefaultPromptChat();

      const promptMessage = PromptTemplate.fromTemplate(messageContent);

      // const outputParser = new HttpResponseOutputParser();
      // const chain = promptMessage.pipe(model).pipe(outputParser);
      // const stream = await chain.stream({
      //   chat_history: formattedPreviousMessages.join("\n"),
      //   input: currentMessageContent,
      // });

      //   create the prompt template
      const promptTemplate = ChatPromptTemplate.fromMessages([
        new SystemMessage(messageContent, {
          cache_control: { type: "ephemeral" } // set a cache breakpoint (max number of breakpoints is 4)
        }),
        new MessagesPlaceholder("messages") //new HumanMessage(message), // { human: "hi" },
      ]);

      //   trim the message to manage conversation history
      // const trimmedMessages = await trimmer.invoke(state.messages);
      // console.log("trimmed Messages", trimmedMessages);

      // Format the prompt with the current messages
      const prompt = await promptTemplate.invoke({ message: state.messages });

      // Get response from the model
      const response = await model.invoke(prompt);
      console.log("Model Response:", response);
      return { messages: [response] };
    })
    .addEdge(START, "agent")
    .addNode("tools", toolNode)
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");

  // console.log("stateGraph", stateGraph);
  return stateGraph;
};


