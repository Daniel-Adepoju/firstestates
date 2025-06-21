"use client"

import Image from "next/image"
import { CldImage } from "next-cloudinary"
import { Skeleton } from "@components/ui/skeleton"
import { MapPin, Phone } from "lucide-react"
import { useDarkMode } from "@lib/DarkModeProvider"
import Link from "next/link"

const Agent = ({ agent }) => {
  const { darkMode } = useDarkMode()

  if (!agent) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <Skeleton className="w-30 h-30 rounded-[50%] bg-gray-300" />
        <Skeleton className="w-full h-10 rounded-md bg-gray-300" />
        <Skeleton className="w-full h-10 rounded-md bg-gray-300" />
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
                <h1 className="text-2xl font-semibold">Monkey D. Luffy</h1>
                <p className="text-sm text-gray-400">pikinperson449@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="agentProfileInfo">
            <div className="md:w-100 dark:bg-black/10 bg-gray-100/70 pt-2 pb-2.5 px-4 rounded-lg mt-6 font-bold flex flex-row items-center gap-2">
              <Phone
                size={34}
                color={darkMode ? "#A88F6E" : "#0881A3"}
              />
              <span>{agent.phone}09035035795</span>
            </div>
            <div className="md:w-100 dark:bg-black/10 bg-gray-100/70  px-4 rounded-lg mt-6 font-bold flex flex-row items-center">
              <Image
                src={darkMode ? "/icons/whatsappDark.svg" : "/icons/whatsapp.svg"}
                alt="icon"
                width={50}
                height={50}
              />
              <span>{agent.whatsapp}09035035795</span>
            </div>
          </div>
        </div>
      </div>

      <div className="agentProfile section_two">
        <div className="flex flex-row gap-2 items-center">
          <MapPin
            size={50}
            color={darkMode ? "#A88F6E" : "#0881A3"}
          />
          <span className="break-all text-sm text-ellipsis opacity-70">
            {agent.address}14,lorem ipsum dolor dolor
            dlodrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrwwwwwww
          </span>
        </div>
      </div>
    </>
  )
}

export default Agent
