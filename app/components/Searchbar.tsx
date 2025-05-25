import Image from "next/image"

interface SearchProps {
    search?: string
    goToSearch?: () => void
    setSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Searchbar = ({search, goToSearch,setSearch}:SearchProps) => {
  return (
  <div className=" mt-[80px] gap-1 w-full flex flex-row justify-center items-center md:justify-end  md:w-[60%]">
   <div className="bg-blu-100 rounded-sm">
    <Image
    src={'/icons/search.svg'}
    alt='search icon'
    width={40}
    height={40} />  
   </div>
    <input className="
    p-1 pl-4 border-gray-400 w-[80%] border-2
    rounded-sm caret-blue-300 transition-all duration-300 ease-in focus:border-blue-100" type="text"
    onClick={goToSearch && goToSearch}
    onChange={setSearch}
    value={search}
    placeholder="Search by school or location"
    />
  </div>
  )
}

export default Searchbar