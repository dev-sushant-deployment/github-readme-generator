import { websiteName } from "@/constants"

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 bg-white shadow px-4 flex justify-between items-center h-14">
      <h1 className="text-xl font-bold">{websiteName}</h1>
      {/* Add connect to github button */}
    </nav>
  )
}