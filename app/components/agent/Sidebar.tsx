'use client'
import Image from "next/image"
import { agentSidebarItems as sidebarItems } from "@lib/constants"
import { usePathname } from "next/navigation"
import { CldImage } from "next-cloudinary"
import { useGetNotifications } from "@lib/customApi"

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
 
  const {data,isLoading} = useGetNotifications({page:'1',limit:10})
  //  console.log(data?.pages[0]?.unreadNotifications === 0)
  return (
    <div className="sidebar agentbar">
  <ul>{
    sidebarItems.map((item, index) => {
      const isActive = pathname === item.link || pathname.startsWith(item.link + '/') && item.link !== '/agent'
      return (
      item.name !=='Dashboard' && (
      <div  key={index}
      className={`relative items ${isActive && "active"}`}
      >
    
        <a href={item.link}>
       {item.name === 'Messages' && !isLoading
       && data?.pages[0]?.unreadNotifications > 0
       && (
        <div className="z-1 absolute text-center bg-white rounded-full text-xl smallNum w-8 h-8">
        {data?.pages[0]?.unreadNotifications > 99 ? '99+' : data?.pages[0].unreadNotifications}
        </div> )}
    <Image src={item.icon}
      alt='icons'
      width={30}
      height={30}
      />
      <li>{item.name}</li>
      </a>
      </div>)
      )
    })}</ul>
    <div className="adminLabel">
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