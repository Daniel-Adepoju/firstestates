
import { useCallback } from "react"

export function useRemoveWheel() {
  return useCallback((node: HTMLInputElement | null) => {
    if (!node) return

    const handleWheel = (e: WheelEvent) => e.preventDefault()

    node.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      node.removeEventListener("wheel", handleWheel)
    }
  }, [])
}