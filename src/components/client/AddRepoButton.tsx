"use client";

import { addRepo } from "@/actions/repo";
import { ACCESS_TOKEN } from "@/constants";
import { customError } from "@/lib/error";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { Github, Plus } from "lucide-react";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import eventEmitter from "@/lib/eventEmitter";
import { useRouter } from "next/navigation";

export const AddRepoButton = () => {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);

  const validateUrl = () => {
    if (!url) {
      toast.error("Repository URL is required");
      return false;
    }
    if (!url.match(/^https:\/\/github.com\/[^/]+\/[^/]+\/?$/)) {
      toast.error("Invalid Repository URL");
      return false;
    }
    return true;
  }

  const trackRepo = async () => {
    if (!validateUrl()) return;
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      toast.info("Please connect to Github to track repositories.");
      return;
    }
    const access_token = localStorage.getItem(ACCESS_TOKEN);
    const toastId = toast.loading("Adding repository...");
    try {
      const { error, repo } = await addRepo(url, access_token as string);
      if (error) throw new Error(error);
      toast.success("Repository added successfully!", { id: toastId });
      eventEmitter.emit("repoAdded", repo);
      setOpen(false);
      const [owner, repoName] = url.split("/").slice(3, 5);
      router.push(`/repos/${owner}/${repoName}`);
    } catch (error) {
      customError(error, toastId);
    }
  }

  const handleCancel = () => {
    setOpen(false);
    setUrl("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`${buttonVariants({ variant: "default" })} flex items-center justify-between`} suppressHydrationWarning>
        <Plus size={24} />
        <p>Add</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Repository
          </DialogTitle>
          <DialogDescription>
            Add a repository to track README changes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1">
          <Label htmlFor="url">
            Repository URL
          </Label>
          <Input
            id="url"
            type="text"
            placeholder="Enter your Github repository URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={trackRepo}
            className="flex justify-center items-center gap-2"
          >
            <Github size={24} />
            <p>Add</p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}