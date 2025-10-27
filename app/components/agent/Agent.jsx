"use client"
import Image from "next/image"
import { CldImage } from "next-cloudinary"
import { Skeleton } from "@components/ui/skeleton"
import { MapPin, Phone, MessageCircle } from "lucide-react"
import { useDarkMode } from "@lib/DarkModeProvider"
import Link from "next/link"
import { useUser } from "@utils/user"

const Agent = ({ agent }) => {
  const { darkMode } = useDarkMode()
  const { session } = useUser()
  const userId = session?.user?.id

  if (!agent) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <Skeleton className="w-25 h-25 rounded-[50%] bg-gray-500/20" />
        <Skeleton className="w-full h-10 rounded-md bg-gray-500/20" />
        <Skeleton className="w-full h-10 rounded-md bg-gray-500/20" />
      </div>
    )
  }
  return (
    <>
      <div className="agentProfile">
        <div className=" flex flex-col lg:flex-row lg:items-center">
          <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex flex-row justify-center lg:justify-end">
                <Link
                  href={`/agent/edit-profile`}
                  className="cursor-pointer relative"
                >
                  <CldImage
                    width={64}
                    height={64}
                    crop={{
                      type: "auto",
                      source: true,
                    }}
                    src={agent.profilePic}
                    alt="profilePic"
                    className="w-full h-full rounded-full"
                  />
                  <div className="absolute inset-0 rounded-full border-4 border-black/20 border-r-transparent  border-t-transparent  duration-[2000ms] ease-in animate-spin"></div>
                </Link>
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center gap-1">
                <h1 className="text-2xl font-semibold">{agent.username}</h1>
                {agent.isTierOne && (
                  <Image
                  src={'/icons/gold-badge.svg'}
                   alt='badge'
                  width={25}
                  height={25}
                  className="rounded-full"
                  />
                )}
                {!agent.isTierTwo && (
                    <Image
                  src={'/icons/silver-badge.svg'}
                   alt='badge'
                  width={25}
                  height={25}
                  className="rounded-full"
                  />
                )}
                </div>
                <p className="text-sm text-gray-400">{agent.email}</p>
              </div>
            </div>
          </div>

          <div className="agentProfileInfo">
            <div className="md:w-100 dark:bg-black/10 bg-gray-100/70 pt-2 pb-2.5 px-4 rounded-lg mt-6 font-bold flex flex-row items-center gap-2">
              <Phone
                size={34}
                color={darkMode ? "#A88F6E" : "#0874c7"}
              />
              <span>{agent.phone}</span>
            </div>

            {userId !== agent?._id ||
              (userId === agent.id && (
                <div className="md:w-100 dark:bg-black/10 bg-gray-100/70 pt-2 pb-2.5 px-4 rounded-lg mt-6 font-bold flex flex-row gap-2 items-center">
                  <MessageCircle
                    size={34}
                    color={darkMode ? "#A88F6E" : "#0874c7"}
                  />
                  <Link href={`/chat?recipientId=${agent._id}`}>Chat With Agent</Link>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="agentProfile section_two">
        <div className="mt-2 flex flex-row gap-2 items-center">
          <MapPin
            size={40}
            color={darkMode ? "#A88F6E" : "#0874c7"}
          />
          <span className="break-all text-sm text-ellipsis opacity-70">{agent.address}</span>
        </div>
      </div>
    </>
  )
}

export default Agent
