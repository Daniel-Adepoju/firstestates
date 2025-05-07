'use client'
import { useContext, createContext,useState } from "react"

export const BackdropContext = createContext()
export const useBackdrop = () => useContext(BackdropContext)
const Backdrop = ({children}) => {
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