'use client';

import React, { useState } from 'react';

const FormulaireLettre: React.FC = () => {
  const [texte, setTexte] = useState('');
  const [titre, setTitre] = useState('LettreProfessionnelle');
  const [chargement, setChargement] = useState(false);

  const handleDownloadPDF = async () => {
    if (!texte.trim()) {
      alert('Veuillez rédiger votre lettre.');
      return;
    }

    setChargement(true);

    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: texte, type: titre }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || 'Erreur lors de la génération du PDF.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${titre || 'lettre'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      alert('Erreur : ' + error.message);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Générateur de Lettre PDF
      </h1>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Nom du fichier
        </label>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
          placeholder="Ex. Lettre de motivation"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Contenu de la lettre
        </label>
        <textarea
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          rows={10}
          className="w-full px-3 py-2 border rounded-lg shadow-sm resize-none focus:outline-none focus:ring focus:border-blue-500"
          placeholder="Écrivez votre lettre ici..."
        />
      </div>

      <button
        onClick={handleDownloadPDF}
        disabled={chargement}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
      >
        {chargement ? 'Génération en cours...' : 'Télécharger la lettre en PDF'}
      </button>
    </div>
  );
};

export default FormulaireLettre;
