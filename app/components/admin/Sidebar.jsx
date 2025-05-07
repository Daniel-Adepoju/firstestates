'use client'
import Image from "next/image"
import { sidebarItems } from "@lib/constants"
import { usePathname } from "next/navigation"
import { CldImage } from "next-cloudinary"
const Sidebar = ({session}) => {
  
  const pathname = usePathname()
  return (
    <div className="sidebar">
  <ul>{
    sidebarItems.map((item, index) => {
      return (
      <div  key={index}
      className={` items ${pathname === item.link && "active"}`}
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
  <CldImage src={session?.user.profilePic} alt='prifile pic'
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