'use client'
import Image from "next/image"
import { agentSidebarItems as sidebarItems } from "@lib/constants"
import { usePathname } from "next/navigation"
import { CldImage } from "next-cloudinary"

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

  //  console.log(session)
  const pathname = usePathname()
  return (
    <div className="sidebar agentbar">
  <ul>{
    sidebarItems.map((item, index) => {
      const isActive = pathname === item.link || pathname.startsWith(item.link + '/') && item.link !== '/agent'
      return (
      <div  key={index}
      className={` items ${isActive && "active"}`}
      >
        <a href={item.link}>
    <Image src={item.icon}
      alt='icons'
      width={30}
      height={30}
      />
      <li>{item.name}</li>
      </a>
      </div>
      )
    })}</ul>
    <div className="adminLabel">
      {session &&
  <CldImage src={session?.user?.profilePic} alt='prifile pic'
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