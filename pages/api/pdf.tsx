// /pages/api/pdf.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function getColorForType(type: string) {
  if (/amour/i.test(type)) return rgb(0.6, 0.1, 0.2);
  if (/excuse/i.test(type)) return rgb(0.4, 0.2, 0.0);
  if (/motivation|professionnel/i.test(type)) return rgb(0.0, 0.2, 0.6);
  if (/cv/i.test(type)) return rgb(0, 0, 0);
  if (/tinder/i.test(type)) return rgb(0.9, 0.2, 0.5);
  if (/remerciement/i.test(type)) return rgb(0.1, 0.5, 0.2);
  return rgb(0.2, 0.2, 0.2);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { content, name, type, includeName, includeDate } = req.body;

  if (!content) return res.status(400).json({ error: 'Contenu manquant' });

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const fontSize = 13;
    const margin = 50;
    const lineHeight = fontSize * 1.6;

    const textColor = getColorForType(type);

    const paragraphs = content
      .replace(/\[.*?\]/g, '')
      .split(/\n{2,}/)
      .map((p: string) => p.trim())
      .filter(Boolean);

    let y = height - margin;

    for (const para of paragraphs) {
      const words = para.split(/\s+/);
      let line = '';
      for (const word of words) {
        const testLine = line + word + ' ';
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (textWidth > width - 2 * margin) {
          const lineX = (width - font.widthOfTextAtSize(line.trim(), fontSize)) / 2;
          page.drawText(line.trim(), { x: lineX, y, size: fontSize, font, color: textColor });
          y -= lineHeight;
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      if (line.trim() !== '') {
        const lineX = (width - font.widthOfTextAtSize(line.trim(), fontSize)) / 2;
        page.drawText(line.trim(), { x: lineX, y, size: fontSize, font, color: textColor });
        y -= lineHeight;
      }
      y -= lineHeight / 2;
    }

    const signatureLines: string[] = [];
    if (includeName && name?.trim()) signatureLines.push(name.trim());
    if (includeDate) signatureLines.push(new Date().toLocaleDateString('fr-FR'));

    const sigFontSize = 11;
    let sigY = margin + signatureLines.length * lineHeight;

    for (let i = signatureLines.length - 1; i >= 0; i--) {
      const sig = signatureLines[i];
      const sigWidth = font.widthOfTextAtSize(sig, sigFontSize);
      page.drawText(sig, {
        x: width - margin - sigWidth,
        y: sigY,
        size: sigFontSize,
        font,
        color: rgb(0.3, 0.3, 0.3),
      });
      sigY -= lineHeight;
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=lettre.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la génération du PDF' });
  }
}
