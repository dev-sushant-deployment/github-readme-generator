"use server";

import { db } from "@/lib/db";
import axios from "axios";

export const getImage = async (prompt: string) => {
  const { data: id } = await axios.get(`${process.env.DOMAIN}/api/image-generation?prompt=${prompt}`);
  const { data: url } = await axios.get(`${process.env.DOMAIN}/api/upload-cloudinary?id=${id}`);
  return url;
}

export const generateAllImages = async (id: string) => {
  try {
    const commit = await db.commit.findFirst({
      where: {
        id
      },
      select: {
        markdown: true
      }
    });
    if (!commit) return;
    let { markdown } = commit;
    if (!markdown) return;
    const imageRegex = /!\[(.*?)\]\((\d+)\)/g;
    const images = [];
    let match;

    while ((match = imageRegex.exec(markdown)) !== null) {
      images.push({ position: match[2], prompt: match[1] });
    }

    for (const image of images) {
      const url = await getImage(image.prompt);
      if (markdown) {
        markdown = markdown.replace(
          `![${image.prompt}](${image.position})`,
          `![${image.prompt}](${url})`
        );
      }
    }

    await db.commit.update({
      where: {
        id
      },
      data: {
        markdown
      }
    });
  } catch {
    return;
  }
}