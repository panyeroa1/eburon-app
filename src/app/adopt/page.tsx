'use client';

import { useState } from 'react';

export default function AdoptPet() {
  const [preferences, setPreferences] = useState('');
  const [result, setResult] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/adopter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferences }),
    });

    const json = await res.json();
    setResult(json.match);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Adopt a Pet</h2>
      <form onSubmit={submit} className="space-y-4">
        <textarea
          placeholder="Describe your lifestyle or home (e.g. I live in a small apartment)..."
          className="w-full p-2 border"
          rows={4}
          onChange={(e) => setPreferences(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">
          Find My Match
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <strong>Suggested Pet:</strong><br />
          {result}
        </div>
      )}
    </div>
  );
}
