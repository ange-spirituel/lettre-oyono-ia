import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function SuccessPage() {
  const router = useRouter();
  const { type, details, auteur } = router.query;

  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type && details) {
      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, details, auteur }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLetter(data.letter);
          setLoading(false);
        });
    }
  }, [type, details]);

  const downloadPDF = async () => {
    const res = await fetch('/api/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: letter, type, name: auteur, includeName: !!auteur, includeDate: true }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lettre.pdf';
    a.click();
  };

  if (loading) return <p className="p-10 text-center text-xl">Génération en cours...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Votre lettre est prête !</h1>
      <pre className="bg-gray-100 p-4 whitespace-pre-wrap rounded text-gray-800">{letter}</pre>
      <button
        onClick={downloadPDF}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Télécharger la lettre en PDF
      </button>
    </div>
  );
}
