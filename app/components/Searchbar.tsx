"use client"
import { Search } from "lucide-react"
import { useDarkMode } from "@lib/DarkModeProvider"

interface SearchProps {
  search?: string
  placeholder?: string
  goToSearch?: () => void
  setSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

const Searchbar = ({ search, placeholder, goToSearch, setSearch, className }: SearchProps) => {
  return (
    <div
      className={
        className ||
        "mt-[80px] gap-1 w-full flex flex-row justify-center items-center md:justify-end  md:w-[60%]"
      }
    >
      <div className="dark:bg-darkGray bg-white outline-2 outline-slate-200 dark:outline-gray-800 rounded-md p-2 flex items-center gap-2">
        <Search
          size={32}
          className="text-goldPrimary"
        />
      </div>
      <input
        className="w-[80%] bg-white dark:bg-darkGray
     py-3.5 pr-2 pl-4
  outline-2 outline-slate-200 dark:outline-gray-800
  focus:outline-3 focus:scale-99
     font-medium text-gray-700 dark:text-gray-200 
     placeholder-gray-400 dark:placeholder-gray-400
    rounded-md
     dark:caret-white caret-blue-300 transition-outline duration-200 ease-in-out"
        type="text"
        onClick={goToSearch && goToSearch}
        onChange={setSearch}
        value={search}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Searchbar
