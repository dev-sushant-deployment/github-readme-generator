import { generateAllImages } from "@/actions/image";
import { model } from "@/helper/gemini-ai";
import { db } from "@/lib/db";
import { CommitStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface WebhookRouteParams {
  params: Promise <{
    username: string;
    repo: string;
  }>
}

export async function POST(req : NextRequest, { params } : WebhookRouteParams) {
  const { username, repo } = await params;
  const { files, commitId } = await req.json();
  console.log("files", files);
  try {
    const user = await db.user.findFirst({
      where: {
        username
      }
    });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    const latestCommit = await db.commit.findMany({
      where: {
        repo: {
          name: repo
        },
        status: CommitStatus.UPDATED,
        author: {
          username
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 1
    })
    if (latestCommit.length == 0) return NextResponse.json({ error: "No previous commit found" }, { status: 404 });
    const { markdown : readmeContent } = latestCommit[0];
    const prompt = `
      I will provide you with the current README.md content.
      Also I will provide you with the files which have been changed or created, and the patch of the changes.
      I want you to regenerate the README.md content with the new changes.
  
      README.md file should be written in markdown format.
      README.md file should not be too short or too long. It should be concise and informative.
      It should contain all the necessary information about the repository(project).

      Follow the below instruction for images in README.md file:
      - Image will be generated use ai model for image generation.
      - So, you need to provide the prompt for image generation.
      - The prompt should be detailed and clear.
      - Try to use image where necessary.
      - Example : '![Image Generation Prompt](1)' where 1 is the image number.
      - All prompt should be inside the alt text of the image.
      - Prompt should be clear, detailed and complete.
      - Image URL section, i.e () should only contain the image number.
      - You can also use emojis in the prompt.

      - Do not provide prompts explicitly other than inside the alt text of the image.
      - Use images only where necessary and where it makes sense.
  
      Your response should only contain the content of the README.md file.
      - Do not include response in triple backticks.
      - Do not include response in code blocks.
  
      If there are no changes in the README.md file, you can should respond with just a message saying "No changes in README.md file".
  
      Current README.md content:
      ${readmeContent}
  
      Files changed:
      ${files.map(({ filename, patch } : { filename : string, patch : string }) => 
        filename.split('.').pop() != "md" ?
          `## ${filename}\n\n\`\`\`\n${patch}\n\`\`\``
          :
          ``
      ).join("\n\n")}
    `
    const result = await model.generateContentStream(prompt);
    let markdownContent = "";
    for await (const content of result.stream) {
      const chunk = content.text();
      if (chunk.includes("No changes in README.md file")) {
        await db.commit.update({
          where: {
            id: commitId
          },
          data: {
            status: CommitStatus.NO_CHANGES
          }
        });
        return NextResponse.json({ message: "No changes in README.md file" });
      }
      if (markdownContent.length == 0) {
        await db.commit.update({
          where: {
            id: commitId
          },
          data: {
            status: CommitStatus.GENERATING
          }
        });
      }
      markdownContent += chunk;
    }
    await db.commit.update({
      where: {
        id: commitId
      },
      data: {
        markdown: markdownContent,
        status: CommitStatus.UPDATED
      }
    });
    await generateAllImages(commitId);
    return NextResponse.json({ message: "README.md updated" });
  } catch (error) {
    if (commitId) {
      await db.commit.update({
        where: {
          id: commitId
        },
        data: {
          status: CommitStatus.FAILED
        }
      });
    }
    if (error instanceof Error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}