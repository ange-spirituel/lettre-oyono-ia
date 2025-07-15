import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  content?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  const { name, includeDate } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Le champ "name" est requis et doit être une chaîne de caractères.' });
  }

  const date = new Date().toLocaleDateString('fr-FR');
  const letter = `
${includeDate ? `Le ${date}\n\n` : ''}
Bonjour ${name},

Merci de votre confiance.

Voici votre lettre personnalisée.

Cordialement,
L’équipe.
  `;

  return res.status(200).json({ content: letter.trim() });
}
