"use client"

import Agent from "@components/agent/Agent"
import Payments from "@components/Payments"
import { useUser } from "@utils/user"
import { useGetAgentPayments } from "@lib/customApi"

const AgentOnboarding = () => {
  const { session } = useUser()
  const userEmail = session?.user.email

  const { data: paymentData, isLoading: paymentLoading } = useGetAgentPayments({
    userId: userEmail,
    enabled: !!userEmail,
  })

  return (
    <main className="flex w-full flex-col gap-6 pb-6">
      <div className="px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
          Overview
        </p>
        <h1 className="mt-1 font-list text-3xl font-semibold tracking-tight text-foreground">
          Your dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Keep your profile and account activity ready for your next client.
        </p>
      </div>

      <div className="flex w-full flex-col items-stretch gap-6 lg:flex-row lg:items-start">
        <Agent
          agent={session?.user}
          isYou={true}
        />

        <Payments
          data={paymentData}
          isLoading={paymentLoading}
          type="made-by-you"
        />
      </div>
    </main>
  )
}

export default AgentOnboarding
