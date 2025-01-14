import { AUTHOR_GITHUB_LINK } from "@/constants"
import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 mt-4 h-10 w-full">
      <div className="mx-auto flex justify-center items-center gap-1">
        <p className="text-sm text-gray-500"> Made by </p>
        <Link href={AUTHOR_GITHUB_LINK} target="_blank">
          <h2 className="text-sm ml-1 underline">Sushant Wayal</h2>
        </Link>
      </div>
    </footer>
  )
}