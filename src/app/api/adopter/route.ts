import { NextRequest, NextResponse } from 'next/server';
import { getAllPets } from '../../../../lib/pets';
import { askOllama } from '../../../../lib/ollama';


export async function POST(req: NextRequest) {
  const { preferences } = await req.json();
  const pets = getAllPets();

  const prompt = `You are an assistant helping someone adopt a pet.
Adopter's preferences: ${preferences}
Available animals:
${pets.map((p, i) => `${i + 1}. ${p.name} - Size: ${p.size}, Personality: ${p.personality}`).join('\n')}

Which animal is the best match and why? Provide the name and reason.`;

  const response = await askOllama(prompt);
  return NextResponse.json({ match: response });
}
