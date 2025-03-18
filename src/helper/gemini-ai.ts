import { GEMINI_AI_FILE_SELECTION_MODEL, GEMINI_AI_MODEL } from "@/constants"
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GOOGLE_GEN_AI_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_GEN_AI_API_KEY is not defined")
}

const genAi = new GoogleGenerativeAI(apiKey)

export const model = genAi.getGenerativeModel({ model:  GEMINI_AI_MODEL })

const fileSelectionApiKey = process.env.GOOGLE_FILE_SELECTION_API_KEY;
if (!fileSelectionApiKey) {
  throw new Error("GOOGLE_FILE_SELECTION_API_KEY is not defined")
}

const fileSelectionAi = new GoogleGenerativeAI(fileSelectionApiKey)
export const fileSelectionModel = fileSelectionAi.getGenerativeModel({ model: GEMINI_AI_FILE_SELECTION_MODEL })

const imageGenerationApiKey = process.env.GOOGLE_IMAGE_GENERATION_API_KEY;
if (!imageGenerationApiKey) {
  throw new Error("GOOGLE_IMAGE_GENERATION_API_KEY is not defined")
}

const imageGenerationAi = new GoogleGenerativeAI(imageGenerationApiKey)
export const imageGenerationModel = imageGenerationAi.getGenerativeModel({
  model: "gemini-2.0-flash-exp-image-generation",
  generationConfig: {
    // @ts-ignore
    responseModalities: ['Text', 'Image']
  },
});