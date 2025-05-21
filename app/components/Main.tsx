import CardList from "./CardList"
import Image from "next/image"

const Main =  () => {
 
  return (
    <>
      {/* <div className="mt-[900px] p-48 bg-blue-200 w-full flex flex-row items-center">
        <Image
        src='/icons/search.svg'
        alt="icon"
        width={40}
        height={40}
        />
        <input className="border-gray-500 w-[80%] border-2 rounded-sm" type="text" />
      </div> */}
     <CardList/>
    </>
     
  )
}

export default Main
