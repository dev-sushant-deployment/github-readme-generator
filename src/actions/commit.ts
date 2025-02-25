"use server";

import { PER_PAGE } from "@/constants";
import { db } from "@/lib/db";

export const getCommits = async (username: string, repo: string, page_no: number) => {
  try {
    const repoData = await db.repo.findFirst({
      where: {
        name: repo,
        owner: {
          username
        }
      },
      select: {
        id: true
      }
    });
    if (!repoData) return { error: "Repository not found" };
    const { id } = repoData;
    const commits = await db.commit.findMany({
      where: {
        repoId: id
      },
      take: 10,
      skip: (page_no - 1) * PER_PAGE,
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        message: true,
        status: true,
        createdAt: true,
      }
    });
    return {
      commits
    };
  } catch {
    return { error: "Failed to fetch commits. Please try again later." };
  }
};

export const getCommit = async (commitId: string) => {
  try {
    const commit = await db.commit.findFirst({
      where: {
        id: commitId
      },
      include: {
        repo: {
          select: {
            name: true,
          }
        },
        author: {
          select: {
            username: true
          }
        }
      }
    });
    if (!commit) return { error: "Commit not found" };
    return {
      commit
    };
  } catch {
    return { error: "Failed to fetch commit. Please try again later." };
  }
}

export const updateMarkdown = async (commitId: string, markdown: string) => {
  try {
    await db.commit.update({
      where: {
        id: commitId
      },
      data: {
        markdown
      }
    });
    return {
      success: true
    };
  } catch {
    return { error: "Failed to update commit. Please try again later." };
  }
}