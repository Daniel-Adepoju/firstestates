"use client"
import Image from "next/image"
import { CldImage } from "next-cloudinary"
import { Skeleton } from "@components/ui/skeleton"
import { MapPin, Phone, MessageCircle, ChevronDown } from "lucide-react"
import Link from "next/link"

import { useDarkMode } from "@lib/DarkModeProvider"
import { useUser } from "@utils/user"

const Agent = ({
  agent,
  isYou,
  handleReport,
  isActive,
  setIsActive,
  reporting,
  reportText,
  setReportText,
}: any) => {
  // const { darkMode } = useDarkMode()
  const { session } = useUser()
  const userId = session?.user?.id

  if (!agent) {
    return (
      <div className="flex flex-col gap-4 w-full  ">
        <Skeleton className="w-25 h-25 rounded-[50%] bg-gray-500/20" />
        <Skeleton className="w-full h-10 rounded-md bg-gray-500/20" />
        <Skeleton className="w-full h-10 rounded-md bg-gray-500/20" />
      </div>
    )
  }
  return (
    <div className="w-full  flex flex-col gap-4">
      <div className="agentProfile dark:text-white">
        <div className=" flex flex-col gap-3">
          <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Image */}
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
                {/* Checkmark and*/}
                <div className="flex items-center gap-1">
                  <h1 className="text-2xl font-semibold">{agent.username}</h1>
                  {agent.isPremium && (
                    <Image
                      src={"/icons/gold-badge.svg"}
                      alt="badge"
                      width={25}
                      height={25}
                      className="rounded-full"
                    />
                  )}
                </div>
                {/* email*/}
                <p className="text-sm text-gray-400">{agent.email}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 py-2.5">
            {/* chat */}
            {!isYou && userId && (
              <Link
                href={`/chat?recipientId=${agent._id}`}
                className="md:w-100 text-sm dark:bg-black/10 bg-gray-100/70 pt-2 pb-2.5 px-4 rounded-lg font-bold flex flex-row items-center gap-2 cursor-pointer duration-300 transition-all hover:opacity-80"
              >
                <MessageCircle
                  size={26}
                  className="text-goldPrimary"
                />
                <span>Chat With Agent</span>
              </Link>
            )}

            {/* phone */}
            <div
              onClick={() => {
                if (!isYou) return window.open(`tel:${agent?.phone}`)
              }}
              className="md:w-100 text-sm dark:bg-black/10 bg-gray-100/70 pt-2 pb-2.5 px-4 rounded-lg font-bold flex flex-row items-center gap-2 duration-300 transition-all hover:opacity-80 cursor-pointer"
            >
              <Phone
                size={26}
                className="text-goldPrimary"
              />
              <span>{agent.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="agentProfile section_two">
        <div className="flex flex-row gap-2 items-center">
          <MapPin
            size={26}
            className="text-goldPrimary"
          />
          <span className="break-all text-xs text-ellipsis opacity-90 text-foreground">
            {agent.address}
          </span>
        </div>
      </div>

      {/* report user */}
      {!isYou && (
        <div className="reportUser  lg:mb-6 ">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setIsActive(!isActive)}
          >
            <h2 className="subheading font-semibold mb-2">Report Agent</h2>
            <ChevronDown
              strokeWidth={3}
              className={`w-5 h-5 transition-transform duration-300 ${
                isActive ? "rotate-180" : ""
              }`}
            />
          </div>

          {isActive && (
            <>
              <p className="text-sm">If you have any issues with this agent, please report them.</p>
              <form
                onSubmit={handleReport}
                className="mt-4 flex flex-col gap-1"
              >
                <textarea
                  required
                  className="w-full resize-none p-2 outline-[1px] dark:outline-black border-none rounded-sm"
                  rows={6}
                  placeholder="Describe the issue..."
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                ></textarea>
                <button
                  type="submit"
                  disabled={reporting}
                  className="block w-60 mt-2 px-4 py-2 mx-auto lg:mx-0 lg:ml-auto bg-red-700 text-sm font-medium text-white outline-1.5 dark:outline-gray-500 rounded-xl hover:opacity-90"
                >
                  {reporting ? "Sending..." : "Send Report"}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Agent
