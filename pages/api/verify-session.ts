// ✅ 2. /api/verify-session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session_id = req.query.session_id as string;
  if (!session_id) return res.status(400).json({ paid: false });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paid = session.payment_status === 'paid';
    res.status(200).json({ paid });
  } catch (err) {
    res.status(500).json({ paid: false });
  }
}