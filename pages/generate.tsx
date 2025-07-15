// /pages/generate.tsx
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const modelsWithQuestions: Record<string, string[]> = {
  'Lettre de motivation': [
    "Quel poste visez-vous ?",
    "Quelles sont vos compétences clés ?",
    "Pourquoi cette entreprise vous intéresse-t-elle ?",
    "Avez-vous une expérience à valoriser ?"
  ],
  'Email professionnel': [
    "Quel est le sujet de l'email ?",
    "À qui est destiné cet email ?",
    "Quel est le but de votre message ?",
    "Souhaitez-vous inclure une formule de politesse ?"
  ],
  'Bio LinkedIn': [
    "Quel est votre domaine professionnel ?",
    "Quelles sont vos compétences principales ?",
    "Quel ton souhaitez-vous (formel, créatif, direct...) ?",
    "Souhaitez-vous inclure vos objectifs pro ?"
  ],
  'Message de relance': [
    "À qui vous adressez-vous ?",
    "Pourquoi souhaitez-vous relancer cette personne ?",
    "Quel est le message principal ?",
    "Voulez-vous proposer une action concrète ?"
  ],
  'Lettre d’excuse': [
    "À qui est destinée cette lettre ?",
    "Quel est l'objet de vos excuses ?",
    "Souhaitez-vous ajouter un geste de réparation ?",
    "Comment vous sentez-vous ?"
  ],
  'Lettre d’amour': [
    "À qui est destinée cette lettre ?",
    "Pourquoi écrivez-vous cette lettre ?",
    "Quel souvenir marquant souhaitez-vous évoquer ?",
    "Que ressentez-vous en ce moment ?"
  ],
  'Lettre de rupture': [
    "Pourquoi mettez-vous fin à la relation ?",
    "Qu'aimeriez-vous dire à cette personne ?",
    "Souhaitez-vous garder un bon souvenir ?",
    "Quel ton souhaitez-vous (doux, ferme, neutre...) ?"
  ],
  'Lettre de remerciement': [
    "À qui adressez-vous vos remerciements ?",
    "Pourquoi souhaitez-vous remercier cette personne ?",
    "Y a-t-il un moment ou geste particulier que vous voulez mentionner ?"
  ],
  'Message à un client': [
    "Quel est le sujet du message ?",
    "Quel est le nom ou type de client ?",
    "Quel ton souhaitez-vous (chaleureux, professionnel...) ?"
  ],
  'Pitch startup': [
    "Quel est le nom de votre startup ?",
    "Quel problème résout-elle ?",
    "Quelle est votre proposition de valeur unique ?",
    "Souhaitez-vous un ton enthousiaste ou sobre ?"
  ],
  'Description produit': [
    "Quel est le nom du produit ?",
    "À quoi sert-il ?",
    "Quelles sont ses caractéristiques clés ?",
    "Souhaitez-vous un ton vendeur ou informatif ?"
  ],
  'Annonce de recrutement': [
    "Quel poste est à pourvoir ?",
    "Quelles sont les missions ?",
    "Quelles compétences recherchez-vous ?",
    "Souhaitez-vous inclure une touche de culture d’entreprise ?"
  ],
  'Script vidéo TikTok': [
    "Quel est le sujet de la vidéo ?",
    "Quel est le public cible ?",
    "Souhaitez-vous un ton humoristique, éducatif, choc ?",
    "Durée ou format souhaité ?"
  ],
  'Publication LinkedIn': [
    "Quel est le message que vous souhaitez partager ?",
    "Quel est le public visé ?",
    "Souhaitez-vous inclure un appel à l'action ?",
    "Quel ton voulez-vous adopter ?"
  ],
  'Lettre à un ami': [
    "À qui est destinée cette lettre ?",
    "Quel souvenir ou nouvelle souhaitez-vous partager ?",
    "Souhaitez-vous un ton nostalgique, drôle, sincère ?"
  ],
  'Lettre de départ': [
    "Pourquoi partez-vous ?",
    "Que souhaitez-vous dire à vos collègues ou à l'entreprise ?",
    "Souhaitez-vous un ton chaleureux, professionnel ou neutre ?"
  ],
  'Réponse à une critique': [
    "Quelle critique avez-vous reçue ?",
    "Souhaitez-vous répondre calmement, fermement ou avec humour ?",
    "Quel message principal voulez-vous faire passer ?"
  ],
  'Email de candidature spontanée': [
    "Quel poste recherchez-vous ?",
    "Quelles sont vos compétences clés ?",
    "Pourquoi cette entreprise vous attire-t-elle ?",
    "Souhaitez-vous un ton dynamique, sobre ou passionné ?"
  ],
  'Message Tinder': [
    "Quel est votre objectif (séduction, humour, rencontre sérieuse...) ?",
    "Souhaitez-vous faire une référence à son profil ?",
    "Quel ton souhaitez-vous (drôle, mystérieux, direct...) ?"
  ]
};

