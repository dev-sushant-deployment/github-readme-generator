"use client";

import { markdownComponents } from "@/helper/react-markdown-components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { GeneratingLoader } from "./generatingLoader";
import { CopyMarkdownButton } from "./CopyMarkdownButton";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { updateMarkdown } from "@/actions/commit";

interface ReadMeViewerProps {
  commitId?: string;
  markdown: string;
  generating: boolean;
}

export const ReadMeViewer: React.FC<ReadMeViewerProps> = ({ commitId, markdown, generating }) => {
  const [originalMarkdown, setOriginalMarkdown] = useState(markdown);
  const [editedMarkdown, setEditedMarkdown] = useState(markdown);
  const toastId = useRef<string | number | null>(null);

  const preRef = useRef<HTMLPreElement>(null);

  const handleMarkdownChange = (e: React.FormEvent<HTMLPreElement>) => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const offset = range?.startOffset ?? 0;
    setEditedMarkdown((e.target as HTMLPreElement).innerText);
    setTimeout(() => {
      if (preRef.current && selection) {
        const newRange = document.createRange();
        newRange.setStart(preRef.current.childNodes[0] || preRef.current, offset);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }, 0);
  }

  const save = async () => {
    if (!commitId || !toastId.current) return;
    toast.loading('Saving Changes', {
      action: undefined,
      cancel: undefined,
      id: toastId.current
    });
    try {
      const { success, error } = await updateMarkdown(commitId, editedMarkdown);
      if (!success) throw new Error(error || "Failed to save changes");
      toast.success('Changes Saved', {
        duration: 3000,
        action: undefined,
        cancel: undefined,
        id: toastId.current
      });
      setOriginalMarkdown(editedMarkdown);
    } catch (error) {
      toast.error("Failed to save changes", {
        duration: 3000,
        action: undefined,
        cancel: undefined,
        id: toastId.current
      });
      const id = toast('You have Unsaved Changes', {
        duration: Infinity,
        action: <Button className="rounded-full ml-3" onClick={save}>Save</Button>,
        cancel: <Button variant="secondary" className="rounded-full ml-3" onClick={reset}>Reset</Button>
      });
      toastId.current = id;
    }
  }

  const reset = () => {
    setEditedMarkdown(originalMarkdown);
  }

  useEffect(() => {
    if (!commitId) return;
    if (editedMarkdown !== markdown) {
      if (!toastId.current) {
        const id = toast('You have Unsaved Changes', {
          duration: Infinity,
          action: <Button className="rounded-full ml-3" onClick={save}>Save</Button>,
          cancel: <Button variant="secondary" className="rounded-full ml-3" onClick={reset}>Reset</Button>
        });
        toastId.current = id;
      }
    } else {
      toast.dismiss();
      toastId.current = null;
    }
  }, [editedMarkdown]);

  return (
    <Tabs
      defaultValue="preview"
      className={`max-w-[800px] w-full border border-gray-200 rounded-lg min-h-[calc(100vh-120px)] bg-muted ${editedMarkdown ? "" : "hidden"}`}
    >
      <div className="flex justify-between items-center bg-primary px-4 py-2 text-white rounded-t-lg">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span>README.md</span>
          <GeneratingLoader generating={generating} />
        </h3>
        <div className="flex items-center gap-2">
          <CopyMarkdownButton markdown={editedMarkdown}  generating={generating}/>
          <TabsList className="min-w-20">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
          </TabsList>
        </div>
      </div>
      <TabsContent value="preview" className="px-4 py-2 mt-0 bg-muted">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >{editedMarkdown}</ReactMarkdown>
      </TabsContent>
      <TabsContent value="raw" className="px-4 py-2 bg-muted mt-0">
        <pre
          className="text-wrap focus:outline-none"
          contentEditable
          suppressContentEditableWarning
          onInput={handleMarkdownChange}
          ref={preRef}
        >{editedMarkdown}</pre>
      </TabsContent>
    </Tabs>
  );
}