"use client";

import { Loader } from "lucide-react";

interface GeneratingLoaderProps {
  generating: boolean;
}

export const GeneratingLoader: React.FC<GeneratingLoaderProps> = ({ generating }) => {
  if (!generating) return null;
  return <Loader size={16} className="animate-spin hidden sm:visible" />
}