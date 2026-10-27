import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const PDFChunk = sequelize.define("PDFChunk", {
  pdfId: {
    type: DataTypes.INTEGER,
  },
  content: {
    type: DataTypes.TEXT("long"),
  },
  embedding: {
    type: DataTypes.JSON,
  },
  chunkIndex: {
    type: DataTypes.INTEGER,
  },
  pdfFileName: {
    type: DataTypes.STRING,
  },
});
