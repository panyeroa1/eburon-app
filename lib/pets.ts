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
    const prodPath = '/home/ubuntu/m-nextjs-ollama-llm-ui/data/pets.json';
    console.log('📁 Using production path:', prodPath);
    return prodPath;
  }
  // In development, use the local path
  const devPath = path.join(process.cwd(), 'data', 'pets.json');
  console.log('📁 Using development path:', devPath);
  return devPath;
}

const filePath = getDataPath();

function ensureDataDirectoryExists() {
  const dataDir = path.dirname(filePath);
  console.log('📁 Ensuring directory exists:', dataDir);
  if (!fs.existsSync(dataDir)) {
    console.log('📁 Creating directory:', dataDir);
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export function loadPets(): Pet[] {
  try {
    ensureDataDirectoryExists();
    console.log('📁 Loading pets from:', filePath);
    if (!fs.existsSync(filePath)) {
      console.warn('⚠️ pets.json does not exist. Returning empty list.');
      return [];
    }

    const raw = fs.readFileSync(filePath, 'utf-8').trim();
    if (!raw) {
      console.warn('⚠️ pets.json is empty. Returning empty list.');
      return [];
    }

    const pets = JSON.parse(raw);
    console.log('📁 Loaded pets:', pets);
    return pets;
  } catch (err) {
    console.error('❌ Failed to read or parse pets.json:', err);
    return [];
  }
}

export function removePetByName(name: string) {
  console.log('📁 Removing pet:', name);
  ensureDataDirectoryExists();
  const pets = loadPets();
  const updated = pets.filter((p: Pet) => p.name.toLowerCase() !== name.toLowerCase());
  console.log('📁 Writing updated pets:', updated);
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
    console.log('📁 Saving pet:', pet);
    ensureDataDirectoryExists();
    const pets = loadPets();
    pets.push({
      name: pet.name,
      size: pet.size,
      personality: pet.personality,
      animalType: pet.animalType,
      imageUrl: pet.imageUrl || '',
    });
    console.log('📁 Writing updated pets:', pets);
    fs.writeFileSync(filePath, JSON.stringify(pets, null, 2), 'utf-8');
  } catch (err) {
    console.error('❌ Failed to write pets.json:', err);
  }
}

// For compatibility
export { loadPets as getAllPets };
