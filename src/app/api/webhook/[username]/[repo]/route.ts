import { db } from "@/lib/db";
import { CommitStatus } from "@prisma/client";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface WebhookRouteParams {
  params: Promise <{
    username: string;
    repo: string;
  }>
}

export async function POST(req : NextRequest, { params } : WebhookRouteParams) {
  const { username, repo } = await params;
  const rawBody = await req.text();
  if (!rawBody) return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  try {
    const { ref, head_commit } = JSON.parse(rawBody);
    if (!ref || !head_commit) return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    const { id : sha } = head_commit;
    if (ref !== "refs/heads/main") return NextResponse.json({ message: "Not a main branch push" });
    let commitId : string | undefined;
    try {
      const user = await db.user.findFirst({
        where: {
          username
        },
        select: {
          id: true,
          pat: true
        }
      });
      if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
      const { id, pat } = user;
      const { data : { files, commit : { message } } } = await axios.get(`https://api.github.com/repos/${username}/${repo}/commits/${sha}`, {
        headers: {
          'Authorization': `token ${pat}`
        }
      });
      const repoData = await db.repo.findFirst({
        where: {
          ownerId: id,
          name: repo
        }
      });
      if (!repoData) return NextResponse.json({ message: "Repository not found" }, { status: 404 });
      const { id : repoId } = repoData;
      const commit = await db.commit.create({
        data: {
          message,
          status: CommitStatus.CHECKING,
          authorId: id,
          repoId
        }
      })
      commitId = commit.id;
      const readmeFile = files.find(({ filename, status } : { filename : string, status : string }) => filename === "README.md" && status !== "removed");
      if (!readmeFile) {
        console.log("No README.md file found");
        await axios.post(`${process.env.DOMAIN}/api/webhook/${username}/${repo}/update-readme`, { files, commitId });
      }
      else {
        const { data : { content } } = await axios.get(`https://api.github.com/repos/${username}/${repo}/contents/README.md`, {
          headers: {
            'Authorization': `token ${pat}`
          }
        });
        const readmeContent = Buffer.from(content, 'base64').toString();
        await db.commit.update({
          where: {
            id: commitId
          },
          data: {
            markdown: readmeContent,
            status: CommitStatus.UPDATED
          }
        });
      }
      return NextResponse.json({ message: "Commit received" });
    } catch (error) {
      if (commitId) await db.commit.update({
        where: {
          id: commitId
        },
        data: {
          status: CommitStatus.FAILED
        }
      });
      if (error instanceof Error) return NextResponse.json({ message: error.message }, { status: 500 });
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  } catch (error) {
    console.log("error", error);
    if (error instanceof Error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}