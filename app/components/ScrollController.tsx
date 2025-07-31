import { useDarkMode } from "@lib/DarkModeProvider"
import { useState,useRef,useEffect } from "react"
import {ArrowLeft,ArrowRight } from "lucide-react"

export let scrollRef: React.RefObject<HTMLDivElement | null>
const ScrollController = () => {
  const {darkMode} = useDarkMode()
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
   scrollRef = useRef<HTMLDivElement>(null)

   const checkScroll = () => {
    const el = scrollRef?.current;
    if (!el) return
    setShowLeft(el.scrollLeft > 0)
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth)
  }
  
    useEffect(() => {
    checkScroll();
    const el = scrollRef?.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    return () => el.removeEventListener('scroll', checkScroll);
  }, [scrollRef.current]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }

  return (
     <div className="w-[98%] flex justify-end">
      <div className="flex flex-row gap-4">
       {showLeft && <div 
        onClick={() => scroll('left')}
        className='mediumScale cursor-pointer dark:bg-gray-600 shadow-md p-2 rounded-full'>
         <ArrowLeft size={30} color={darkMode ? '#A88F6E' : '#f29829'}/>  
        </div>}
         
       {showRight && <div 
        onClick={() => scroll('right')}
       className='mediumScale cursor-pointer dark:bg-gray-600 shadow-md p-2 rounded-full'>
        <ArrowRight size={30} color={darkMode ? '#A88F6E' : '#f29829'}/>
      </div>}
      </div>
      </div>
  )
}

export default ScrollController