import { claudeResponse } from "./claudeService.js";
import { openaiResponse } from "./openaiService.js";
import { geminiResponse } from "./geminiService.js";

export const getAIResponse = async (provider, contents) => {
  console.log("getAIResponse", provider, contents);
  switch (provider) {
    case "gemini":
      return geminiResponse(contents);

    case "openai":
      return openaiResponse(contents);

    case "claude":
      return claudeResponse(contents);

    default:
      throw new Error("Invalid AI provider");
  }
};
