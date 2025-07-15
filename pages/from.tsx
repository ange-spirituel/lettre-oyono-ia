import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function FormPage() {
  const [subject, setSubject] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const sessionId = router.query.session_id as string | undefined;

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) return;

      try {
        const res = await fetch(`/api/check-session?session_id=${sessionId}`);
        const data = await res.json();

        if (data.paid) {
          setChecking(false);
        } else {
          router.push('/checkout');
        }
      } catch (error) {
        console.error('Erreur de vérification Stripe :', error);
        router.push('/checkout');
      }
    };

    verifyPayment();
  }, [sessionId, router]);

  const handleGenerate = async () => {
    if (!subject.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject }),
      });

      const data = await res.json();
      setResult(data.text);
    } catch (error) {
      console.error('Erreur lors de la génération :', error);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">🔄 Vérification du paiement en cours...</p>
      </div>
    );
  }

  return (
    <Layout>
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">📄 Générez votre lettre avec Lettre OYONO IA</h1>

        <input
          type="text"
          placeholder="Ex : Lettre de motivation pour un stage"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full max-w-md border p-3 rounded mb-4 shadow"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-yellow-400 text-black px-6 py-2 rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? '✍️ Génération en cours...' : 'Générer'}
        </button>

        {result && (
          <div className="mt-8 w-full max-w-2xl bg-white shadow p-6 rounded-lg text-left whitespace-pre-line border">
            {result}
          </div>
        )}
      </main>
    </Layout>
  );
}
