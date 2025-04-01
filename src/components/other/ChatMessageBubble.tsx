import { cn } from "@/lib/cn";
import type { Message } from "ai/react";

export function ChatMessageBubble(props: {
  message: Message;
  aiEmoji?: string;
  sources?: any[];
}) {
  return (
    <div
      className={cn(
        `mb-8 flex max-w-[80%] rounded-[24px]`,
        props.message.role === "user"
          ? "bg-secondary px-4 py-2 text-secondary-foreground"
          : null,
        props.message.role === "user" ? "ml-auto" : "mr-auto",
      )}
    >
      {props.message.role !== "user" && (
        <div className="-mt-2 mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-secondary">
          {props.aiEmoji}
        </div>
      )}

      <div className="flex flex-col whitespace-pre-wrap">
        <span>{props.message.content}</span>

        {props.sources && props.sources.length ? (
          <>
            <code className="mr-auto mt-4 rounded bg-primary px-2 py-1">
              <h2>🔍 Sources:</h2>
            </code>
            <code className="mr-2 mt-1 rounded bg-primary px-2 py-1 text-xs">
              {props.sources?.map((source, i) => (
                <div className="mt-2" key={"source:" + i}>
                  {i + 1}. &quot;{source.pageContent}&quot;
                  {source.metadata?.loc?.lines !== undefined ? (
                    <div>
                      <br />
                      Lines {source.metadata?.loc?.lines?.from} to{" "}
                      {source.metadata?.loc?.lines?.to}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </code>
          </>
        ) : null}
      </div>
    </div>
  );
}

// function Message(props: {
//   message: Message;
//   onEdit: (message: Message) => void;
//   onRegenerate: () => void;
//   actions?: React.ReactNode;
// }) {
//   const [isEditing, setIsEditing] = useState(false);
//   if (isEditing) {
//     return (
//       <EditMessage
//         message={props.message}
//         onEdit={props.onEdit}
//         onCancel={() => setIsEditing(false)}
//       />
//     );
//   }
//
//   return (
//     <div
//       className={cn(
//         "max-w-[80%]",
//         props.message.role === "human" ? "ml-auto" : "mr-auto",
//         // props.message.type === "human" ? "ml-auto" : "mr-auto",
//       )}
//     >
//       <div
//         className={cn(
//           `rounded-[24px] flex`,
//           props.message.type === "human"
//             ? "bg-secondary text-secondary-foreground px-4 py-2"
//             : null,
//         )}
//       >
//         <div className="whitespace-pre-wrap flex flex-col">
//           {typeof props.message.content === "string"
//             ? props.message.content
//             : props.message.content.map((part) => {
//               if (part.type === "text") return part.text;
//               return null;
//             })}
//         </div>
//       </div>
//
//       {props.message.type === "human" && (
//         <div className="ml-auto flex justify-end items-center gap-2 mt-2">
//           <button
//             className="text-muted-foreground text-right text-sm"
//             type="button"
//             onClick={() => setIsEditing(true)}
//           >
//             Edit
//           </button>
//
//           {props.actions}
//         </div>
//       )}
//
//       {props.message.type === "ai" && (
//         <div className="mt-2 flex items-center justify-start gap-2">
//           {props.actions}
//           <div className="text-sm text-muted-foreground">
//             <button type="button" onClick={props.onRegenerate}>
//               Regenerate
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
