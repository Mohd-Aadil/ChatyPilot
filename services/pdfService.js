import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

export const extractPDFText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getText();
  return result.text;
};

export const splitTextIntoChunk = (text, chunkSize = 1000) => {
  const chunks = [];

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text?.slice(i, i + chunkSize));
  }
  // console.log("chunks", chunks);
  return chunks;
};
