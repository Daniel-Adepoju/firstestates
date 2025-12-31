import { useUser } from "@utils/user"
import { BookMarked, ShieldQuestion, Settings, LogOut , Info} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const NavToggleOptions = ({
  toggleFunc,
  logOutRef,
}: {
  toggleFunc: () => void
  logOutRef: React.RefObject<any>
}) => {
  const { session } = useUser()
  const user = session?.user

  const navSections = [
    {
      title: "User",
      items: [
        {
          name: "Bookmarked Requests",
          link: "/listings/bookmarked-requests",
          icon: BookMarked,
          condition: user,
        },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          name: "FAQs",
          link: "/info/faqs",
          icon: ShieldQuestion,
          condition: true,
        //  condition: false,
        },
          {
          name: "About Us",
          link: "/info/about-us",
          icon: Info,
          condition: true,
        },
     
    
      ],
    },
    {
      title: "Account",
      items: [
        {
          name: "Settings",
          link: "/client-settings",
          icon: Settings,
          condition: user,
        },
        {
          name: "Logout",
          icon: LogOut,
          condition: user,
          type: "button",
          onClick: () => logOutRef.current?.showModal(),
          specialClassName: "text-red-500",
        },
      ],
    },
  ]

  return (
    <div
      className="
    absolute -top-104 md:top-20 bottom-0 right-1
        w-80  h-100 lg:w-100 
        rounded-2xl
        bg-white/95 dark:bg-darkGray
        backdrop-blur
        shadow-xl
        border border-gray-200/40 dark:border-white/10
        p-4 px-2 pl-3
        flex flex-col gap-4
        animate-in slide-in-from-top-4
      "
    >
    <div className="flex flex-col gap-4 overflow-y-auto nobar">
      {navSections.map(
        (section, i) =>
          section.items.some((item) => item.condition) && (
            <div
              key={i}
              className="flex flex-col gap-2"
            >
              <span className="px-2 text-xs uppercase tracking-wide text-gray-400">
                {section.title}
              </span>

              {section.items
                .filter((item) => item.condition)
                .map((item, idx) =>
                  item.type === "button" ? (
                    <button
                      key={idx}
                      className="
                      group flex items-center gap-3
                      rounded-xl px-3 py-2
                       font-medium
                      transition
                      hover:bg-gray-100 dark:hover:bg-white/5
                    "
                      onClick={() => {
                        item.onClick()
                        toggleFunc()
                      }}
                    >
                      <item.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      <span className={`${item.specialClassName} text-xs lg:text-sm `}>
                        {item.name}
                      </span>
                    </button>
                  ) : item.link ? (
                    <Link
                      key={idx}
                      href={item.link}
                      onClick={toggleFunc}
                      className="
                      group flex items-center gap-3
                      rounded-xl px-3 py-2
                       font-medium
                      transition
                      hover:bg-gray-100 dark:hover:bg-white/5
                    "
                    >
                      <item.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      <span className={`${item.specialClassName} text-xs lg:text-sm `}>
                        {item.name}
                      </span>
                    </Link>
                  ) : null
                )}
            </div>
          )
      )}
</div>
      <div className="pt-4 border-t border-gray-200/50 dark:border-white/10 text-center">
        <div className="font-bold text-lg tracking-wide">Logo</div>
        <p className="text-xs text-gray-400">Digital Real Estate Platform</p>
      </div>
    </div>
  )
}

export default NavToggleOptions
