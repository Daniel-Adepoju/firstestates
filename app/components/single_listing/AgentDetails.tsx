"use client"

import Link from "next/link"
import { MapPin, Phone, MessageCircle } from "lucide-react"

const AgentDetails = ({ agent, session, onPhone, onChat }: any) => {
  return (
    <div className="agent_details w-full">
      <div className="txt heading">Agent&apos;s Details</div>
      <div className="details mt-3">
        <div className="subheading">Office Address</div>
        <div className="flex items-center gap-1">
          <MapPin size={25} className="text-goldPrimary" />
          <span className="text-sm text-medium text-gray-600 dark:text-gray-300">{agent?.address} lorem ipsom</span>
        </div>

        <div className="subheading">Contacts</div>
        <div className="contact_items text-gray-600 dark:text-white">
          <div className="hover:scale-95 transition-transform duration-200" onClick={onPhone}>
            <Phone size={35} className="text-goldPrimary" />
          </div>
          <span>{agent?.phone}</span>
        </div>

        <div className="contact_items w-full text-gray-600 dark:text-white">
          <div className="hover:scale-95 transition-transform duration-200" onClick={onChat}>
            <MessageCircle size={35} className="text-goldPrimary" />
          </div>
          {session ? (
            <Link href={`/chat?recipientId=${agent?._id}`} className="cursor-pointer">Chat With Agent</Link>
          ) : (
            <span className="w-full">Log In To Chat With Agent</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgentDetails
