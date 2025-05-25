'use client'

import Image from "next/image"
import {useUser} from "@utils/user"
import { CldImage } from "next-cloudinary"
import { Skeleton } from "@components/ui/skeleton"


const Agent = () => {
const {session} = useUser()

if (!session) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Skeleton className="w-30 h-30 rounded-[50%] bg-gray-300" />
      <Skeleton className="w-full h-10 rounded-md bg-gray-300" />
      <Skeleton className="w-full h-10 rounded-md bg-gray-300" />
    </div>
  )
}
  return (
    <>
    <div className="agentProfile">
        <div className="agentProfilePic">
            <CldImage
            width={100}
            height={100}
            src={session?.user.profilePic}
            alt='profilePic'/>
        </div>
        <div className="agentName">
        {session?.user.username}
        </div>
    <div className="opacity-60"><span className='pl-2'>{session?.user.email}</span></div>
 <div className="address">
        <Image
    width={30}
    height={30}
    src='/icons/location.svg' 
    alt='icon'/>
     <span>Office Address:</span>
      <span>14,lorem ipsum dolor</span>
    </div>
        <div className="agentProfileInfo">
   <div className="mt-4 font-bold">
    <Image
      src={'/icons/phone.svg'}
      alt='icon'
      width={30}
      height={30} />
   <span className='pl-2'>0903333222{session?.user.phone}</span>
   </div>
    <div className="font-bold">
       <Image
      src={'/icons/whatsapp.svg'}
      alt='icon'
      width={50}
      height={50} />
      <span className='pl-2'>09054444433{session?.user.whatsapp}</span></div>
    </div>
    </div>
    
    </>
   
  )
}

export default Agent