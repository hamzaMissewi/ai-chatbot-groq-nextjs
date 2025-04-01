import { NextRequest, NextResponse } from "next/server";
import { saveDocsToConvex, saveDocsToSupabase } from "@/lib/lib";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { OpenAIEmbeddings } from "@langchain/openai";

export const runtime = "edge";

// Before running, follow set-up instructions at
// https://js.langchain.com/v0.2/docs/integrations/vectorstores/supabase

/**
 * This handler takes input text, splits it into chunks, and embeds those chunks
 * into a vector store for later retrieval. See the following docs for more information:
 *
 * https://js.langchain.com/v0.2/docs/how_to/recursive_text_splitter
 * https://js.langchain.com/v0.2/docs/integrations/vectorstores/supabase
 */
// USED IN UPLOAD DOCUMENTS
export async function POST(req: NextRequest) {
  const body = await req.json();
  const text = body.text;
  //
  // if (process.env.NEXT_PUBLIC_DEMO === "true") {
  //   return NextResponse.json(
  //     {
  //       error: [
  //         "Ingest is not supported in demo mode.",
  //         "Please set up your own version of the repo here: https://github.com/langchain-ai/langchain-nextjs-template",
  //       ].join("\n"),
  //     },
  //     { status: 403 },
  //   );
  // }

  try {
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 256,
      chunkOverlap: 20,
    });

    const splitDocuments = await splitter.createDocuments([text]);
    await saveDocsToSupabase(splitDocuments);

    // Convert documents to File[] array
    const files: File[] = splitDocuments.map((doc, index) => {
      // Create a Blob from the document text
      const blob = new Blob([doc.pageContent], { type: "text/plain" });
      // Create a File object with a meaningful name
      return new File([blob], `document-chunk-${index + 1}.txt`, {
        type: "text/plain",
        lastModified: Date.now(),
      });
    });

    // TODO
    await saveDocsToConvex(files);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
