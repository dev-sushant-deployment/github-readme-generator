"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error : React.FC<ErrorProps> = ({ error, reset }) => {
  return (
    <div className="w-full max-w-[500px] flex flex-col items-center justify-center gap-10 border-2 border-gray-100 rounded-lg p-5">
      <div className="w-full flex flex-col items-center justify-center gap-2">
        <AlertCircle size={64} className="text-red-600 bg-red-600/15 p-4 rounded-full"/>
        <h2 className="text-2xl font-bold">Something Went Wrong!</h2>
        <p className="text-center text-gray-400">
          We encountered an error while loading your repositories. Please try again later.
        </p>
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-2">
        <p className="bg-muted w-full p-3 rounded-lg">{error.message}</p>
        <div className="w-full flex items-center justify-center gap-2">
          <Button
            onClick={reset}
            className="flex justify-center items-center gap-2 w-1/2"
          >
            <RotateCcw size={24} />
            <p>Try Again</p>
          </Button>
          <Link href="/" className="flex justify-center items-center gap-2 w-1/2">
            <Button variant="outline" className="w-full">
              <Home size={24} />
              <p>Go Home</p>
            </Button>
          </Link>
        </div>
      </div>
      <div className="border-t pt-6 w-full">
        <p className="text-sm text-muted-foreground text-center">
          If the problem persists, please contact our{' '}
          <Link 
            href="/support" 
            className="underline underline-offset-2 hover:text-foreground"
          >
            support team
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default Error;