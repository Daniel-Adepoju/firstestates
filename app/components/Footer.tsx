"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useDarkMode } from "@lib/DarkModeProvider"
const Footer = () => {
  const year = new Date().getFullYear()
  const { darkMode } = useDarkMode()
  const [goUpvisible, setgoUpVisible] = useState(false)

  const scrollThreshold = 1000

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        setgoUpVisible(true)
      } else {
        setgoUpVisible(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  })
  return (
    <footer className={`footer`}>
      {goUpvisible && (
        <Link
          className="goUp"
          href="#nav"
        >
          <div className="clickable">
            <Image
              width={50}
              height={50}
              src={!darkMode ? "/icons/goUp.svg" : "/icons/goUpDark.svg"}
              alt="up_arrow"
            />
          </div>
        </Link>
      )}
      <div className="logo">LOGO</div>
      <div className="footer_items_container">
        <div className="footer_items">
         <Link href={'footer/contact'}>
          Contact Us
        </Link>   
        </div>
      
        <div className="footer_items">
        <Link href={'footer/about'}>
        About
        </Link>   
          </div>
       
          <div className="footer_items">
           <Link href={'footer/terms'}>
        <span>Terms and conditions</span>
        </Link>
          </div>
       
          <div className="footer_items">
          <Link href={'footer/privacy'}>
        Privacy Policy
        </Link>   
          </div>        
      </div>
      <div className="copyright">&copy; {year}</div>
    </footer>
  )
}

export default Footer
