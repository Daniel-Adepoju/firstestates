'use client'
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

interface Session {
  session: [] & {
    user: {username: string} & {isPremium?: boolean}
  }
}
const Header = ({session}: Session) => {
  const pathname = usePathname()
  return (
    <div className='admin-header'>
            <Link 
                  href="/"
                  className='flex items-center -mb-3'
                  >
                    {/* <div className="logo">LOGO</div> */}
                    <Image
                      src="/logo/logoWithoutText.png"
                      alt="logo"
                      width={1000}
                      height={1000}
                      className='w-[50px] h-auto'
                    />
            <div className="flex items-center w-[100px] h-[16px] overflow-hidden -ml-[14px]">
              <Image
                src="/logo/wordmark.png"
                alt="wordmark"
                width={1000}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
                  </Link>
      <div>
    <h2 className='subheading'>{session?.user.username}</h2> 
   {pathname.includes('/agent') ? 
   <p className="text-sm">Manage all of your <strong>listings</strong>{' '}
    {session?.user.isPremium && `and`}{' '}
    {session?.user.isPremium && <strong>residents</strong>}{' '}
    here</p>
   :
    <p className="text-sm">Monitor all of <strong>First Estates</strong> users and agents here </p>}   
    </div> 
    {/* <p>Search</p> */}
    </div>
  )
}

export default Header