// /pages/api/after-payment.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { generatePDF } from '@/utils/create-pdf';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { session_id } = req.body;

  if (!session_id || typeof session_id !== 'string') {
    return res.status(400).json({ error: 'Session manquante' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const metadata = session.metadata!;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: metadata.type,
        details: metadata.details,
        auteur: metadata.auteur
      }),
    });

    const data = await response.json();

    const pdfBuffer = await generatePDF(
      data.letter,
      metadata.type,
      metadata.name,
      metadata.includeName === '1',
      metadata.includeDate === '1'
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=lettre.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erreur récupération Stripe:', error);
    res.status(500).json({ error: 'Échec génération PDF après paiement.' });
  }
}

