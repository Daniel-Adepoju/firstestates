'use client'

import Agent from '@components/agent/Agent'
import {useUser} from "@utils/user"

const AgentInfo = () => {
const {session} = useUser()

  return (
    <Agent 
    agent={session?.user}
    />
  )
}

export default AgentInfo