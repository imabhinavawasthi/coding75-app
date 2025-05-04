import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

export async function watermarkAndDownloadPDF(originalPdfBytes, name, email, phone) {
  const watermarkText = `© ${name} | ${email} | ${phone}`;
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const page of pages) {
    const { width, height } = page.getSize();

    const fontSize = 14;
    const rows = 3;
    const cols = 3;
    const xGap = width / cols;
    const yGap = height / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * xGap;
        const y = row * yGap;

        page.drawText(watermarkText, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.6, 0.6, 0.6), // light gray
          rotate: { type: 'degrees', angle: 30 },
          opacity: 0.20,
        });
      }
    }
  }

  const modifiedPdfBytes = await pdfDoc.save();
  const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url);
  // saveAs(blob, 'watermarked_notes.pdf');
}
