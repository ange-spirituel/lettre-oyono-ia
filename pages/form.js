
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({ destinataire: '', contexte: '', emotion: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(data.letter || 'Erreur');
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Remplissez le formulaire</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="destinataire" placeholder="Nom du destinataire" onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="contexte" placeholder="Contexte" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="emotion" placeholder="Émotion (amour, regret...)" onChange={handleChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Générer</button>
      </form>
    </div>
  );
}
