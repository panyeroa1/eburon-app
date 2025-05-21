'use client';

import { useState } from 'react';

export default function OfferPet() {
  const [form, setForm] = useState({
    name: '',
    size: '',
    personality: '',
    image: null as File | null,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', form.name);
    data.append('size', form.size);
    data.append('personality', form.personality);
    if (form.image) {
      data.append('image', form.image);
    }

    const res = await fetch('/api/pets', {
      method: 'POST',
      body: data,
    });

    const json = await res.json();
    alert('Pet submitted!');
    console.log(json);
  };

  return (
    <form onSubmit={submit} className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Offer a Pet for Adoption</h2>
      <input
        type="text"
        placeholder="Pet Name"
        className="border p-2 w-full"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <select
        className="border p-2 w-full"
        onChange={(e) => setForm({ ...form, size: e.target.value })}
        required
      >
        <option value="">Select Size</option>
        <option value="Small">Small</option>
        <option value="Medium">Medium</option>
        <option value="Large">Large</option>
      </select>
      <input
        type="text"
        placeholder="Personality"
        className="border p-2 w-full"
        onChange={(e) => setForm({ ...form, personality: e.target.value })}
        required
      />
      <input
        type="file"
        accept="image/*"
        className="border p-2 w-full"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setForm({ ...form, image: file });
        }}
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Submit
      </button>
    </form>
  );
}
