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
  const envPath = process.env.PETS_JSON_PATH;
  if (envPath) {
    const fullPath = path.isAbsolute(envPath)
      ? envPath
      : path.join(process.cwd(), envPath);
    console.log('📁 Using .env path:', fullPath);
    return fullPath;
  }

  const fallbackPath = path.join(process.cwd(), 'data', 'pets.json');
  console.log('📁 Using fallback path:', fallbackPath);
  return fallbackPath;
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
