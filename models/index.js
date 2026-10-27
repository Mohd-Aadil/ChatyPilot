import { sequelize } from "../config/db.js";
import { Chat } from "./chatModel.js";
import { Conversation } from "./conversationModel.js";

import { pdf } from "./pdfModel.js";
import { PDFChunk } from "./pdfChunkModel.js";

// 🔥 Associations
Conversation.hasMany(Chat, {
  foreignKey: "conversationId",
});

Chat.belongsTo(Conversation, {
  foreignKey: "conversationId",
});

// 🔥 PDF Associations
pdf.hasMany(PDFChunk, {
  foreignKey: "pdfId",
  onDelete: "CASCADE",
});

PDFChunk.belongsTo(pdf, {
  foreignKey: "pdfId",
});

// 🔥 Sync DB
export const initDB = async () => {
  await sequelize.sync();
  // await sequelize.sync({ alter: true });
};
