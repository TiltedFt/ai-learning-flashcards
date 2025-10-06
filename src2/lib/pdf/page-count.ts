import { promises as fs } from "fs";
import { PDFDocument } from "pdf-lib";

export async function getPdfPageCount(absPath: string): Promise<number> {
  const bytes = await fs.readFile(absPath);
  const pdf = await PDFDocument.load(bytes, {
    ignoreEncryption: false,
    throwOnInvalidObject: false,
    updateMetadata: false,
  });
  return pdf.getPageCount();
}
