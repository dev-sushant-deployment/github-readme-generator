"use client";

import { useEffect, useState } from "react";
import { ReadMeViewer } from "../general/ReadMeViewer";
import { puller } from "@/helper/Pusher/puller";
import { MARKDOWN_EVENT } from "@/constants";

interface GeneratingReadmeProps {
  commit_id: string;
}

export const GeneratingReadme : React.FC<GeneratingReadmeProps> = ({ commit_id }) => {
  const [markdown, setMarkdown] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(true);

  useEffect(() => {
    const channel = puller.subscribe(`commit-${commit_id}`);
    channel.bind(MARKDOWN_EVENT, ({ markdown, done } : { markdown : string, done? : boolean }) => {
      setMarkdown(prev => prev.length < markdown.length ? markdown : prev);
      if (done) setGenerating(false);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [])

  return <ReadMeViewer markdown={markdown} generating={generating} />;
}