import { savePet } from '../../../../lib/pets';
import { uploadToS3 } from '../../../../lib/s3';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string | null;
    const size = formData.get('size') as string | null;
    const personality = formData.get('personality') as string | null;
    const imageFile = formData.get('image') as File | null;

    if (!name || !size || !personality || !imageFile) {
      console.warn('Missing one or more fields:', { name, size, personality, imageFile });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const imageUrl = await uploadToS3(imageFile.name, buffer);

    const pet = { name, size, personality, image: imageUrl };
    savePet(pet);

    return NextResponse.json({ message: 'Pet saved', pet });
  } catch (err) {
    console.error('UPLOAD FAILED:', err);
    return NextResponse.json(
      { error: 'Failed to save pet', details: String(err) },
      { status: 500 }
    );
  }
}

