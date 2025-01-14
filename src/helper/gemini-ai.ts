import { GEMINI_AI_MODEL } from "@/constants"
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GOOGLE_GEN_AI_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_GEN_AI_API_KEY is not defined")
}

const genAi = new GoogleGenerativeAI(apiKey)

export const model = genAi.getGenerativeModel({ model:  GEMINI_AI_MODEL })