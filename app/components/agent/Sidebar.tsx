'use client'
import Image from "next/image"
import { agentSidebarItems as sidebarItems } from "@lib/constants"
import { usePathname} from "next/navigation"
import { CldImage } from "next-cloudinary"
import { useGetNotifications } from "@lib/customApi"
import { useEffect, useState } from "react"
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

  const pathname = usePathname()
  const [hash,setHash] = useState('')
  const [isCollapse,setIsCollapse] = useState(false)
  

  useEffect (() => {
    const onHashChange = () => {
    const hashVal = window.location.hash
     setHash(hashVal)
    }
        window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('hashchange', onHashChange)
    }
  },[])

  const {data,isLoading} = useGetNotifications({page:'1',limit:10})

  return (
    <div className={`sidebar agentbar ${isCollapse && "reduceBar"}`}>
  <ul>{
    sidebarItems.map((item, index) => {
      const isListings = hash === '#listings'
      let isActive;
      if(isListings)  isActive = false
      if(!isListings) isActive = pathname === item.link || pathname.startsWith(item.link + '/') && item.link !== '/agent'
      return (
      item.name !=='Dashboard' && (
      <div  key={index}
      className={`relative items 
         ${isActive && "active"}
         ${isListings && item.name === 'Listings' && 'active'}
         `}
      >
    
        <a href={item.link ==='/agent/listings' ? '/agent#listings' : item.link}>
       {item.name === 'Messages' && !isLoading
       && data?.pages[0]?.unreadNotifications > 0
       && (
        <div className="z-1  h-6 w-6 absolute top-[-16.5%] left-[0%] text-center bg-white rounded-full text-xs font-bold smallNum">
        {data?.pages[0]?.unreadNotifications > 99 ? '99+' : data?.pages[0].unreadNotifications}
        </div> )}
        {item.name === 'Chats' && (
          <div className="absolute flex items-center flex-center w-6 h-6 top-[-16.5%] left-[0%] bg-white  text-white rounded-full px-2 py-1 text-xs font-bold smallNum">
          99+
          </div>
        )}
    <Image src={item.icon}
      alt='icons'
      width={30}
      height={30}
      />
      <li>{item.name}</li>
      </a>
      </div>)
      )
    })}
      <div className="
    arrow
    w-full flex flex-row justify-end
    ">
     <div 
     onClick={() => setIsCollapse(prev => !prev)}
     className="
     w-10 h-10 rounded-full cursor-pointer
     flex flex-row items-center justify-center
     bg-inherit backdrop-blur-md shadow-lg mediumScale">
    {isCollapse ?
    <ArrowRight size={30} color='white'/> :
    <ArrowLeft size={30} color='white'/>
    }
    </div>
    </div>
    </ul>



    <div className="adminLabel justify-end">
      {session &&
  <CldImage src={session?.user?.profilePic} alt='profile pic'
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