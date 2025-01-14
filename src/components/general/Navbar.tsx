import { WEBSITE_NAME } from "@/constants"
import { ConnectToGithubButton } from "../client/ConnetToGithubButton"
import Link from "next/link"

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 bg-white shadow px-4 flex justify-between items-center h-14 w-full">
      <Link href="/"><h1 className="text-xl font-bold">{WEBSITE_NAME}</h1></Link>
      <ConnectToGithubButton />
    </nav>
  )
}