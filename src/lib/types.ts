// SSE Constants
export const SSE_DATA_PREFIX = "data: " as const;
export const SSE_LINE_DELIMITER = "\n\n" as const;
export const SSE_DONE_MESSAGE = "[DONE]" as const;

export type MessageRole = "user" | "assistant" | "system";

export interface MessageInputType {
  role: MessageRole;
  content: string;
  model?: string;
  parts?: { text: string }[];
}

export enum StreamMessageType {
  Token = "token",
  Error = "error",
  Connected = "connected",
  Done = "done",
  ToolStart = "tool_start",
  ToolEnd = "tool_end",
}

export interface BaseStreamMessage {
  type: StreamMessageType;
}

export interface TokenMessage extends BaseStreamMessage {
  type: StreamMessageType.Token;
  token: string;
}

export interface ErrorMessage extends BaseStreamMessage {
  type: StreamMessageType.Error;
  error: string;
}

export interface ConnectedMessage extends BaseStreamMessage {
  type: StreamMessageType.Connected;
}

export interface DoneMessage extends BaseStreamMessage {
  type: StreamMessageType.Done;
}

export interface ToolStartMessage extends BaseStreamMessage {
  type: StreamMessageType.ToolStart;
  tool: string;
  input: unknown;
}

export interface ToolEndMessage extends BaseStreamMessage {
  type: StreamMessageType.ToolEnd;
  tool: string;
  output: unknown;
}

export type StreamMessage =
  | TokenMessage
  | ErrorMessage
  | ConnectedMessage
  | DoneMessage
  | ToolStartMessage
  | ToolEndMessage;

// export interface ChatRequestBody {
//   chatId: Id<"chats">;
//   msg: string;
//   messages: Message[];
//   model?: FreeLLModelsEnum;
//   // newMessage: string;
//   // chatId?: Id<"chats">;
// }

// TODO
export enum FreeLLModelsEnum {
  // "llama2-70b-4096"
  llama_v3 = "llama3-8b-8192",
  deepseek_alibaba = "deepseek-r1-distill-qwen-32b",
  deepseek_llama = "deepseek-r1-distill-llama-70b",
  // deepseek-r1-distill-llama-70b-specdec
  hugging_face = "distil-whisper-large-v3-en",
  gemini_v2 = "gemma2-9b-it",
  openai_v3 = "whisper-large-v3-turbo",
  mistral_saba = "mistral-saba-24b",
  mixtral_32768 = "mixtral-8x7b-32768",
}

export enum Emojis {
  settings = "🛠️",
  ladder = "🪜",
  link = "🔗",
  handshake = "🤝",
  pc = "💻",
  robot = "🤖",
  paint = "🎨",
  poseidon = "🔱",
  finger_down = "👇",
  cercle_violet = "🟣",
  number_1 = "1️⃣",
  number_2 = "2️⃣",
  sea = "🌊",
  spyder = "🕸️",
  bricks = "🧱",
  phone = "☎️",
  diamond = "💎",
  langchain = "🦜🔗",
  fire = "🔥",
  vercel = "▲",
  // ❺ ❹ ❸ ❷ ❶
}

export type SubscriptionLevel = "free" | "pro" | "pro_plus";
