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

  const socialLinks = [
    // {
    //   name: "Facebook",
    //   link: "https://www.facebook.com/yourpage",
    //   icon: "/icons/facebook.svg",
    // },
    { name: "TikTok", link: "https://www.tiktok.com/@yourprofile", icon: "/icons/tiktok.svg" },
    {
      name: "Twitter",
      link: "https://www.twitter.com/yourprofile",
      icon: "/icons/x.svg",
    },
    {
      name: "Instagram",
      link: "https://www.instagram.com/yourprofile",
      icon: "/icons/instagram.svg",
    },
  ]
  return (
    <footer className={`footer pb-20 md:pb-1`}>
      <div className="logo">LOGO</div>
      <div className="footer_items_container">
        {/* social media */}
        <div className="mx-auto w-full flex flex-col gap-1 items-center justify-center my-2">
          <span className="font-hea font-bold text-xs self-center block">Follow Us</span>

          <div className="self-center flex items-center justify-center gap-2 ">
            {socialLinks.map((social, i) => (
              <Link
                key={i}
                className="smallScale gloss rounded-full overflow-hidden"
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={40}
                  height={40}
                  className="rounded-full overflow-hidden"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* footer items */}
        <div className="w-full flex flex-col lg:flex-row lg:justify-center gap-1  my-2">
          {footerItems.map((item, i) => (
            <div
              key={i}
              className="text-sm flex items-center gap-0.5"
            >
              <ChevronRight
                size={15}
                className="bg-clip-text"
              />
              <Link
                className="hover:text-transparent hover:gold-gradient-text
              transition-all duration-300 text-white  bg-clip-text"
                href={item.link}
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="copyright font-medium bg-black/10 w-full p-2 rounded-md">&copy; {year}</div>
    </footer>
  )
}

export default Footer
