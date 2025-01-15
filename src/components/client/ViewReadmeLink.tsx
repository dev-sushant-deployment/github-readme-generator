"use client";

import { CommitStatus } from "@prisma/client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { puller } from "@/helper/Pusher/puller";
import { COMMIT_EVENT } from "@/constants";

interface ViewReadmeLinkProps {
  username: string;
  repo: string
  commit_id: string;
  initialStatus: CommitStatus;
}

export const ViewReadmeLink: React.FC<ViewReadmeLinkProps> = ({ username, repo, commit_id, initialStatus }) => {
  const [status, setStatus] = useState<CommitStatus>(initialStatus);

  useEffect(() => {
    const channel = puller.subscribe(`commit-${commit_id}`);
    channel.bind(COMMIT_EVENT, ({ status } : { status : CommitStatus }) => setStatus(status));
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [commit_id])

  if (status === "CHECKING" || status === "NO_CHANGES" || status === "FAILED") return null;
  return (
    <Link href={`/repos/${username}/${repo}/commit/${commit_id}`}>
      <Button variant="outline" className="flex gap-2 items-center">
        <Eye size={24} />
        <span>View Readme</span>
      </Button>
    </Link>
  )
};