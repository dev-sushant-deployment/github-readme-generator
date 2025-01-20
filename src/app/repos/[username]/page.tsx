import { getRepos } from "@/actions/repo";
import { AddRepoButton } from "@/components/client/AddRepoButton";
import { Repos } from "@/components/client/Repos";

interface RepoPageProps {
  params: Promise<{
    username: string;
  }>;
}

const AddedReposPage: React.FC<RepoPageProps> = async ({ params }) => {
  const { username } = await params;
  try {
    const { repos, error } = await getRepos(username);
    if (error) throw new Error(error);
    if (!repos) throw new Error("Failed to fetch repositories. Please try again later.");
    return (
      <div className="flex-grow flex flex-col gap-5 w-full max-w-[1400px] px-5">
        <div className="flex justify-between items-center py-3">
          <h2 className="text-4xl font-bold">Track Repositories</h2>
          <AddRepoButton />
        </div>
        <Repos username={username} initialRepos={repos} />
      </div>
    )
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error("An unexpected error occurred");
  }
}

export default AddedReposPage;