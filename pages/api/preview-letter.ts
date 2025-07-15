// /pages/api/preview-letter.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt, type } = req.body;

  if (!prompt || !type) return res.status(400).json({ error: 'Missing prompt or type' });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';
    res.status(200).json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
