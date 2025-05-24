import { streamText } from 'ai';
import { createOllama } from 'ollama-ai-provider';
import { loadPets, removePetByName } from '../../../../lib/pets';

interface Pet {
  name: string;
  animalType: string;
  size: string;
  personality: string;
}

export async function POST(req: Request) {
  try {
    const { messages, selectedModel } = await req.json();
    const ollama = createOllama({ baseURL: process.env.OLLAMA_URL + "/api" });

    const isFirstMessage = messages.length === 1;
    const lastUserMsg = messages.findLast((m: any) => m.role === 'user')?.content.toLowerCase() || '';
    const lastAssistantMsg = messages.findLast((m: any) => m.role === 'assistant')?.content || '';

    const pets = loadPets();

    const previouslySuggestedPet = pets.find((p: Pet) =>
      lastAssistantMsg.toLowerCase().includes(p.name.toLowerCase())
    );

    // If user accepted a pet
    if (previouslySuggestedPet && lastUserMsg.includes('yes')) {
      removePetByName(previouslySuggestedPet.name);

      const result = await streamText({
        model: ollama(selectedModel || 'llama3.2:1b'),
        messages: [
          {
            role: 'assistant',
            content: `🎉 Thank you for adopting **${previouslySuggestedPet.name}**! You're giving them a wonderful home.`
          }
        ]
      });

      return result.toDataStreamResponse();
    }

    const s3BaseUrl = 'https://m-adoption-images.s3.amazonaws.com';

    const prompt = `
You are a friendly assistant on a pet adoption platform.

${isFirstMessage ? `
Greet the user warmly and ask:
1. What kind of home do you live in? (e.g., small apartment, house with yard)
2. What type of pet are you looking for? (e.g., dog, cat, playful, calm)
` : `
Choose ONE suitable pet from this list based on the user's needs:

${pets.length > 0
  ? pets.map((p: Pet) =>
      `- Name: ${p.name}, Type: ${p.animalType}, Size: ${p.size}, Personality: ${p.personality}, Image: ${s3BaseUrl}/${p.name.toLowerCase().replace(/\\s+/g, '-')}.jpg`
    ).join('\n')
  : '⚠️ No pets are currently available.'}

📌 Instructions:
- Only suggest ONE real pet from the list above.
- Do NOT make up any pets.
- If the list is empty, say: "Sorry, no matches available right now."
- Format your reply like this:

**Name**: <pet name>
**Size**: <size>
**Personality**: <personality>
![pet](https://m-adoption-images.s3.amazonaws.com/<pet-name-lowercase-with-dashes>.jpg)
Would you like to adopt this animal?
`}
`.trim();

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
