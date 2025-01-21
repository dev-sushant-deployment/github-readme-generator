import { fileSelectionModel, model } from "@/helper/gemini-ai";
import { db } from "@/lib/db";
import { CommitStatus } from "@prisma/client";
import axios from "axios";
import { readdirSync, readFileSync } from "fs";
import { mkdir, rm, unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server"
import { join } from "path";
import { Open } from "unzipper";

interface InitialCommitRouteParams {
  params: Promise<{
    username: string,
    repo: string
  }>
}

const extractFiles = (path: string, files: {name: string, content: string}[] = []) => {
  const dir = readdirSync(path, { withFileTypes: true });
  for (const dirent of dir) {
    const { name } = dirent;
    if (dirent.isDirectory()) {
      files = extractFiles(join(path, name), files);
    } else {
      files.push({ name, content: readFileSync(join(path, name), 'utf8') });
    }
  }
  return files;
};

export async function POST(req : NextRequest, { params } : InitialCommitRouteParams) {
  const { username : owner, repo } = await params;
  const { commitId } = await req.json();
  try {
    const user = await db.user.findFirst({
      where: {
        username: owner
      },
      select: {
        id: true,
        pat: true
      }
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const { pat } = user;
    const { data : zip } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/zipball`, {
      responseType: 'arraybuffer',
      maxRedirects: 5,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${pat}`
      }
    });
    if (!zip) return NextResponse.json({ error: "Failed to fetch repository" }, { status: 500 });
    const basePath = process.env.NODE_ENV === 'production' ? '/tmp' : process.cwd();
    const extractedDirPath = join(basePath, `${owner}-${repo}`);
    await mkdir(extractedDirPath, { recursive: true });
    const downloadedFilePath = join(extractedDirPath, `${owner}-${repo}.zip`);
    await writeFile(downloadedFilePath, Buffer.from(zip));
    await Open.file(downloadedFilePath).then(directory => {
      return directory.extract({ path: extractedDirPath });
    });
    const files = extractFiles(extractedDirPath);
    const fileSelectionPrompt = `
    I will provide you with the list of names of files in github repository.
    You need to select the files which are essential for generating the README.md file.
    Select only those files which are necessary for generating the README.md file.
    Do not select files which are not necessary for generating the README.md file.
    Select the files which have code in them.
    Skip .md, .json, config files etc.
    Also skip conventional files like LICENSE, README.md, CONTRIBUTING.md etc.
    Also skip files which are for conventional library files like package.json, requirements.txt etc.

    Only and only select those files which are not pre-generated.
    Select the files which you think the user has written code in them.

    Only select maximum 15 most important files for general overview of project.

    Response shoud be a string with names of selected files separated by just by a /.

    List of files:
    ${files.map(({ name }) => name).join("\n")}
    `;
    const fileSelectionResponse = await fileSelectionModel.generateContent(fileSelectionPrompt);
    const fileSelectionText = fileSelectionResponse.response.text();
    const selectedFiles = fileSelectionText.split("/").map(file => file.trim());
    await unlink(downloadedFilePath);
    await rm(extractedDirPath, { recursive: true });
    const prompt = `
    # ${repo}\n\n${files.map(({ name, content }) => selectedFiles.includes(name) ? `## ${name}\n\n\\n${content}\n\`` : ``).join("\n\n")}

    Above are the contents of the repository. Please generate a README.md file for this repository.
    Do not include the contents of the files in the README.md file. The README.md file should contain a brief description of the repository and its contents.
    README.md file should be written in markdown format.
    README.md file should not be too short or too long. It should be concise and informative.
    It should contain all the necessary information about the repository(project).

    Your response should only contain the content of the README.md file.
    `;
    const result = await model.generateContentStream(prompt);
    let markdownContent = "";
    for await (const content of result.stream) {
      const chunk = content.text();
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
    return NextResponse.json({ message: "README.md file generated" });
  } catch (error) {
    if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ error: "Failed to commit. Please try again later." }, { status: 500 });
  }
}