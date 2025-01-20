import { CommitStatus } from "@prisma/client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";

interface ViewReadmeLinkProps {
  username: string;
  repo: string
  commit_id: string;
  status: CommitStatus;
}

export const ViewReadmeLink: React.FC<ViewReadmeLinkProps> = ({ username, repo, commit_id, status }) => {
  if (status !== "UPDATED") return null;
  return (
    <Link href={`/repos/${username}/${repo}/commit/${commit_id}`}>
      <Button variant="outline" className="flex gap-2 items-center">
        <Eye size={24} />
        <span>View Readme</span>
      </Button>
    </Link>
  )
};