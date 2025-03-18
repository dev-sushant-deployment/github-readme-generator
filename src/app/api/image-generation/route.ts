import { basePath, IMAGE_NAME_PREFIX } from "@/constants";
import { imageGenerationModel } from "@/helper/gemini-ai";
import { writeFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  try {
    const prompt = req.nextUrl.searchParams.get('prompt');
    if (!prompt) {
      throw new Error("Prompt is required");
    }
    const response = await imageGenerationModel.generateContent(prompt);
    const candidates = response.response.candidates as { content: { parts: { text?: string; inlineData?: { data: string } }[] } }[];
    const part = candidates?.[0]?.content.parts[0];
    if (part.text) {
      console.log(part.text);
      throw new Error("Text content not supported");
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, 'base64');
      const id = uuidv4();
      const filename = `${IMAGE_NAME_PREFIX}${id}.png`;
      const path = join(basePath, filename);
      writeFileSync(path, buffer);
      console.log(`Image saved as ${filename}`);
      return new NextResponse(id, { status: 201, headers: { 'Content-Type': 'application/json' } });
    }
    return new NextResponse("No content generated", { status: 404 });
  } catch (error) {
    console.error("Error generating content:", error);
    return new NextResponse("Error generating content", { status: 500 });
  }
}