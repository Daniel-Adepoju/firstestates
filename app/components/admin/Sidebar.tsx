'use client'
import Image from "next/image"
import { sidebarItems } from "@lib/constants"
import { usePathname } from "next/navigation"
import { CldImage } from "next-cloudinary"
import { useGetNotifications } from "@lib/customApi"
import { useState } from "react"
import { ArrowLeft,ArrowRight} from "lucide-react"

interface Session {
  session: {
    user: {
      username: string,
      email: string,
      profilePic: string,
    } 
  }
}

const Sidebar = ({session}: Session) => {
   const [isCollapse,setIsCollapse] = useState(false)
  const pathname = usePathname()
   const {data,isLoading} = useGetNotifications({page:'1',limit:10})
  
   return (
    <div className={`sidebar ${isCollapse && "reduceBar"}`}>
  <ul>{
    sidebarItems.map((item, index) => {
         const isActive = pathname === item.link || pathname.startsWith(item.link + '/') && item.link !== '/admin'
      return (
      <div  key={index}
      className={` items ${isActive && "active"} relative`}
      >
        <a href={item.link}>
            {item.name === 'Messages' && !isLoading
       && data?.pages[0]?.unreadNotifications > 0
       && (
        <div className="z-1 absolute flex items-center flex-center w-6 h-6 top-[-16.5%] left-[0%] bg-white  text-white rounded-full px-2 py-1 text-xs font-bold smallNum">
        {data?.pages[0]?.unreadNotifications > 99 ? '99+' : data?.pages[0].unreadNotifications}
        </div> )}
    <Image src={item.icon}
      alt='icons'
      width={30}
      height={30}
      />
      <li>{item.name}</li>
      </a>
      </div>
      )
    })} 
     </ul>
    <div className="
    arrow absolute top-65 left-[94%]
    w-full hover:flex hidden
    ">
     <div 
     onClick={() => setIsCollapse(prev => !prev)}
     className="
     w-10 h-10 rounded-full cursor-pointer
     flex flex-row items-center justify-center
      shadow-lg mediumScale bg-gray-500/70">
    {isCollapse ?
    <ArrowRight size={30} color='white'/> :
    <ArrowLeft size={30} color='white'/>
    }
    </div>
    </div>
  
    <div className="adminLabel">
      {session &&
  <CldImage src={session?.user.profilePic}
   alt='profile pic'
  crop={'auto'}
  width={30} height={30}/>}
  <div className="adminDetails">
  <span>{session?.user.username}</span>
  <span>{session?.user.email}</span>
  </div>

</div>

</div>
  )
}

export default Sidebar