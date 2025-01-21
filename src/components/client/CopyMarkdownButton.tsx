"use client";

import { Copy } from "lucide-react";
import { Button } from "../ui/button";

interface CopyMarkdownButtonProps {
  markdown: string;
  generating: boolean;
}

export const CopyMarkdownButton: React.FC<CopyMarkdownButtonProps> = ({ markdown, generating }) => {
  return (
    <Button
      variant="secondary"
      className="py-2"
      disabled={generating}
      onClick={() => navigator.clipboard.writeText(markdown)}
    >
      <Copy size={16} className="mr-2" />
      <span className="hidden sm:visible">Copy</span>
    </Button>
  )
}