"use client"
import { useBackdrop } from "@lib/Backdrop"
import Link from "next/link"
import { MessageCircle, AlertTriangle, UserPlus, Edit, icons } from "lucide-react"
import { useState } from "react"
import { useUser } from "@utils/user"

const CardOptions = () => {
  const { backdrop, setBackdrop } = useBackdrop()
  const [linkCopied, setLinkCopied] = useState(false)
  const { session } = useUser()

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Check out this listing",
          text: "I found this amazing listing on FirstEstates!",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/listings/single_listing?id=${backdrop.selectedData?._id}`,
        })
        setBackdrop({ isOptionsOpen: false })
      } catch (err) {
        alert("Sharing failed. Please try copying the link instead.")
        setBackdrop({ isOptionsOpen: false })
      }
    } else {
      alert("Sharing is not supported on your device or browser.")
      setBackdrop({ isOptionsOpen: false })
    }
  }

  const clientCardOptions = [
    session?.user && session.user.id !== backdrop.selectedData?.agent._id
      ? {
          tag: "Link",
          text: "Chat With Agent",
          link: backdrop.selectedData
            ? `${process.env.NEXT_PUBLIC_BASE_URL!}/chat?recipientId=${
                backdrop.selectedData?.agent._id
              }`
            : "",
          className: "",
          icon: <MessageCircle className="w-4 h-4 inline mb-1 mr-2" />,
          function: () => {
            setBackdrop({ isOptionsOpen: false })
          },
        }
      : null,

    {
      tag: "div",
      text: "Share",
      link: "",
      className: "cursor-pointer",
      icon: <icons.Share className="w-4 h-4 inline mb-1 mr-2" />,
      function: () => {
        if (typeof window !== "undefined") {
          handleShare()
        }
        setBackdrop({ isOptionsOpen: false })
      },
    },

    session?.user.id === backdrop.selectedData?.agent._id
      ? null
      : {
          tag: "Link",
          text: "View/Report Agent",
          link: `${process.env.NEXT_PUBLIC_BASE_URL!}/agent-view/${
            backdrop.selectedData?.agent._id
          }`,
          className: "cursor-pointer",
          icon: <icons.UserPlus className="w-4 h-4 inline mb-1 mr-2" />,
          function: () => {
            setBackdrop({ isOptionsOpen: false })
          },
        },

    session?.user && session?.user.id !== backdrop.selectedData?.agent._id
      ? {
          tag: "Link",
          text: "View Roomate Request",
          link: `${process.env.NEXT_PUBLIC_BASE_URL!}/listings/single_listing?id=${
            backdrop.selectedData?._id
          }#clientReport`,
          className: "text-blue-500 block",
          icon: <UserPlus className="w-4 h-4 inline mb-1 mr-2" />,
          function: () => {
            setBackdrop({ isOptionsOpen: false })
          },
        }
      : null,
  ].filter(Boolean)

  const agentCardOptions = [
    {
      tag: "Link",
      text: "Manage Your Listings",
      link: `${process.env.NEXT_PUBLIC_BASE_URL!}/agent#listings`,
      className: "text-blue-500",
      icon: <Edit className="w-4 h-4 inline mb-1 mr-2" />,
      function: () => {
        setBackdrop({ isOptionsOpen: false })
      },
    },
  ].filter(Boolean)

  return (
    <div
      className={`${
        !backdrop.isOptionsOpen && "hidden"
      } bg-white dark:bg-gray-700 w-full md:w-[90%] lg:w-[60%] h-auto
        flex flex-col gap-2
        rounded-tl-xl rounded-tr-xl 
        fixed bottom-0 left-0 md:left-[5.5%] lg:bottom-0 lg:left-[20%]
        p-4 pb-6 text-md font-bold `}
    >
      {clientCardOptions.map((option: any, index) => (
        <div
          onClick={option.function}
          key={index}
          className={option.className}
        >
          {option.icon}
          {option.tag === "Link" ? <Link href={option.link}>{option.text}</Link> : option.text}
        </div>
      ))}
      {session?.user.id === backdrop.selectedData?.agent._id &&
        agentCardOptions.map((option: any, index: number) => (
          <div
            onClick={option.function}
            key={index}
            className={option.className}
          >
            {option.icon}
            {option.tag === "Link" ? <Link href={option.link}>{option.text}</Link> : option.text}
          </div>
        ))}
    </div>
  )
}

export default CardOptions
