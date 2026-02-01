"use client"
import Link from "next/link"
import Image from "next/image"
import { footerItems } from "@lib/constants"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
const Footer = () => {
  const year = new Date().getFullYear()
  const pathname = usePathname()

  if (pathname !== "/" && 
    !pathname.includes("/info/")) {
    return null
  }

  const socialLinks = [
    // {
    //   name: "Facebook",
    //   link: "https://www.facebook.com/yourpage",
    //   icon: "/icons/facebook.svg",
    // },
  
    { name: "TikTok", link: "https://www.tiktok.com/@first_estates", icon: "/icons/tiktok.svg" },
    {
      name: "X",
      link: "https://www.x.com/firstestates1",
      icon: "/icons/x.svg",
    },
    {
      name: "Instagram",
      link: "https://www.instagram.com/firstestate_1?igsh=MWlnbHZlc2JoeWdldQ==",
      icon: "/icons/instagram.svg",
    },
       {
      name: "Youtube",
      link: "https://www.youtube.com/@firstestates-l9d",
      icon: "/icons/youtube.svg",
    },
  ]
  return (
    <footer className={`footer pb-20 md:pb-1`}>
      <div className="logo"></div>
 <div className="flex flex-col items-center leading-none ">
  <Image
    src="/logo/logoWithoutText.png"
    alt="logo"
    width={64}
    height={50}
    className="block -mb-7 logo"
  />

  {/* <Image
    src="/logo/wordmark.png"
    alt="wordmark"
    width={200}
    height={30}
    className="w-300 h-30 block border-2 rounded-full"
  /> */}
</div>

     
      <div className="footer_items_container">
        {/* social media */}
        <div className="mx-auto w-full flex flex-col gap-1 items-center justify-center my-2">
          <span className="font-list font-bold text-xs self-center block">Follow Us</span>

          <div className="min-w-90 self-center flex items-center justify-around ">
            {socialLinks.map((social, i) => (
              <Link
                key={i}
                className={`smallScale
              
                  ${social.name === 'Youtube' && 'mt-2.5'} 
                  `}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={30}
                  height={30}
                  className={`${social.name === 'Youtube' || social.name === 'Facebook' && 'h-8 w-8'}`}
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
              className="text-[14px] flex items-center gap-0.5"
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
      <div className="copyright text-xs font-semibold bg-black/10 w-full p-2 pb-3 rounded-md">&copy; {year}</div>
    </footer>
  )
}

export default Footer
