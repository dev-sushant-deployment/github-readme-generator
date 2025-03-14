import { CommitStatus } from "@prisma/client";
import { Loader } from "lucide-react";
import { Badge } from "../ui/badge";

interface CommitStatusBadgeProps {
  status: CommitStatus;
}

export const CommitStatusBadge: React.FC<CommitStatusBadgeProps> = ({ status }) => {
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

  const { element, variant, text } = getDisplay(status);

  return (
    <Badge variant={variant} className="flex gap-2 items-center rounded-full">
      {element}
      <span className="text-xs">{text}</span>
    </Badge>
  );
};