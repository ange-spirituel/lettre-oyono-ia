// /pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { type, details, auteur, includeName, includeDate } = req.body;

  // Ici, au lieu de texte complet, on pourrait envoyer details ou prompt pour générer la lettre après paiement
  // Mais pour simplifier, on envoie les détails (questions + réponses)
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Lettre personnalisée - ${type}`,
            },
            unit_amount: 200, // 2 € en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/generate?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/generate`,
      metadata: {
        type,
        details,
        auteur: auteur || '',
        includeName: String(includeName),
        includeDate: String(includeDate),
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la session' });
  }
}
