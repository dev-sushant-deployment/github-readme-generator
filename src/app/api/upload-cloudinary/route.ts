import { basePath, IMAGE_NAME_PREFIX } from "@/constants";
import cloudinary from "@/helper/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) throw new Error("id is required");
    const imagePath = join(basePath, IMAGE_NAME_PREFIX+id+'.png')
    const result = await cloudinary.uploader.upload(imagePath);
    return new NextResponse(result.secure_url, { status: 201 });
  } catch {
    return new NextResponse("Error uploading image", { status: 500 });
  }
}