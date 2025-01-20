"use client";

import eventEmitter from "@/lib/eventEmitter";
import { Repo } from "@prisma/client";
import { Calendar, Eye, Github } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface AddRepoButtonProps {
  username: string;
  initialRepos: Repo[];
}

export const Repos: React.FC<AddRepoButtonProps> = ({ username, initialRepos }) => {
  const [repos, setRepos] = useState<Repo[]>(initialRepos);

  useEffect(() => {
    eventEmitter.on("repoAdded", (repo: Repo) => {
      setRepos(prev => [...(new Set([...prev, repo]))]);
    });
  }, []);

  return (
    <div className={`w-full grid grid-cols-4 gap-2 ${repos.length == 0 ? "flex-grow" : ""}`}>
      {repos.length == 0 && (
        <div className="col-span-4 flex justify-center items-center h-full p-4 rounded-lg border-2 border-gray-100">
          <p className="text-6xl text-gray-500">No repositories Added.</p>
        </div>
      )}
      {repos.map(repo => (
        <div key={repo.id} className="flex flex-col gap-8 justify-center items-center p-4 rounded-lg border-2 border-gray-100">
          <div className="w-full flex justify-between items-center">
            <Link href={`/repos/${username}/${repo.name}`}>
              <h3 className="text-lg font-semibold hover:underline">{repo.name}</h3>
            </Link>
            <Link href={`https://github.com/${username}/${repo.name}`} target="_blank">
              <Github className="w-6 h-6"/>
            </Link>
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="text-sm text-gray-500 flex items-center justify-center">
              <Calendar className="w-4 h-4 mr-1"/>
              <span suppressHydrationWarning>{repo.updatedAt.toLocaleDateString()}</span>
            </div>
            <Link href={`/repos/${username}/${repo.name}/readme`}>
              <Button variant="ghost" className="text-sm text-gray-500 flex items-center justify-center">
                <Eye className="w-4 h-4 mr-1"/>
                <span>View</span>
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}