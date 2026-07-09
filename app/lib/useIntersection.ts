import { useRef, useCallback } from "react"
import { markAsRead } from "@lib/server/notificationFunctions"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// export const useNextPage = (queryName:any,isForChat=false) => {
//   const observer = useRef<any>(null)

//   return useCallback(
//     (node:any) => {
//       if (observer.current) {
//         observer.current.disconnect()
//       }

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting) {
//           queryName.fetchNextPage()
//             console.log(entries[0].target.textContent)
//         }
//       })

//       if (node) return observer.current.observe(node)
//     },
//     [queryName.isLoading, queryName.hasNextPage]
//   )
// }

export const useNextPage = (queryName: any, anchorRef:any = null, isForChat = false) => {
  const observer = useRef<IntersectionObserver | null>(null)
  const cooldown = useRef(false)

  return useCallback(
    (node: HTMLElement | null) => {
      if (observer.current && !isForChat) {
        observer.current.disconnect()
      }

      observer.current = new IntersectionObserver(async ([entry]) => {
        if (!entry.isIntersecting) return

        if (!queryName.hasNextPage) return
        if (queryName.isFetchingNextPage) return

        //  Chat Anchor
        anchorRef.current = {
          element: entry.target,
          top: entry.target.getBoundingClientRect().top,
        }
        // Chat cooldown
        if (isForChat && cooldown.current) return

        await queryName.fetchNextPage()
        if (isForChat) {
          cooldown.current = true

          setTimeout(() => {
            cooldown.current = false
          }, 2000)
        }
        console.log(entry.target)
      })

      if (node) {
        observer.current.observe(node)
      }
    },
    [queryName.fetchNextPage, queryName.hasNextPage, queryName.isFetchingNextPage, isForChat],
  )
}

export const useObserveRead = (userId: any) => {
  const queryClient = useQueryClient()
  const observer = useRef<any>(null)
  const onReadMutation = useMutation({
    mutationKey: ["read"],
    mutationFn: async (notificationId: any) => {
      await markAsRead(notificationId)
    },
    onMutate: (notificationId: any) => {
      queryClient.setQueryData(["notifications"], (oldData: any) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.flatMap((page: any) => {
            const updatedNotifications = page.notifications.map((notif: any) => {
              if (notif._id === notificationId) {
                return {
                  ...notif,
                  readBy: [...(notif.readBy || []), userId],
                }
              }
              return notif
            })

            return {
              ...page,
              notifications: updatedNotifications,
            }
          }),
        }
      })
    },
  })

  return useCallback((node: any) => {
    if (observer.current) {
      observer.current.disconnect()
    }

    observer.current = new IntersectionObserver(async (entries: any) => {
      if (entries[0].isIntersecting) {
        const notificationId = entries[0].target.dataset.id

        onReadMutation.mutate(notificationId)
        // console.log(notificationId,'intersect')
      }
    })

    if (node) return observer.current.observe(node)
  }, [])
}

export const useChangeHash = () => {
  const observer = useRef<any>(null)

  return useCallback((node: any) => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const intersectingEntry = entries.find((entry) => entry.isIntersecting)

        if (intersectingEntry) {
          const id = intersectingEntry.target.id
          window.location.hash = id
          console.log(id)
        }
      },
      { threshold: 0.2 },
    )

    if (node) return observer.current.observe(node)
  }, [])
}
