import fs from 'fs';
import path from 'path';

// ✅ Hardcoded absolute path to project-level data directory
const filePath = '/home/ubuntu/m-nextjs-ollama-llm-ui/data/pets.json';

export function loadPets() {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn('pets.json does not exist. Returning empty list.');
      return [];
    }

    const raw = fs.readFileSync(filePath, 'utf-8').trim();
    if (!raw) {
      console.warn('pets.json is empty. Returning empty list.');
      return [];
    }

    return JSON.parse(raw);
  } catch (err) {
    console.error('❌ Failed to read or parse pets.json:', err);
    return [];
  }
}

export function savePet(pet: any) {
  try {
    const pets = loadPets();
    console.log('💾 Pet to save:', pet);
    pets.push(pet);
    console.log('📦 Full pets list:', pets);
    fs.writeFileSync(filePath, JSON.stringify(pets, null, 2), 'utf-8');
    console.log('✅ Pet successfully written to pets.json');
  } catch (err) {
    console.error('❌ Failed to write pets.json:', err);
  }
}

// For adopter matching
export { loadPets as getAllPets };

