import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function getColorForType(type: string) {
  if (/amour/i.test(type)) return rgb(0.6, 0.1, 0.2);
  if (/excuse/i.test(type)) return rgb(0.4, 0.2, 0.0);
  if (/motivation|professionnel/i.test(type)) return rgb(0.0, 0.2, 0.6);
  if (/cv/i.test(type)) return rgb(0, 0, 0);
  if (/tinder/i.test(type)) return rgb(0.9, 0.2, 0.5);
  if (/remerciement/i.test(type)) return rgb(0.1, 0.5, 0.2);
  return rgb(0.2, 0.2, 0.2);
}

async function generateText(prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  return completion.choices[0].message.content?.trim() ?? 'Lettre générée vide.';
}

export async function createPdfBuffer({
  prompt,
  type,
  auteur,
  includeDate,
}: {
  prompt: string;
  type: string;
  auteur?: string;
  includeDate?: boolean;
}): Promise<Buffer> {
  const content = await generateText(prompt);

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
    .map((p) => p.trim())
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

  // Signature et date
  const signatureLines: string[] = [];
  if (auteur?.trim()) signatureLines.push(auteur.trim());
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
  return Buffer.from(pdfBytes.buffer); // ✅ plus robuste
}