const models = Object.keys(modelsWithQuestions);

export default function Generate() {
  const [type, setType] = useState(models[0]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [includeNameInPdf, setIncludeNameInPdf] = useState(false);
  const [includeDate, setIncludeDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    const stripe = await stripePromise;
    const details = modelsWithQuestions[type].map((q, i) => `${q} ${answers[i] || ''}`).join('\n');

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        details,
        auteur: authorName,
        includeName: includeNameInPdf,
        includeDate
      })
    });

    const session = await response.json();

    if (session?.id) {
      await stripe?.redirectToCheckout({ sessionId: session.id });
    } else {
      alert('Erreur lors de la création de la session de paiement.');
    }
    setLoading(false);
  };

  useEffect(() => {
    async function checkPayment() {
      const url = new URL(window.location.href);
      const sessionId = url.searchParams.get('session_id');
      if (!sessionId) return;

      setLoading(true);
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();

      if (data.paid) {
        setHasPaid(true);
        // Extraire les données de la session pour générer la lettre
        const { type, details, auteur, includeName, includeDate } = data;

        // Génération lettre + PDF
        const genRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, details }),
        });
        const genData = await genRes.json();

        const pdfRes = await fetch('/api/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: genData.letter,
            name: includeName ? auteur : '',
            type,
            includeName,
            includeDate
          }),
        });

        const blob = await pdfRes.blob();
        const urlBlob = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = 'lettre.pdf';
        a.click();

        setLoading(false);
      } else {
        setLoading(false);
      }
    }

    checkPayment();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Head>
        <title>Générateur – ProPrompt Oyono IA</title>
      </Head>
      <h1 className="text-2xl font-bold mb-4 text-center">Générez une lettre personnalisée</h1>

      <label className="block font-semibold mb-1">Choisissez un modèle :</label>
      <select
        value={type}
        onChange={(e) => {
          setType(e.target.value);
          setAnswers([]);
          setHasPaid(false);
        }}
        className="w-full border p-2 rounded mb-4"
      >
        {models.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {modelsWithQuestions[type]?.map((q, i) => (
        <div key={i} className="mb-3">
          <label className="block font-medium mb-1">{q}</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={answers[i] || ''}
            onChange={(e) => handleChange(i, e.target.value)}
            disabled={hasPaid}
          />
        </div>
      ))}

      <div className="mb-4">
        <label className="block font-medium">Nom de l'auteur (facultatif)</label>
        <input
          className="w-full border p-2 rounded"
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          disabled={hasPaid}
        />
        <label className="inline-flex items-center mt-2">
          <input
            type="checkbox"
            className="mr-2"
            checked={includeNameInPdf}
            onChange={(e) => setIncludeNameInPdf(e.target.checked)}
            disabled={hasPaid}
          />
          Inclure ce nom dans le PDF
        </label>
      </div>

      <div className="mb-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={includeDate}
            onChange={(e) => setIncludeDate(e.target.checked)}
            disabled={hasPaid}
          />
          Inclure la date dans le PDF
        </label>
      </div>

      {!hasPaid && (
        <button
          onClick={handleStripeCheckout}
          disabled={loading || answers.some((a) => !a || a.trim() === '')}
          className="w-full bg-blue-600 text-white p-3 rounded disabled:opacity-50"
        >
          {loading ? 'Chargement...' : 'Payer 2€ et générer'}
        </button>
      )}

      {hasPaid && (
        <div className="text-green-700 font-semibold text-center">
          Merci pour votre paiement ! Le PDF est téléchargé.
        </div>
      )}
    </div>
  );
}
