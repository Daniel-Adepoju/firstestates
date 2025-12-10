import { useEffect } from "react"

export default function useClickOutside(dialogRef: React.RefObject<HTMLDialogElement | null>) {
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClick = (e: MouseEvent) => {
      if (dialog.open && e.target === dialog) {
        dialog.close()
      }
    }

    dialog.addEventListener("click", handleClick)

    return () => dialog.removeEventListener("click", handleClick)
  }, [dialogRef])
}
