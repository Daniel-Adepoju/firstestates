"use client"
import { CldImage } from "next-cloudinary"
import { Skeleton } from "@components/ui/skeleton"
import { MapPin, Phone, MessageCircle, ChevronDown, BadgeCheck, Pencil } from "lucide-react"
import Link from "next/link"
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
  const { session } = useUser()
  const userId = session?.user?.id

  if (!agent) {
    return (
      <div className="flex flex-col gap-4 w-full  flex-1">
        <Skeleton className="w-25 h-25 rounded-[50%] bg-gray-500/20" />
        <Skeleton className="w-full h-10 rounded-md bg-gray-500/20" />
        <Skeleton className="w-full h-10 rounded-md bg-gray-500/20" />
      </div>
    )
  }
  return (
    <div className="w-full  flex flex-col gap-4">
      <div className="w-full rounded-3xl border border-border/60 bg-background/70 p-5 shadow-xs backdrop-blur-md sm:p-7">
        <div className="flex flex-col gap-6">
          <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Image */}
              <div className="flex flex-row justify-center lg:justify-end">
                <Link
                  href={`/agent/edit-profile`}
                  className="group relative cursor-pointer"
                >
                  <CldImage
                    width={64}
                    height={64}
                    crop="auto"
                    src={agent.profilePic}
                    alt="profilePic"
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/10 transition-transform group-hover:scale-105"
                  />
                  {isYou && (
                    <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground">
                      <Pencil size={13} />
                    </span>
                  )}
                </Link>
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <h1 className="font-card text-2xl font-semibold tracking-tight text-foreground">
                    {agent.username}
                  </h1>
                  {agent.isPremium && (
                    <BadgeCheck
                      size={20}
                      className="text-goldPrimary"
                      aria-label="Premium agent"
                    />
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{agent.email}</p>
                {/* <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary/70">
                  First Estates agent
                </p> */}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/50 pt-5">
            {/* chat */}
            {!isYou && userId && (
              <Link
                href={`/chat?receiverId=${agent._id}`}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/55 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
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
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-secondary/55 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
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

      <div className="w-full rounded-2xl border border-border/60 bg-secondary/45 p-4">
        <div className="flex items-start gap-3">
          <MapPin
            size={26}
            className="text-goldPrimary"
          />
          <span className="break-words text-sm leading-6 text-muted-foreground">
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
