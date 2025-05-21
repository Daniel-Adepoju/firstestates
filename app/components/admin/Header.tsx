'use client'
import { usePathname } from "next/navigation"


interface Session {
  session: [] & {
    user: {username: string}
  }
}
const Header = ({session}: Session) => {
  const pathname = usePathname()
  return (
    <div className='admin-header'>
      <div>
    <h2 className='subheading'>{session?.user.username}</h2> 
   {pathname.includes('/agent') ? 
   <p>You can view and edit all your listings here</p>
   :
    <p>Monitor all of your users and agent listings here </p>}   
    </div> 
    {/* <p>Search</p> */}
    </div>
  )
}

export default Header