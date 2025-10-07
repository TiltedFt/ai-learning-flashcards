import PDFParser from "pdf2json";

interface PDFParserError {
  parserError: Error;
}

interface PDFText {
  R: Array<{ T: string }>;
}

interface PDFPage {
  Texts: PDFText[];
}

interface PDFData {
  Pages: PDFPage[];
}

export async function extractPdfRangeText(
  filePath: string,
  from: number,
  to: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: Error | PDFParserError) => {
      if ('parserError' in errData) {
        reject(errData.parserError);
      } else {
        reject(errData);
      }
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: PDFData) => {
      const pages: string[] = [];
      const first = Math.max(0, from - 1); // 0-indexed
      const last = Math.min(to - 1, pdfData.Pages.length - 1);

      for (let i = first; i <= last; i++) {
        const page = pdfData.Pages[i];
        if (page && page.Texts) {
          const pageText = page.Texts.map((text: PDFText) => {
            return text.R.map((r) => decodeURIComponent(r.T)).join(" ");
          }).join(" ");
          pages.push(pageText);
        }
      }

      resolve(pages.join("\n\n"));
    });

    pdfParser.loadPDF(filePath);
  });
}
