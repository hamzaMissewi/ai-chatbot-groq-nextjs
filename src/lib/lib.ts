import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { Document } from "@langchain/core/documents";
import { Id } from "@/convex/_generated/dataModel";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
// import { generateStorageUrl } from "@/convex/storage";

export function getEnumKeyByValue<T extends Record<string, string>>(
  enumObj: T,
  value?: string,
): keyof T | undefined {
  if (!value) return;
  return (Object.keys(enumObj) as Array<keyof T>).find(
    (key) => enumObj[key] === value,
  );
}

export async function saveDocsToSupabase(documents: Document[]) {
  const client = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PRIVATE_KEY!,
  );

  const vectorstore = await SupabaseVectorStore.fromDocuments(
    documents,
    new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HF_API_KEY,
    }),
    {
      client,
      tableName: "documents",
      queryName: "match_documents",
    },
  );
}

export async function saveDocsToConvex(documents: File[]) {
  if (documents.length === 0) return [];

  try {
    const convex = getConvexClient();
    const url = await convex.mutation(api.storage.generateStorageUrl);
    if (!url) throw new Error("Url not found");

    const storageIds: Id<"_storage">[] = [];

    if (documents.length > 0) {
      for (const document of documents) {
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": document.type },
          body: document,
        });
        if (!result.ok) {
          console.log("Failed to upload image");
          continue;
        }
        const { storageId } = await result.json();
        storageIds!.push(storageId as Id<"_storage">);
      }
      return storageIds;
    }
  } catch (e) {
    throw new Error("");
  }
}
