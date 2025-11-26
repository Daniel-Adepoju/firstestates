import { useState, useRef, useEffect } from "react"
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

type ScrollControllerProps = {
  scrollRef: React.RefObject<HTMLDivElement | null>
}

const ScrollController = ({ scrollRef }: ScrollControllerProps) => {
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  const checkScroll = () => {
    const el = scrollRef?.current
    if (!el) return
    setShowLeft(el.scrollLeft > 0)
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth)
  }

  useEffect(() => {
    const el = scrollRef?.current
    if (!el) return
      checkScroll()
    el.addEventListener("scroll", checkScroll)
    return () => el.removeEventListener("scroll", checkScroll)
  }, [scrollRef.current])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = el.clientWidth * 0.8
    el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" })
  }

  if (!showLeft && !showRight) return null

  return (
    <div className="w-[98%] flex justify-end">
      <div className="flex flex-row gap-4">
        {showLeft && (
          <div
            onClick={() => scroll("left")}
            className="w-10 h-10 flex items-center justify-center
             cursor-pointer dark:bg-darkGray shadow-md dark:shadow-black
              p-2 rounded-full  smallScaleUp"
          >
            <ChevronLeft
              size={25}
              strokeWidth={3}
              className="text-goldPrimary"
            />
          </div>
        )}

        {showRight && (
          <div
            onClick={() => scroll("right")}
            className="w-10 h-10 flex items-center justify-center
            cursor-pointer dark:bg-darkGray shadow-md dark:shadow-black 
            p-2 rounded-full smallScaleUp"
          >
            <ChevronRight
                size={25}
              strokeWidth={3}
              className="text-goldPrimary"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ScrollController
