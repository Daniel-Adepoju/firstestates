'use client'
import { useContext, createContext,useState } from "react"

interface BackdropType {
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>
   setToggleNav: React.Dispatch<React.SetStateAction<boolean>>
   toggleNav: boolean
   isActive: boolean
  }
export const BackdropContext = createContext<BackdropType | undefined>(undefined)
export const useBackdrop =() => useContext(BackdropContext)
const Backdrop = ({children}: {children: React.ReactNode}) => {
 const [isActive, setIsActive] = useState(false)
  const [toggleNav, setToggleNav] = useState<boolean>(false)
   const showNav = () => {
    setIsActive(prev => !prev)
    setToggleNav(prev => !prev)
  }

  return (
    <BackdropContext.Provider value={{isActive,setIsActive,setToggleNav, toggleNav}}>
      {<div 
      onClick={showNav}
      className={`backdrop ${isActive && "active"} `}>
        </div> }
        {children}
    </BackdropContext.Provider>
  )
}

export default Backdrop