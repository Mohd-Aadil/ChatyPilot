import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// const models = ["gemini-2.5-flash", "gemini-1.5-flash"];

export const geminiResponse = async (message) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    return response.text;
  } catch (error) {
    // 🔥 Normalize Gemini error
    throw {
      message: error?.message || error?.error?.message || "AI service error",

      status: error?.status || 500,
      type: "AI_API_ERROR",

      raw: error, // optional (for debugging)
    };
  }
};
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const getAIResponse = async (message) => {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash",
//   });

//   const result = await model.generateContent({
//     contents: [
//       {
//         role: "user",
//         parts: [{ text: message }],
//       },
//     ],
//   });

//   const response = await result.response;

//   return response.text();
// };
