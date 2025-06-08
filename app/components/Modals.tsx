'use client'
import Image from 'next/image'
import { deleteListing } from '@lib/server/listing';
import { useNotification } from '@lib/Notification';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LogOut, Trash} from 'lucide-react';


interface DeleteModalProps {
  ref: React.RefObject<HTMLDialogElement | null>;
  listingId: string
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>
}

interface ModalProps {
  ref: React.RefObject<HTMLDialogElement | null>;
  logOut: () => void
}

export const DeleteModal = ({ ref, listingId, setDeleting }: DeleteModalProps) => {
  const notification = useNotification()
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    ref?.current?.close()
    setDeleting(true)
    try {
 const res = await deleteListing(listingId)
   if (res.status === "success" || "warning") {
        notification.setIsActive(true)
        notification.setMessage(res.message)
        notification.setType(res.status)
      }
    setDeleting(false)
    } catch (err) {
     setDeleting(false)
      console.log(err)
    }
  }
    const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentListings']})
      queryClient.invalidateQueries({ queryKey: ['notifications']})
    },
  })
  return (
    <dialog ref={ref} className="dark:bg-gray-700 dark:text-white bg-white rounded-xl p-6 w-100 mt-30 mx-auto shadow-xl text-center">
     <Trash
     size={60}
     color='darkred'
     className="mx-auto mb-4"
     />

      <p className="text-lg font-medium mb-6">
        Are you sure you want to delete?
      </p>

      <div className="flex justify-between px-8">
        <Image
          src="/icons/cancel.svg"
          alt="Cancel"
          width={40}
          height={40}
          className="cursor-pointer"
          onClick={() => ref?.current?.close()}
        />
        <Image
          src="/icons/confirm.svg"
          alt="Confirm"
          width={40}
          height={40}
          className="cursor-pointer"
          onClick={() => mutation.mutate()}
        />
      </div>
    </dialog>
  )
}

export const LogOutModal = ({ ref, logOut}: ModalProps) => {
 
 return ( 
 <dialog ref={ref} className="dark:bg-gray-700 dark:text-white bg-white mt-40 rounded-xl p-6 w-100 mx-auto shadow-xl text-center border-1 border-white">
      <div className="flex justify-center mb-4">
        <LogOut size={64} color='darkred'/>
      </div>

      <p className="text-lg font-medium mb-6">
        Are you sure you want to log out?
      </p>

      <div className="flex justify-between px-8">
        <Image
          src="/icons/cancel.svg"
          alt="Cancel"
          width={40}
          height={40}
          className="cursor-pointer smallScale"
          onClick={() => ref?.current?.close()}
        />
        <Image
          src="/icons/confirm.svg"
          alt="Confirm"
          width={40}
          height={40}
          className="cursor-pointer smallScale"
          onClick={() => logOut()}
        />
      </div>
    </dialog>
)}