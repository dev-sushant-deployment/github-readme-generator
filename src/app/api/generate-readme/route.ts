import axios from "axios";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { model } from "@/helper/gemini-ai";
import { NextRequest, NextResponse } from "next/server";
import { mkdir, rm, unlink, writeFile } from "fs/promises";
import { Open } from "unzipper";

interface ErrorType {
  message?: string;
  status: number;
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

const headers = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive'
};

const customError = (errorData : { message?: string, status: number }) => {
  return new NextResponse(`event: error\ndata: ${JSON.stringify(errorData)}\n\n, { headers }`);
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (url) {
    try {
      if (!url.match(/^https:\/\/github.com\/[^/]+\/[^/]+\/?$/)) return customError({ message: "Invalid URL", status: 400 });
      const [,,,owner , repo] = url.split('/');
      console.log("fetching your github repo.....");
      const { data : zip } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/zipball`, {
        responseType: 'arraybuffer',
        maxRedirects: 5,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        }
      });
      if (!zip) return customError({ message: "Failed to fetch repository", status: 500 });
      const extractedDirPath = join(process.cwd(), `${owner}-${repo}`);
      await mkdir(extractedDirPath, { recursive: true });
      const downloadedFilePath = join(extractedDirPath, `${owner}-${repo}.zip`);
      await writeFile(downloadedFilePath, Buffer.from(zip));
      console.log("Extracting to:", extractedDirPath); // Log the extraction path
      console.log("Zip file path:", downloadedFilePath)
      await Open.file(downloadedFilePath).then(directory => {
        return directory.extract({ path: extractedDirPath });
      });
      console.log("reading your github repo.....");
      const files = extractFiles(extractedDirPath);
      await unlink(downloadedFilePath);
      await rm(extractedDirPath, { recursive: true });
      console.log("generating prompt.....");
      const prompt = `
      # ${repo}\n\n${files.map(({ name, content }) => `## ${name}\n\n\\n${content}\n\``).join("\n\n")}

      Above are the contents of the repository. Please generate a README.md file for this repository.
      Do not include the contents of the files in the README.md file. The README.md file should contain a brief description of the repository and its contents.
      README.md file should be written in markdown format.
      README.md file should not be too short or too long. It should be concise and informative.
      It should contain all the necessary information about the repository(project).

      Your response should only contain the content of the README.md file.
      `;
      console.log("generating README.md file.....");
      const result = await model.generateContentStream(prompt);
      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of result.stream) {
            const data = { markdown: chunk.text() };
            controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
          }
          const data = { done: true };
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
          controller.close();
        }
      });
      return new NextResponse(stream, { headers });
    } catch (error) {
      console.log("Error generating README.md file", error);
      return customError({ message: (error as ErrorType).message, status: (error as ErrorType).status || 500 });
    }
  } else return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
}