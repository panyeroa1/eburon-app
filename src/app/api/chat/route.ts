import { streamText } from 'ai';
import { createOllama } from 'ollama-ai-provider';
import { getAllPets } from '../../../../lib/pets'

export async function POST(req: Request) {
  const { messages, selectedModel } = await req.json();

  const pets = getAllPets();
  const ollama = createOllama({ baseURL: process.env.OLLAMA_URL + "/api" });

  const isFirstMessage = messages.length === 1;

  const prompt = `
You are a friendly assistant for a pet adoption platform.

${isFirstMessage ? `Start by greeting the user warmly and ask them to describe:
1. What kind of place they live in (e.g., small apartment, house with yard).
2. What type of pet they're looking for (e.g., dog, calm, playful, cat, etc).` : ''}

Once they describe their environment and preferences, choose ONE suitable pet from this list:

${pets.length > 0 ? JSON.stringify(pets, null, 2) : 'The list is currently empty.'}

⚠️ IMPORTANT:
- Only suggest a pet from the list above.
- Do NOT invent pets.
- If no pets match or the list is empty, kindly inform the user.

Your tone should be warm, concise, and friendly. Mention the pet's name, size, and personality.
`;

  const result = await streamText({
    model: ollama(selectedModel || 'gemma3:1b'),
    messages: [
      { role: 'system', content: prompt },
      ...messages,
    ],
  });

  return result.toDataStreamResponse();
}

