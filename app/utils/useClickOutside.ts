import { useEffect } from "react"

export default function useClickOutside(
  dialogRef: React.RefObject<HTMLDialogElement | null>,
  onClose?: () => void
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const dialog = dialogRef.current
      if (!dialog) return
      if (!dialog.open) return

      const rect = dialog.getBoundingClientRect()

      const clickedInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (!clickedInside) {
        onClose ? onClose() : dialog.close()
      }
    }

    document.addEventListener("mousedown", handleClick)

    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [dialogRef, onClose])
}
