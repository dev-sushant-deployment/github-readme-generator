import { getLatestCommit } from "@/actions/repo";
import { redirect } from "next/navigation";

interface LatestReadmePageProps {
  params: Promise<{
    username: string,
    repo: string
  }>;
}

const LatestreadmePage : React.FC<LatestReadmePageProps> = async ({ params }) => {
  const { username, repo } = await params;
  try {
    const {commitId, error } = await getLatestCommit(username, repo);
    if (error) throw new Error(error);
    if (!commitId) throw new Error("Commit not found");
    redirect(`/repos/${username}/${repo}/commit/${commitId}`);
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error("An unexpected error occurred");
  }
}

export default LatestreadmePage