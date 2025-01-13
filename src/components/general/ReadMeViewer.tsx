import { markdownComponents } from "@/helper/react-markdown-components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { Loader } from "lucide-react";

interface ReadMeViewerProps {
  markdown: string;
  generating: boolean;
}

export const ReadMeViewer: React.FC<ReadMeViewerProps> = ({ markdown, generating }) => {
  return (
    <Tabs
      defaultValue="preview"
      className={`max-w-[800px] w-full border border-gray-200 rounded-lg min-h-[calc(100vh-120px)] bg-muted ${markdown ? "" : "hidden"}`}
    >
      <div className="flex justify-between items-center bg-primary px-4 py-2 text-white rounded-t-lg">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span>README.md</span>
          {generating && <Loader size={16} className="animate-spin" />}
        </h3>
        <TabsList className="min-w-20">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="preview" className="px-4 py-2 mt-0 bg-muted">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >{markdown}</ReactMarkdown>
      </TabsContent>
      <TabsContent value="raw" className="px-4 py-2 bg-muted mt-0">
        <pre className="text-wrap">{markdown}</pre>
      </TabsContent>
    </Tabs>
  );
}