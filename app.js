import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import chatRoutes from "./routes/chatRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadPdfRoutes from "./routes/uploadPdfRoutes.js";
import { initDB } from "./models/index.js";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const app = express();

app.use(express.json());
app.use("/api", chatRoutes);
app.use("/api", authRoutes);
app.use("/api", uploadPdfRoutes);

app.use("/api", pdfRoutes);

const startServer = async () => {
  await initDB();

  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

startServer();
