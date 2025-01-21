"use server";

import { DEV_WEBHOOK_DOMAIN, INITIAL_COMMIT_MSG, PROD_WEBHOOK_DOMAIN } from "@/constants";
import { db } from "@/lib/db";
import { CommitStatus } from "@prisma/client";
import axios from "axios";
import jwt from "jsonwebtoken";

export const addRepo = async (url: string, access_token: string, markdown? : string) => {
  if (!url.match(/^https:\/\/github.com\/[^/]+\/[^/]+\/?$/)) return { error: "Invalid URL" };
  const [,,,, repo] = url.split('/');
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  const { username, pat } = jwt.verify(access_token, process.env.JWT_SECRET) as { username: string, pat: string };
  if (!username) return { error: "Invalid access token" };
  try {
    const user = await db.user.findFirst({
      where: {
        username
      },
      select: {
        id: true
      }
    });
    if (!user) return { error: "User not found" };
    const { data : repos } = await axios.get(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Authorization: `token ${pat}`
      }
    });
    if (!repos.find(({ name } : { name : string } & unknown) => name.toLowerCase() === repo.toLowerCase())) return { error: "Repository not found" };
    const { id } = user;
    const alreadyExists = await db.repo.findFirst({
      where: {
        ownerId: id,
        name: repo
      }
    });
    if (alreadyExists) return { error: "Repository already added" };
    const addedRepo = await db.repo.create({
      data: {
        name: repo,
        ownerId: id
      }
    });
    if (markdown) {
      await db.commit.create({
        data: {
          message: INITIAL_COMMIT_MSG,
          markdown,
          status: CommitStatus.UPDATED,
          repoId: addedRepo.id,
          authorId: id
        }
      });
    } else {
      const { id : commitId } = await db.commit.create({
        data: {
          message: INITIAL_COMMIT_MSG,
          status: CommitStatus.CHECKING,
          repoId: addedRepo.id,
          authorId: id
        }
      });
      axios.post(`${process.env.DOMAIN}/api/initial-commit/${username}/${repo}`, { commitId });
    }
    const webhookDomain = process.env.NODE_ENV === "development" ? DEV_WEBHOOK_DOMAIN : PROD_WEBHOOK_DOMAIN;
    const webHookUrl = `${webhookDomain}/api/webhook/${username}/${repo}`;
    const data = {
      name: "web",
      active: true,
      events: [
        "push"
      ],
      config: {
        url: webHookUrl,
        content_type: "json"
      }
    }
    await axios.post(`https://api.github.com/repos/${username}/${repo}/hooks`, data, {
      headers: {
        'Authorization': `token ${pat}`,
        'Content-Type': 'application/json'
      }
    });
    return {
      username,
      repo: addedRepo
    };
  } catch (error) {
    console.log("error", error);
    return { error: "Failed to add repository. Please try again later." };
  }
}

export const getRepos = async (username: string) => {
  try {
    const user = await db.user.findFirst({
      where: {
        username
      },
      select: {
        id: true
      }
    });
    if (!user) return { error: "User not found" };
    const { id } = user;
    const repos = await db.repo.findMany({
      where: {
        ownerId: id
      }
    });
    return {
      repos
    };
  } catch {
    return { error: "Failed to fetch repositories. Please try again later." };
  }
}

export const getRepoStats = async (username: string, repo: string) => {
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
    if (!user) return { error: "User not found" };
    const { pat } = user;
    const { data : { stargazers_count, forks_count } } = await axios.get(`https://api.github.com/repos/${username}/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${pat}`
      }
    });
    const { data } = await axios.get(`https://api.github.com/repos/${username}/${repo}/collaborators`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${pat}`
      }
    })
    const collaborators_count = data.length;
    const { id } = user;
    const repoData = await db.repo.findFirst({
      where: {
        ownerId: id,
        name: repo
      },
      select: {
        updatedAt: true,
        _count: {
          select: {
            commits: true
          }
        }
      }
    });
    if (!repoData) return { error: "Repository not found or not added" };
    const { updatedAt } = repoData;
    return {
      stargazers_count,
      forks_count,
      collaborators_count,
      updatedAt,
      commits_count: repoData._count.commits
    };
  } catch {
    return { error: "Failed to fetch repository stats. Please try again later." };
  }
}

export const getLatestCommit = async (username: string) => {
  try {
    const user = await db.user.findFirst({
      where: {
        username
      },
      include: {
        commits: {
          select: {
            id: true,
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        }
      }
    });
    if (!user) return { error: "User not found" };
    const { commits } = user;
    if (commits.length === 0) return { error: "No commits found" };
    const { id } = commits[0];
    return {
      commitId: id
    };
  } catch {
    return { error: "Failed to fetch latest commit. Please try again later." };
  }
}