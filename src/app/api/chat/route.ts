import { streamText } from 'ai';
import { createOllama } from 'ollama-ai-provider';
import { loadPets, removePetByName } from '../../../../lib/pets';

export async function POST(req: Request) {
  try {
    const { messages, selectedModel } = await req.json();
    const ollama = createOllama({ baseURL: process.env.OLLAMA_URL + "/api" });

    const isFirstMessage = messages.length === 1;
    const lastUserMsg = messages.findLast((m: any) => m.role === 'user')?.content.toLowerCase() || '';
    const lastAssistantMsg = messages.findLast((m: any) => m.role === 'assistant')?.content || '';

    const pets = loadPets();

    // ✅ Case-insensitive match
    const previouslySuggestedPet = pets.find(p =>
      lastAssistantMsg.toLowerCase().includes(p.name.toLowerCase())
    );

    // ✅ Stream thank-you response if user accepts adoption
    if (previouslySuggestedPet && lastUserMsg.includes('yes')) {
      removePetByName(previouslySuggestedPet.name);

      const result = await streamText({
        model: ollama(selectedModel || 'llama3.2:1b'),
        messages: [
          {
            role: 'assistant',
            content: `🎉 thank you for adopting **${previouslySuggestedPet.name}**! Thank you for giving them a loving home.`
          }
        ]
      });

      return result.toDataStreamResponse();
    }

    const prompt = `
You are a friendly assistant for a pet adoption platform.

${isFirstMessage ? `
Start by greeting the user warmly and ask them to describe:
1. What kind of place they live in (e.g., small apartment, house with yard).
2. What type of pet they're looking for (e.g., dog, calm, playful, cat, etc).
` : `
Choose ONE suitable pet from this list based on the user's needs:

${pets.length > 0
  ? pets.map(p => `- Name: ${p.name}, Type: ${p.animalType}, Size: ${p.size}, Personality: ${p.personality}, Image: ${p.imageUrl}`).join('\n')
  : '⚠️ The list is currently empty.'}

⚠️ STRICT INSTRUCTIONS:
- Only suggest a pet from the list above.
- DO NOT invent pets or names.
- DO NOT suggest pets if the list is empty.
- Only say: "Sorry, no matches available." if the list is completely empty.
- If pets are listed, choose ONE of them.
- NEVER reject a pet that is listed above.
- Respond using this format:
  **Name**: <pet name>
  **Size**: <size>
  **Personality**: <personality>
  ![pet](<imageUrl>)
  Would you like to adopt this animal?

❌ Do NOT provide care tips or post-adoption advice.
`}`.trim();

    const result = await streamText({
      model: ollama(selectedModel || 'llama3.2:1b'),
      messages: [
        { role: 'system', content: prompt },
        ...messages,
      ],
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("❌ Error in POST /api/ollama-chat:", error);
    return new Response("Internal server error", {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
