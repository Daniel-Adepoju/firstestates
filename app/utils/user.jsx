'use client'
import { createContext, useContext } from "react"
import {useSession, getProviders} from 'next-auth/react'
import { useState, useEffect } from 'react';


export const UserContext = createContext()
export const ProviderContext = createContext()
export const useUser = () => useContext(UserContext)
export const useProviders = () => useContext(ProviderContext)

const User = ({children}) => {

  const {data: session, update,status} = useSession()
  const [providers,setProviders] = useState(null)

  useEffect(() => {
    const grabProvider = async () => {
     const res = await getProviders()
     setProviders(res)
    }
    grabProvider()
   },[])
  
// if (status === "loading") return null;
  return (
      <ProviderContext.Provider value={providers}>
      <UserContext.Provider value={{session, update,status}}>
           {children}
       </UserContext.Provider>
    </ProviderContext.Provider>   
  )
}

export default User