import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, streamText } from "ai";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { SYSTEM_MESSAGE } from "@/prompt/systemMessage";
import { FreeLLModelsEnum } from "@/lib/types";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // const _messages: { role: "user" | "assistant"; content: string }[] =
    const _messages: VercelChatMessage[] = body.messages ?? [];
    const messages = _messages.filter((reply, index) => {
      if (_messages.length - 1 === index)
        reply.content = reply.content.replace(/<\/?think>/g, "");
      return reply;
    });

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = PromptTemplate.fromTemplate(SYSTEM_MESSAGE);

    /**
     * You can also try e.g.:
     *
     * import { ChatAnthropic } from "@langchain/anthropic";
     * const model = new ChatAnthropic({});
     *
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */
    const model = new ChatGroq({
      model: FreeLLModelsEnum.deepseek_llama,
      temperature: 0.6,
      maxTokens: 4096,
      streaming: true,
      apiKey: process.env.GROQ_API_KEY,
      // other params...
    });

    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and byte-encoding.
     */
    const outputParser = new HttpResponseOutputParser();

    /**
     * Can also initialize as:
     *
     * import { RunnableSequence } from "@langchain/core/runnables";
     * const chain = RunnableSequence.from([prompt, model, outputParser]);
     */
    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return new Response(stream);
    // return streamText(model).toDataStreamResponse(); // TODO
    // return streamText.toDataStreamResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
