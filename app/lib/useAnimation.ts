import { useEffect, useRef, useState } from "react"

export function useAnimation({
  threshold = 0.2,
  root = null,
  rootMargin = "0px",
  animation = "",
} = {}) {
  const ref = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
           //   setAnimate(false)
        //   requestAnimationFrame(() => setAnimate(true))
        }
      },
      { root, rootMargin, threshold }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [root, rootMargin, threshold])

  return {
    ref,
    animationClass: isVisible ? animation : "",
  }
}
