'use client'
import { useContext, createContext,useState } from "react"

interface BackdropType {
  backdrop: {isOpen:boolean}
  setBackdrop: React.Dispatch<React.SetStateAction<{isOpen:boolean}>>
  }
export const BackdropContext = createContext<BackdropType>({
  backdrop: {isOpen:false},
  setBackdrop: () => {},
})
export const useBackdrop =() => useContext(BackdropContext)
const Backdrop = ({children}: {children: React.ReactNode}) => {
 const [backdrop, setBackdrop] = useState({isOpen:false})

  return (
    <BackdropContext.Provider value={{backdrop,setBackdrop}}>
      {<div 
      onClick={() => setBackdrop({isOpen: !backdrop.isOpen})}
      className={`backdrop ${backdrop.isOpen && "active"} `}>
        </div> }
        {children}
    </BackdropContext.Provider>
  )
}

export default Backdrop