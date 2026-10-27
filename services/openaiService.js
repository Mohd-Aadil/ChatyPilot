// import OpenAI from "openai";
// import dotenv from "dotenv";

// dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const openaiResponse = async (messages) => {
//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages,
//     temperature: 0.7,
//   });

//   return response.choices[0].message.content;
// };
export const openaiResponse = async (contents) => {
   return "OpenAI placeholder";
};