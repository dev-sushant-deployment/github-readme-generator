"use client";

import { ReadMeViewer } from "@/components/general/ReadMeViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface ErrorEvent extends Event {
  data: {
    message?: string;
    status: number;
  }
}

export const GenerateReadme = () => {
  const [url, setUrl] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [toastId, setToastId] = useState<string | number | null>(null);

  const generateReadme = async () => {
    setGenerating(true);
    try {
      const eventSource = new EventSource(`/api/generate-readme?url=${url}`);
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.markdown) setMarkdown(prev => prev + data.markdown);
        else if (data.done) {
          setGenerating(false);
          eventSource.close();
        }
      }
      eventSource.onerror = (event) => {
        setGenerating(false);
        eventSource.close();
        const { message } = JSON.parse((event as ErrorEvent).data as unknown as string);
        setError(message);
      }
    } catch {
      setGenerating(false);
      setError("Failed to generate README. Please try again later.");
    }
  }

  const trackRepo = async () => {
    toast.info("Feature coming soon!");
  }

  useEffect(() => {
    if (generating) document.title = "Generating README...";
    else document.title = "Github Readme Generator";
  }, [generating])

  useEffect(() => {
    if (generating) {
      const currtoastId = toast.loading("Generating README...");
      setToastId(currtoastId);
    }
    else {
      if (toastId) {
        const toastOptions = {
          id: toastId
        }
        if (error) {
          toast.error(error, toastOptions);
          setError("");
        }
        else toast.success("README generated successfully!", toastOptions);
        setToastId(null);
      }
    }
  }, [generating, error])

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
          readOnly={generating}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          className="py-5"
          disabled={generating || !url || !url.match(/^https:\/\/github.com\/[^/]+\/[^/]+\/?$/)}
          onClick={!generating && markdown ? trackRepo : generateReadme}
        >
          {generating ?
            <div className="flex items-center gap-2">
              <Loader size={16} className="animate-spin"/>
              <span>Generating README...</span>
            </div>
            :
            markdown ?
              "Track Repo"
              :
              "Generate README"
          }
        </Button>
      </div>
      <ReadMeViewer markdown={markdown} generating={generating}/>
    </>
  )
}