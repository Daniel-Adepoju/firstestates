import Image from "next/image"

interface SearchProps {
    search?: string
    goToSearch?: () => void
    setSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Searchbar = ({search, goToSearch,setSearch}:SearchProps) => {
  return (
  <div className="mt-[80px] gap-2 w-full flex flex-row justify-center items-center">
    <Image
    src='/icons/search.svg'
    alt="icon"
    width={40}
    height={40}
    />
    <input className="p-1 border-gray-500 w-[80%] border-2 rounded-sm" type="text"
    onClick={goToSearch && goToSearch}
    onChange={setSearch}
    value={search}
    placeholder="Search by location"
    />
  </div>
  )
}

export default Searchbar