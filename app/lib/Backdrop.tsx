'use client'
import { useContext, createContext,useState, useEffect } from "react"

interface BackdropType {
  backdrop: any
  setBackdrop: React.Dispatch<React.SetStateAction<any>>
  }
export const BackdropContext = createContext<BackdropType>({
  backdrop: {isOptionsOpen:false,isNavOpen:false,selectedData:null},
  setBackdrop: () => {},
})
export const useBackdrop =() => useContext(BackdropContext)
const Backdrop = ({children}: {children: React.ReactNode}) => {
 const [backdrop, setBackdrop] = useState({isOptionsOpen:false,isNavOpen:false,selectedData:null})

  useEffect(() => {
  if (backdrop.isOptionsOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  })

  return (
    <BackdropContext.Provider value={{backdrop,setBackdrop}}>
      {<div 
      onClick={() => setBackdrop({isOptionsOpen:false,isNavOpen:false,selectedData:null})}
      className={`backdrop ${(backdrop.isOptionsOpen || backdrop.isNavOpen) && "active"} `}>
        </div> }
        {children}
    </BackdropContext.Provider>
  )
}

export default Backdrop