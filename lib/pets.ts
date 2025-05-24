import fs from 'fs';
import path from 'path';

type Pet = {
  name: string;
  size: string;
  personality: string;
  animalType: string;
  imageUrl: string;
};

// Get the correct path for both development and production
function getDataPath() {
  // In production, use /home/ubuntu/m-nextjs-ollama-llm-ui/data
  if (process.env.NODE_ENV === 'production') {
    return '/home/ubuntu/m-nextjs-ollama-llm-ui/data/pets.json';
  }
  // In development, use the local path
  return path.join(process.cwd(), 'data', 'pets.json');
}

const filePath = getDataPath();

function ensureDataDirectoryExists() {
  const dataDir = path.dirname(filePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export function loadPets(): Pet[] {
  try {
    ensureDataDirectoryExists();
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

export function removePetByName(name: string) {
  ensureDataDirectoryExists();
  const pets = loadPets();
  const updated = pets.filter((p: Pet) => p.name.toLowerCase() !== name.toLowerCase());
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
}

export function savePet(pet: {
  name: string;
  size: string;
  personality: string;
  animalType: string;
  imageUrl?: string;
}) {
  try {
    ensureDataDirectoryExists();
    const pets = loadPets();
    pets.push({
      name: pet.name,
      size: pet.size,
      personality: pet.personality,
      animalType: pet.animalType,
      imageUrl: pet.imageUrl || '',
    });
    fs.writeFileSync(filePath, JSON.stringify(pets, null, 2), 'utf-8');
  } catch (err) {
    console.error('❌ Failed to write pets.json:', err);
  }
}

// For compatibility
export { loadPets as getAllPets };
