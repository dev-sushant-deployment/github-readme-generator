"use client";

import { CommitStatus } from "@prisma/client";
import { Loader } from "lucide-react";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { puller } from "@/helper/Pusher/puller";
import { COMMIT_EVENT } from "@/constants";

interface CommitStatusBadgeProps {
  commit_id: string;
  status: CommitStatus;
}

export const CommitStatusBadge: React.FC<CommitStatusBadgeProps> = ({ commit_id , status }) => {
  const getDisplay = (tempStatus: CommitStatus) => {
    let element = null;
    let variant: "secondary" | "default" | "outline" | "destructive" | null | undefined;
    let text = "";
    switch (tempStatus) {
      case "CHECKING":
        element = <Loader size={12} className="animate-spin"/>;
        variant = "secondary";
        text = "Checking Changes";
        break;
      case "GENERATING":
        element = <Loader size={12} className="animate-spin"/>;
        variant = "secondary";
        text = "Generating README";
        break;
      case "UPDATED":
        element = <></>;
        variant = "default";
        text = "Updated README";
        break;
      case "NO_CHANGES":
        element = <></>;
        variant = "outline";
        text = "No README Changes";
        break;
      case "FAILED":
        element = <></>;
        variant = "destructive";
        text = "Failed to Track Changes";
        break;
    }
    return { element, variant, text };
  }

  const { element : initialElement, variant : initialVariant, text : initialText } = getDisplay(status);

  const [element, setElement] = useState<React.ReactNode | null>(initialElement);
  const [variant, setVariant] = useState<"secondary" | "default" | "outline" | "destructive" | null | undefined>(initialVariant);
  const [text, setText] = useState<string>(initialText);

  useEffect(() => {
    const channel = puller.subscribe(`commit-${commit_id}`);
    channel.bind(COMMIT_EVENT, ({ status } : { status : CommitStatus }) => {
      const { element, variant, text } = getDisplay(status);
      setElement(element);
      setVariant(variant);
      setText(text);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [commit_id]);

  return (
    <Badge variant={variant} className="flex gap-2 items-center rounded-full">
      {element}
      <span className="text-xs">{text}</span>
    </Badge>
  );
};
