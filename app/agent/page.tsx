'use client'

import Agent from '@components/agent/Agent'
import Payments from '@components/Payments'
import { useUser } from '@utils/user'
import { useEffect, useState } from 'react'
import { useGetAgentPayments } from '@lib/customApi'
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
      {/* Agent Profile */}
      <Agent agent={session?.user} />

      {/* Payments */}
      <Payments
        data={paymentData}
        isLoading={paymentLoading}
        type={'made-by-you'}
      />
    </div>
  )
}

export default AgentOnboarding
