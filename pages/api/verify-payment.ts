// /pages/api/verify-payment.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { sessionId } = req.body;

  if (!sessionId) return res.status(400).json({ error: 'Session ID manquant' });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.json({ paid: false });
    }

    return res.json({
      paid: true,
      type: session.metadata?.type || '',
      details: session.metadata?.details || '',
      auteur: session.metadata?.auteur || '',
      includeName: session.metadata?.includeName === 'true',
      includeDate: session.metadata?.includeDate === 'true',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur lors de la vérification' });
  }
}
