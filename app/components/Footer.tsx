"use client"
import Link from "next/link"
import Image from "next/image"
import { footerItems } from "@lib/constants"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
const Footer = () => {
  const year = new Date().getFullYear()
  const pathname = usePathname()

 if (pathname !== "/") return null

  return (
    <footer className={`footer`}>
      <div className="logo">LOGO</div>
      <div className="footer_items_container">
       
        {footerItems.map((item,i) => (
           <div
           key={i}
           className="footer_items">
         <ChevronRight size={15} />
         <Link href={item.link}>
         {item.name}
        </Link>   
        </div>
        ))}
      </div>
      <div className="copyright">&copy; {year}</div>
    </footer>
  )
}

export default Footer
