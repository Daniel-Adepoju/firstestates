'use client'
import { useContext, createContext,useState } from "react"

interface BackdropType {
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>
}
export const BackdropContext = createContext<BackdropType | undefined>(undefined)
export const useBackdrop =() => useContext(BackdropContext)
const Backdrop = ({children}: {children: React.ReactNode}) => {
 const [isActive, setIsActive] = useState(false)

  return (
    <BackdropContext.Provider value={{setIsActive}}>
      {<div className={`backdrop ${isActive && "active"} `}>
        </div> }
        {children}
    </BackdropContext.Provider>
  )
}

export default Backdrop