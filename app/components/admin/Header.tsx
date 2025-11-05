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
   <p className="text-sm">Manage all of your <strong>listings</strong> and <strong>residents</strong> here</p>
   :
    <p className="text-sm">Monitor all of <strong>First Estates</strong> users and agents here </p>}   
    </div> 
    {/* <p>Search</p> */}
    </div>
  )
}

export default Header