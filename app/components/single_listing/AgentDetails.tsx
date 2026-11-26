"use client"

import Link from "next/link"
import { CldImage } from "next-cloudinary"
import { MapPin, Phone, MessageCircle, ChevronRight } from "lucide-react"

const AgentDetails = ({ agent, session, onPhone, onChat, listingId }: any) => {
  return (
    <div className="agent_details w-full">
      <div className="txt heading">Agent's Details</div>

      <div className="details mt-5 space-y-6">
        {/* Agent main info */}
        <div className="agent">
          <CldImage
            width={300}
            height={200}
            className="w-30 h-30 rounded-full"
            alt="agent pic"
            crop="fit"
            src={agent?.profilePic}
          />
          <div>
            Listed by{" "}
            <Link
              className="font-head quickLink"
              href={`/agent-view/${agent?._id}`}
            >
              {agent?.username}
            </Link>
          </div>
        </div>
        {/* Office Address */}
        <div className="space-y-2">
          <div className="subheading">Office Address</div>

          <div className="flex items-start gap-3">
            <MapPin
              size={20}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0 text-goldPrimary"
            />

            <span className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {agent?.address || "Address not available"}
            </span>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-3">
          <div className="subheading">Contacts</div>

          {/* Phone */}
          <button
            type="button"
            onClick={onPhone}
            className="group flex w-full items-center gap-3 text-left transition-colors"
          >
            <div className="flex size-10 shrink-0 items-center justify-center">
              <Phone
                size={20}
                strokeWidth={1.8}
                className="text-goldPrimary transition-transform duration-200 group-hover:scale-110"
              />
            </div>

            <span className="text-sm text-gray-600 transition-colors group-hover:text-goldPrimary dark:text-gray-300">
              {agent?.phone || "Phone number unavailable"}
            </span>
          </button>

          {/* Chat */}
          {session ? (
            <Link
              href={`/chat?receiverId=${agent?._id}&listingId=${listingId}`}
              onClick={onChat}
              className="group flex w-full items-center gap-3"
            >
              <div className="flex size-10 shrink-0 items-center justify-center">
                <MessageCircle
                  size={20}
                  strokeWidth={1.8}
                  className="text-goldPrimary transition-transform duration-200 group-hover:scale-110"
                />
              </div>

              <span className="flex-1 text-sm text-gray-600 transition-colors group-hover:text-goldPrimary dark:text-gray-300">
                Chat With Agent
              </span>

              <ChevronRight
                size={16}
                className="text-gray-400 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center">
                <MessageCircle
                  size={20}
                  strokeWidth={1.8}
                  className="text-goldPrimary"
                />
              </div>

              <span className="text-sm text-gray-500 dark:text-gray-400">
                Log in to chat with agent
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgentDetails
