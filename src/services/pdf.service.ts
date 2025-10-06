import PDFParser from "pdf2json";

export async function extractPdfRangeText(
  filePath: string,
  from: number,
  to: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      const pages: string[] = [];
      const first = Math.max(0, from - 1); // 0-indexed
      const last = Math.min(to - 1, pdfData.Pages.length - 1);

      for (let i = first; i <= last; i++) {
        const page = pdfData.Pages[i];
        if (page && page.Texts) {
          const pageText = page.Texts.map((text: any) => {
            return text.R.map((r: any) => decodeURIComponent(r.T)).join(" ");
          }).join(" ");
          pages.push(pageText);
        }
      }

      resolve(pages.join("\n\n"));
    });

    pdfParser.loadPDF(filePath);
  });
}
