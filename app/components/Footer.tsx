"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useDarkMode } from "@lib/DarkModeProvider"
const Footer = () => {
  const year = new Date().getFullYear()
  const { darkMode } = useDarkMode()
  const [goUpvisible, setgoUpVisible] = useState(false)


  return (
    <footer className={`footer`}>
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
