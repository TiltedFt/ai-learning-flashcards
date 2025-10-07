import fs from "fs";
import { PDFParse } from "pdf-parse";

export async function extractPdfRangeText(
  filePath: string,
  from: number,
  to: number
): Promise<string> {
  console.time("extractPdfRangeText");

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });

    const result = await parser.getText({
      first: from,
      last: to,
    });

    console.timeEnd("extractPdfRangeText");
    return result.text;
  } catch (error) {
    console.timeEnd("extractPdfRangeText");
    throw error;
  }
}
