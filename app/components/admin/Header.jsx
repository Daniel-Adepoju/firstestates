'use client'
import { usePathname } from "next/navigation"
const Header = ({session}) => {
  const pathname = usePathname()
  return (
    <div className='admin-header'>
      <div>
    <h2 className='subheading'>{session?.user.username}</h2> 
   {pathname.includes('/agent') ? 
   <p>Monitor all your listings here</p>
   :
    <p>Monitor all of your users and agent listings here </p>}   
    </div> 
    {/* <p>Search</p> */}
    </div>
  )
}

export default Header