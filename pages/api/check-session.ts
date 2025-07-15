import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Méthode non autorisée');

  const { session_id } = req.query;

  if (!session_id || typeof session_id !== 'string') {
    return res.status(400).json({ error: 'ID de session manquant ou invalide' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    const metadata = session.metadata || {};

    return res.status(200).json({
      prompt: metadata.prompt,
      type: metadata.type,
      auteur: metadata.auteur || '',
      includeDate: metadata.includeDate === '1',
    });
  } catch (error) {
    console.error('Erreur session Stripe:', error);
    return res.status(500).json({ error: 'Erreur serveur lors de la récupération de session' });
  }
}
