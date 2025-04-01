"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useState } from "react";

export default function Chat() {
  // const { messages, input, handleInputChange, handleSubmit } = useChat();
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/devv0",
  });
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">AI Coding Assistant</h1>

      <div className="mb-6 flex-1 space-y-4 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-lg p-4 ${m.role === "user" ? "ml-auto max-w-3xl bg-blue-100" : "mr-auto max-w-3xl bg-gray-100"}`}
          >
            <div className="mb-1 font-semibold">
              {m.role === "user" ? "You" : "AI Assistant"}
            </div>
            <div className="whitespace-pre-wrap">{m.content}</div>

            {/* Display attachments if any */}
            <div className="mt-2">
              {m?.experimental_attachments
                ?.filter(
                  (attachment) =>
                    attachment?.contentType?.startsWith("image/") ||
                    attachment?.contentType?.startsWith("application/pdf"),
                )
                .map((attachment, index) =>
                  attachment.contentType?.startsWith("image/") ? (
                    <img
                      key={`${m.id}-${index}`}
                      src={attachment.url || "/placeholder.svg"}
                      alt={attachment.name ?? `attachment-${index}`}
                      className="mt-2 max-h-64 max-w-full rounded"
                    />
                  ) : attachment.contentType?.startsWith("application/pdf") ? (
                    <iframe
                      key={`${m.id}-${index}`}
                      src={attachment.url}
                      width="100%"
                      height="300"
                      title={attachment.name ?? `attachment-${index}`}
                      className="mt-2 rounded border"
                    />
                  ) : null,
                )}
            </div>
          </div>
        ))}
      </div>

      <form
        className="flex flex-col space-y-4 rounded-lg border bg-white p-4 shadow-md"
        onSubmit={(event) => {
          handleSubmit(event, {
            experimental_attachments: files,
          });
          setFiles(undefined);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      >
        <div className="flex items-center space-x-2">
          <input
            type="file"
            className="flex-1 rounded border p-2"
            onChange={(event) => {
              if (event.target.files) {
                setFiles(event.target.files);
              }
            }}
            multiple
            ref={fileInputRef}
            accept="image/*,application/pdf"
          />
          <div className="text-sm text-gray-500">Upload images or PDFs</div>
        </div>

        <div className="flex space-x-2">
          <input
            className="flex-1 rounded border p-3"
            value={input}
            placeholder="Ask me anything about coding..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
