export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
  console.log("OLLAMA_URL:", OLLAMA_URL);

  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`);

    return new Response(res.body, {
      status: res.status,
      headers: res.headers,
    });
  } catch (error: any) {
    console.error("Failed to connect to Ollama:", error);
    return new Response(
      JSON.stringify({ error: "Failed to connect to Ollama service." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
