// /pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { type, details } = req.body;

  if (!type || !details) return res.status(400).json({ error: 'Paramètres manquants' });

  try {
    const prompt = `Génère une lettre de type "${type}" avec ces informations:\n${details}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const letter = completion.choices[0].message.content || 'Contenu non généré.';

    res.status(200).json({ letter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la génération de la lettre' });
  }
}
