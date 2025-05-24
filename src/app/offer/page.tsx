'use client';

import { useState } from 'react';

export default function OfferPet() {
  const [form, setForm] = useState({
    name: '',
    size: '',
    personality: '',
    animalType: '',
    image: null as File | null,
  });

  const commonAnimals = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', form.name);
    data.append('size', form.size);
    data.append('personality', form.personality);
    data.append('animalType', form.animalType);
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
    <div className="min-h-screen w-full flex items-center justify-center relative">
      {/* Full-screen background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80"
          alt="People with pets background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Centered form content */}
      <div className="relative z-10 w-full max-w-lg p-6 sm:p-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl mx-4">
        <div className="text-center mb-6">
          <div className="text-4xl">🐶 🐱 🐰 🐦</div>
          <h1 className="text-3xl font-bold text-pink-600 mt-2">Offer a Pet for Adoption</h1>
          <p className="text-gray-700 mt-1">Help us find a loving home for your pet. Fill out the form below.</p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Pet Name"
            className="px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <select
            className="px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
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
            placeholder="Animal Type (e.g. Dog, Cat)"
            list="animal-types"
            className="px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            onChange={(e) => setForm({ ...form, animalType: e.target.value })}
            required
          />
          <datalist id="animal-types">
            {commonAnimals.map((animal) => (
              <option key={animal} value={animal} />
            ))}
          </datalist>
          <input
            type="text"
            placeholder="Personality"
            className="px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            onChange={(e) => setForm({ ...form, personality: e.target.value })}
            required
          />
          <input
            type="file"
            accept="image/*"
            className="px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setForm({ ...form, image: file });
            }}
            required
          />
          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full transition-all shadow-md mt-2"
          >
            Submit for Adoption
          </button>
        </form>
      </div>
    </div>
  );
}
