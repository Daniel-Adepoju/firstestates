'use client'
import { CldImage } from "next-cloudinary"
import { Trash, Loader } from "lucide-react"
import Link from "next/link"
import { formatNumber } from "@utils/formatNumber"

const WishListCard = () => {
  return (
    <div className="w-full max-w-220 flex items-center gap-4 shadow-sm rounded-md dark:bg-gray-800/50">
      <CldImage
    width={90}
    height={90}
    alt="post_img"
    src={'kfettsopnyhqhuq8o4aj'}
    crop={{
     type: "auto",
       source: true,
        }}
        className="rounded-md"
        />
        <div className="flex flex-col items- enter">

      
        <div className="
        address text-sm">
         123 Main St
        </div>  
     <div className="
      font-bold text-gray-500 dark:text-gray-300 text-sm px-3 py-2">
        LASU
        </div>
        <div className="agent pb-2">
                <CldImage
    width={90}
    height={90}
    alt="post_img"
    src={'kfettsopnyhqhuq8o4aj'}
    crop= "auto"
    className="rounded-full"
        />
        <Link href='#' className="text-sm text-darkblue dark:text-coffee underline ">Chat With Agent </Link>
        </div>
        </div>


   <div className="text-gray-500 dark:text-gray-300 font-bold text-sm ml-auto">
    <div className="text-center">
    &#8358;{formatNumber(250000)}
    </div>
    <div>
    <div className="bg-amber-500 text-gray-100 text-center text-sm px-2 rounded-md">
        Available
    </div>
    </div>
   </div>


        <div className="ml-auto pr-6 cursor-pointer smallScale">
        <Trash className="text-red-800 dark:text-white"/>
        {/* <Loader2
         className="text-red-800
          dark:text-white animate-spin"/> */}
        </div>
    </div>
  )
}

export default WishListCard