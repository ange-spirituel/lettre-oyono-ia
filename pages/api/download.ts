import type { NextApiRequest, NextApiResponse } from 'next';
import { generatePDF } from '@/utils/create-pdf';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Méthode non autorisée');

  const { letter, type, name, includeName, includeDate } = req.body;
  if (!letter) return res.status(400).json({ error: 'Lettre manquante' });

  try {
    const pdfBuffer = await generatePDF(letter, type, name, includeName, includeDate);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=lettre.pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la génération du PDF' });
  }
}
