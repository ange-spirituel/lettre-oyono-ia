// ✅ 4. /api/pdf.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { content, name, type, includeName, includeDate } = req.body;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  const text = [];
  if (includeDate) text.push(new Date().toLocaleDateString());
  if (includeName && name) text.push(`Par: ${name}`);
  text.push(`\nTitre: ${type}\n`);
  text.push(content);

  page.drawText(text.join('\n'), {
    x: 50,
    y: height - 50,
    size: 12,
    font,
    color: rgb(0, 0, 0),
    lineHeight: 16,
    maxWidth: 500
  });

  const pdfBytes = await pdfDoc.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=lettre.pdf');
  res.send(Buffer.from(pdfBytes));
}