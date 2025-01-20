"use client";

import { connectGithub, validatePAT } from "@/actions/user";
import { ACCESS_TOKEN } from "@/constants";
import { ConnectionType } from "@/types";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Eye, EyeOff, Github } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { customError } from "@/lib/error";
import Link from "next/link";

export const ConnectToGithubButton = () => {
  const { CHECKING, CONNECTED, CONNECTING, DISCONNECTED } = ConnectionType;
  const [isConnected, setIsConnected] = useState<ConnectionType>(CHECKING);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [jwt, setJwt] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [newUsername, setNewUsername] = useState<string | undefined>(undefined);
  const [pat, setPat] = useState<string | undefined>(undefined);
  const [showPat, setShowPat] = useState(false);
  const [open, setOpen] = useState(false);

  const validateFields = () => {
    if (!newUsername) {
      toast.error("Username is required");
      return false;
    }
    if (!email) {
      toast.error("Email is required");
      return false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Invalid email");
        return false;
      }
    }
    if (!pat) {
      toast.error("Personal Access Token is required");
      return false;
    } else {
      const patRegex = /^ghp_[a-zA-Z0-9]{36}$/;
      if (!patRegex.test(pat)) {
        toast.error("Invalid Personal Access Token");
        return false;
      }
    }
    return true;
  }

  const handleConnect = async () => {
    if (!validateFields()) return;
    setIsConnected(CONNECTING);
    const toastId = toast.loading("Connecting to Github...");
    try {
      const { access_token, error } = await connectGithub(newUsername as string, pat as string, email as string);
      if (!access_token) throw new Error(error);
      setJwt(access_token);
      setUsername(newUsername);
      setIsConnected(CONNECTED);
      setOpen(false);
      toast.success("Connected to Github successfully", { id: toastId });
    } catch (error) {
      setIsConnected(DISCONNECTED);
      console.log("Error connecting to Github", error);
      customError(error, toastId);
    }
  }

  const handleCancel = () => {
    setNewUsername(undefined);
    setEmail(undefined);
    setPat(undefined);
    setOpen(false);
  }

  useEffect(() => {
    const checkConnection = async () => {
      const access_token = localStorage.getItem(ACCESS_TOKEN);
      if (!access_token) setIsConnected(DISCONNECTED);
      else {
        const { valid, username } = await validatePAT(access_token);
        if (valid) {
          setIsConnected(CONNECTED);
          setUsername(username);
        }
        else setIsConnected(DISCONNECTED);
      }
    }
    checkConnection();
  }, [CONNECTED, DISCONNECTED])

  useEffect(() => {
    if (isConnected === DISCONNECTED) localStorage.removeItem(ACCESS_TOKEN);
    if (isConnected === CONNECTING) document.title = "Connecting to Github...";
    else document.title = "Github Readme Generator";
  }, [isConnected, CONNECTING, DISCONNECTED])

  useEffect(() => {
    if (isConnected === CONNECTED && !localStorage.getItem(ACCESS_TOKEN) && jwt) localStorage.setItem(ACCESS_TOKEN, jwt as string);
  }, [isConnected, jwt, CONNECTED])

  return (
    <>
      {isConnected === CONNECTED ?
        <Link href={`/repos/${username}`}>
          <Button className="flex items-center justify-between">
            <Github size={24} />
            <p>{username}</p>
          </Button>
        </Link>
        :
        isConnected === CONNECTING ?
          <Button className="flex items-center justify-between">
            <Github size={24} />
            <p>Connecting as {newUsername}</p>
          </Button>
          :
          isConnected === CHECKING ?
            <Button className="flex items-center justify-between" suppressHydrationWarning>
              <Github size={24} />
              <p>Checking connection...</p>
            </Button>
            :
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className={`${buttonVariants({ variant: "default" })} flex items-center justify-between`} suppressHydrationWarning>
                <Github size={24} />
                <p>Connect to Github</p>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect to Github</DialogTitle>
                  <DialogDescription>
                    Connect your GitHub account to track repository README changes.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your Github username"
                      value={newUsername || ""}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email || ""}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 relative">
                    <Label htmlFor="pat">Personal Access Token</Label>
                    <Input
                      id="pat"
                      type={showPat ? "text" : "password"}
                      placeholder="Enter your Github Personal Access Token"
                      value={pat || ""}
                      onChange={(e) => setPat(e.target.value)}
                      className="pr-10"
                    />
                    {!showPat && <Eye
                      onClick={() => setShowPat(true)}
                      size={24}
                      className="absolute top-1/2 right-3 cursor-pointer"
                    />}
                    {showPat && <EyeOff
                      onClick={() => setShowPat(false)}
                      size={24}
                      className="absolute top-1/2 right-3 cursor-pointer"
                    />}
                  </div>
                </div>
                <div className="text-sm text-gray-500 space-y-2 font-[450]">
                  <p>To create a new token:</p>
                  <ol className="list-decimal pl-4 space-y-2">
                    <li>Go to GitHub Settings → Developer settings</li>
                    <li>Select Personal access tokens → Tokens (classic)</li>
                    <li>Generate new token with &lsquo;repo&rsquo; scope and &lsquo;admin:repo_hook&rsquo; scope</li>
                  </ol>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConnect}
                    className="flex justify-center items-center gap-2"
                  >
                    <Github size={24} />
                    <p>Connect</p>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>}
    </>
  )
}