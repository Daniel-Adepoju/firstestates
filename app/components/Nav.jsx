'use client'
import Link from 'next/link'
import{ useState,useEffect} from 'react'

const Nav = () => {

   const [navbarFixed,setnavbarFixed] = useState(false)
    
    const scrollThreshold = 150
     
    useEffect(() => {
     const handleScroll = () => {
  
      if(window.scrollY > scrollThreshold) {
        setnavbarFixed(true)
      } else {
        setnavbarFixed(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
    })
  return (
    <nav id='nav' className={`${navbarFixed && 'fixedNav'}`}>
   <Link href='/'>
   <div className="logo">
    LOGO
   </div>
   </Link>
      <div className="nav_items" style={{flexWrap: 'wrap',}}>
        <Link href='/listings'>Browse Listings</Link>
        <Link href="/signup">Sign Up</Link>
        <Link href='/login'>Login</Link>
     </div>
    </nav> 
  )

}

export default Nav