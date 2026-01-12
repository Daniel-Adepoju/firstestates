"use client"

import Agent from "@components/agent/Agent"
import Payments from "@components/Payments"
import { useUser } from "@utils/user"
import { useEffect, useState } from "react"
import { useGetAgentPayments } from "@lib/customApi"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
// import AgentListings from './AgentListings'

const AgentOnboarding = () => {
  const { session } = useUser()
  const [agentId, setAgentId] = useState("")
  const userEmail = session?.user.email

  useEffect(() => {
    if (session?.user.id && !agentId) {
      setAgentId(session.user.id)
    }
  }, [session, agentId])

  const { data: paymentData, isLoading: paymentLoading } = useGetAgentPayments({
    userId: userEmail,
    enabled: !!userEmail,
  })

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* return to homepage */}
      <Link
        href="/"
        className="flex items-center gap-1 pl-2 md:pl-3 self-start text-sm gold-gradient-text font-medium font-head"
      >
        <ChevronLeft
          size={15}
          strokeWidth={3}
          className="inline-block text-goldPrimary"
        />
        Go to Homepage
      </Link>
      {/* Agent Profile */}
      <Agent
        agent={session?.user}
        isYou={true}
      />

      {/* Payments */}
      <Payments
        data={paymentData}
        isLoading={paymentLoading}
        type={"made-by-you"}
      />
    </div>
  )
}

export default AgentOnboarding
