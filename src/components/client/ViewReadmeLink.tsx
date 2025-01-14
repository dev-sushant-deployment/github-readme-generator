"use client";

import { CommitStatus } from "@prisma/client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";

interface ViewReadmeLinkProps {
  commit_id: string;
  status: CommitStatus;
}

export const ViewReadmeLink: React.FC<ViewReadmeLinkProps> = ({ commit_id, status }) => {
  if (status === "CHECKING" || status === "NO_CHANGES" || status === "FAILED") return null;
  return (
    <Link href={`/commit/${commit_id}`}>
      <Button variant="outline" className="flex gap-2 items-center">
        <Eye size={24} />
        <span>View Readme</span>
      </Button>
    </Link>
  )
};