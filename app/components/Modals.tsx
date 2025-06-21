'use client'
import Image from 'next/image'
import { deleteListing,markAsFeatured} from '@lib/server/listing';
import { useNotification } from '@lib/Notification';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LogOut, Trash} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSignals,useSignal } from '@preact/signals-react/runtime';
const PaystackBtn = dynamic(() => import('./PayStackButton'), { ssr: false });


interface DeleteModalProps {
  ref: React.RefObject<HTMLDialogElement | null>;
  listingId: string
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>
}

interface ModalProps {
  ref: React.RefObject<HTMLDialogElement | null>;
  logOut: () => void
}

interface FeaturedProps {
  email: string;
  ref: React.RefObject<HTMLDialogElement | null>;
  listingId?:string;
  userId: string;
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

export const FeaturedModal = ({ref,email,listingId,userId}:FeaturedProps) => {
  useSignals()
  const creating = useSignal(false)
  const notification = useNotification()
  const queryClient = useQueryClient()
  
const makeFeatured = async () => {
  try {
 const res = await markAsFeatured({isFeatured:true,id:listingId},userId)
 if (res.status === "success" || "warning") {
        notification.setIsActive(true)
        notification.setMessage(res.message)
        notification.setType(res.status)
      }
    } catch (err) {
      console.log(err)
    }
}
const makeFeaturedMutation = useMutation({
  mutationFn: () => makeFeatured(),
  onSuccess: () => {
    creating.value = false
      queryClient.invalidateQueries({ queryKey: ['agentListings']})
      queryClient.invalidateQueries({ queryKey: ['notifications']})
  }, 
})

  return (
  <dialog
  ref={ref}
  className="dark:bg-gray-700 dark:text-white bg-white mt-40 rounded-xl p-6 w-[90%] max-w-md mx-auto shadow-xl text-center border border-white"
>
  <div className="flex justify-center mb-4">
    <h2 className="text-xl font-semibold">Make Listing Featured</h2>
  </div>
  <p className="text-sm leading-relaxed mb-6">
    Do you wish to <strong>boost the visibility</strong> of your listing?
    <br />
    Proceeding will require a payment of <strong className='currency'>₦500</strong>
    <span className="text-shadow-red-600 font-medium">
      Note: Only listings created within the last 30 days are eligible.
    </span>
  </p>

  <div className="flex justify-center gap-4">
    <div className='btnCover w-50 flex flex-row justify-center' onClick={() => ref.current?.close()}>
    {email && ( 
    <PaystackBtn
    text='Proceed'
    email={email}
    amount={500}
    creating={creating}
    successFunction={() => makeFeaturedMutation.mutate()}
    />)}
    </div>
    <button
      onClick={() => ref.current?.close()}
      className="px-4 py-2 rounded-md bg-gray-300 text-black hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-800"
    >
      Cancel
    </button>
  </div>
</dialog>

  )
}