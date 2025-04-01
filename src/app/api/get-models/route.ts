import Groq from "groq-sdk";

export async function GET() {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.models.list();
    return Response.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Error in getting models list:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred processing your request",
        details: error?.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
