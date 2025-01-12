"use client";

import { ReadMeViewer } from "@/components/general/ReadMeViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export const GenerateReadme = () => {
  const [url, setUrl] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (generating) document.title = "Generating README...";
    else document.title = "Github Readme Generator";
  }, [generating])

  useEffect(() => {
    if (generating && markdown) window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [generating, markdown])

  return (
    <>
      <div className="flex flex-row gap-3 items-center justify-center">
        <Input
          placeholder="Enter Github Repository URL (e.g., https://github.com/owner/repo)"
          type="url"
          className="w-[600px] py-5 rounded-lg border border-gray-200"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button className="py-5">Generate README</Button>
      </div>
      <ReadMeViewer markdown={markdown} />
    </>
  )
}