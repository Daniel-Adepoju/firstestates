import {useRef, useCallback} from 'react'
import {markAsRead} from '@lib/server/notificationFunctions'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useNextPage =  (queryName) => {
    const observer = useRef()

   return useCallback((node) => {
        if(observer.current) {
            observer.current.disconnect()
        }

        observer.current = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
          queryName.fetchNextPage()
        //   console.log(entries[0].target.textContent)
            }
            })
          
           if(node) return observer.current.observe(node)
          },[queryName.isLoading, queryName.hasNextPage])
        
}



export const useObserveRead =  (pageId,userId) => {
  
    const queryClient = useQueryClient()
      const observer = useRef()
    const onReadMutation = useMutation ({
            mutationKey:'read',
            mutationFn:  async (notificationId) => {
                await markAsRead(notificationId)  
            },
            onMutate: (notificationId) => {

   queryClient.setQueryData(['notifications'], (oldData) => {
      if (!oldData) return oldData;

        return {
    ...oldData,
    pages: oldData.pages.flatMap((page) => {
 
      const updatedNotifications = page.notifications.map((notif) => {
       
        if (notif._id === notificationId) {
          return {
            ...notif,
            readBy: [...(notif.readBy || []), userId],
          };
        }
        return notif;
      });

      return {
        ...page,
        notifications: updatedNotifications,
      };
    }),
  };
});
      

        }
       
    })

    return useCallback((node) => {
        if(observer.current) {
            observer.current.disconnect()
        }

        observer.current = new IntersectionObserver(async (entries) => {
         
        
            if(entries[0].isIntersecting) {
      
                const notificationId = entries[0].target.dataset.id
                
                   onReadMutation.mutate(notificationId)
                // console.log(notificationId,'intersect')
            }
        })

        if(node) return observer.current.observe(node)
    }, [])
}

