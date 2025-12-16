"use client"
import Image from "next/image"
import { logOut } from "@lib/server/auth"
import { deleteListing, markAsFeatured, reportListing } from "@lib/server/listing"
import { useNotification } from "@lib/Notification"
import { sendNotification } from "@lib/server/notificationFunctions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LogOut, Trash, AlertCircle, Loader2, X } from "lucide-react"
import dynamic from "next/dynamic"
import { useSignals, useSignal } from "@preact/signals-react/runtime"
import Button from "@lib/Button"
import useClickOutside from "@utils/useClickOutside"
const PaystackBtn = dynamic(() => import("./PayStackButton"), { ssr: false })

interface DeleteModalProps {
  ref: React.RefObject<HTMLDialogElement | null>
  listingId: string
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>
}

interface ModalProps {
  ref: React.RefObject<HTMLDialogElement | null>
  logOut?: () => void
}

interface FeaturedProps {
  email: string
  ref: React.RefObject<HTMLDialogElement | null>
  listingId?: string
  userId: string
}

interface ReportModalProps {
  ref: React.RefObject<HTMLDialogElement | null>
  userId: string
  reportedUser: string
  chatContent?: string
  reportedListing?: string
  thumbnail?: string
  action?: string
}

export const DeleteModal = ({ ref, listingId, setDeleting }: DeleteModalProps) => {
  useClickOutside(ref)
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
      queryClient.invalidateQueries({ queryKey: ["agentListings"] })
      queryClient.invalidateQueries({ queryKey: ["searchListings"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
  return (
    <dialog
      ref={ref}
      className="dark:bg-gray-700 dark:text-white bg-white rounded-xl p-6 w-100 mt-30 mx-auto shadow-xl text-center"
    >
      <Trash
        size={60}
        color="darkred"
        className="mx-auto mb-4"
      />

      <p className="text-lg font-medium mb-6">Are you sure you want to delete?</p>

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

export const LogOutModal = ({ ref }: ModalProps) => {
  useClickOutside(ref)
  const handleLogout = async () => {
    await logOut()
  }
  return (
    <dialog
      ref={ref}
      className="dark:bg-gray-700 dark:text-white bg-white mt-40 rounded-xl p-6 w-100 mx-auto shadow-xl text-center border-1 border-white"
    >
      <div className="flex justify-center mb-4">
        <LogOut
          size={64}
          className=""
        />
      </div>

      <p className="text-lg font-medium mb-6">Are you sure you want to log out?</p>

      <div className="flex justify-evenly px-8">
        <X
          size={30}
          strokeWidth={3}
          className=" text-white cursor-pointer bg-green-700 p-2 rounded-full"
          onClick={() => ref?.current?.close()}
        />
        <LogOut
          size={30}
          strokeWidth={3}
          className="text-white cursor-pointer  bg-red-700 p-2 rounded-full"
          onClick={() => {
            handleLogout()
            ref?.current?.close()
          }}
        />
      </div>
    </dialog>
  )
}

export const FeaturedModal = ({ ref, email, listingId, userId }: FeaturedProps) => {
  useSignals()
  useClickOutside(ref)
  const creating = useSignal(false)
  const notification = useNotification()
  const queryClient = useQueryClient()

  const makeFeatured = async () => {
    try {
      const res = await markAsFeatured({ isFeatured: true, id: listingId }, userId)
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
      queryClient.invalidateQueries({ queryKey: ["agentListings"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
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
        Proceeding will require a payment of <strong className="currency">₦500</strong>
        <span className="text-shadow-red-600 font-medium">
          Note: Only listings created within the last 30 days are eligible.
        </span>
      </p>

      <div className="flex justify-center gap-4">
        <div
          className="btnCover w-50 flex flex-row justify-center"
          onClick={() => ref.current?.close()}
        >
          {email && (
            <PaystackBtn
              text="Proceed"
              email={email}
              amount={900}
              successFunction={() => makeFeaturedMutation.mutate()}
            />
          )}
        </div>
        <button
          onClick={() => ref.current?.close()}
          className="px-4 py-2 rounded-md bg-gray-300 text-black hover:bg-gray-400 dark:bg-darkGray dark:text-white dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </dialog>
  )
}

export const ReportModal = ({
  ref,
  userId,
  reportedUser,
  chatContent,
  action,
}: ReportModalProps) => {
  useSignals()
  useClickOutside(ref)
  const creating = useSignal(false)
  const notification = useNotification()
  const queryClient = useQueryClient()
  const actionText = action ? action.charAt(0).toUpperCase() + action.slice(1) : "chat"
  const makeReport = async (val: any) => {
    creating.value = true
    try {
      await sendNotification(val)
      notification.setIsActive(true)
      notification.setMessage(`${actionText} Reported`)
      notification.setType("success")
    } catch (err) {
      console.log(err)
    }
  }

  const makeReportMutation = useMutation({
    mutationFn: makeReport,
    onSuccess: () => {
      creating.value = false
      ref.current?.close()
    },
  })
  const handleReport = () => {
    makeReportMutation.mutate({
      sentBy: userId,
      reportedUser,
      recipientRole: "admin",
      ...(chatContent && { chatContent }),
      message: `${actionText} was reported`,
      mode: "broadcast-admin",
      type: `report_${action}`,
    })
  }
  console.log(ref.current)
  return (
    <dialog
      // onC
      ref={ref}
      className="dark:bg-gray-700 dark:text-white bg-white mt-40 rounded-xl p-6 w-[90%] max-w-md mx-auto shadow-xl text-center border border-white"
    >
      <div className="flex flex-col items-center justify-center mb-4">
        <AlertCircle
          size={50}
          color="gold"
        />
        <h2 className="text-xl font-semibold">Report {actionText}</h2>
      </div>
      <p className="text-sm leading-relaxed mb-6">
        Do you wish to <strong>report this {action}</strong>?
        <br />
        <span className="text-shadow-red-600 font-medium">
          Note: This action cannot be reversed.
        </span>
      </p>
      <div className="flex justify-center gap-4">
        <div className="btnCover w-50 flex flex-row justify-center">
          <Button
            text="Proceed"
            functions={() => handleReport()}
            className="darkblueBtn directional font-medium text-sm clickable"
          >
            {creating.value && (
              <Loader2
                color="white"
                className="animate-spin"
              />
            )}
          </Button>
        </div>
        <button
          onClick={() => ref.current?.close()}
          className="px-4 py-2 rounded-md bg-gray-300 text-black hover:bg-gray-400 dark:bg-darkGray dark:text-white dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </dialog>
  )
}

export const ReportListingModal = ({
  ref,
  userId,
  reportedUser,
  reportedListing,
  thumbnail,
}: ReportModalProps) => {
  useSignals()
  useClickOutside(ref)
  const creating = useSignal(false)
  const message = useSignal("")
  const notification = useNotification()
  const queryClient = useQueryClient()

  // message

  const makeReport = async (val: any) => {
    creating.value = true

    try {
      const res = await reportListing(val)
      notification.setIsActive(true)
      notification.setMessage(res.message)
      notification.setType(res.status)
    } catch (err) {
      console.log(err)
    }
  }
  const makeReportMutation = useMutation({
    mutationFn: makeReport,
    onSuccess: () => {
      message.value = ""
      creating.value = false
      ref.current?.close()
    },
  })

  const handleReport = () => {
    makeReportMutation.mutate({
      sentBy: userId,
      reportedUser,
      listingId: reportedListing,
      thumbnail,
      recipientRole: "admin",
      message: message.value,
      mode: "broadcast-admin",
      type: "report_listing",
    })
  }

  return (
    <dialog
      ref={ref}
      className=" dark:bg-gray-700 dark:text-white bg-white mt-20 rounded-xl p-6 w-[90%] max-w-md mx-auto shadow-xl text-center border border-white"
    >
      <div className="flex flex-col items-center justify-center mb-4">
        <AlertCircle
          size={50}
          color="gold"
        />
        <h2 className="text-xl font-semibold">Report Listing</h2>
      </div>
      <p className="text-sm leading-relaxed mb-6">
        Do you wish to <strong>report this listing</strong>?
        <br />
        <span className="text-shadow-red-600 font-medium">
          Note: This action cannot be reversed.
        </span>
      </p>
      <div>
        <textarea
          placeholder="What are the issues do you have with this listing?"
          value={message.value}
          onChange={(e) => (message.value = e.target.value)}
          className="w-100 h-40 p-3 mx-auto rounded-md bg-gray-500/20 resize-none"
        />
      </div>
      <div className="flex justify-center gap-4">
        <div className="btnCover w-50 flex flex-row justify-center">
          <Button
            text="Proceed"
            functions={() => handleReport()}
            className="darkblueBtn directional font-medium text-sm clickable"
            disabled={makeReportMutation.isPending}
          >
            {makeReportMutation.isPending && (
              <Loader2
                color="white"
                className="animate-spin"
              />
            )}
          </Button>
        </div>
        <button
          onClick={() => ref.current?.close()}
          className="px-4 py-2 rounded-md bg-gray-300 text-black hover:bg-gray-400 dark:bg-darkGray dark:text-white dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </dialog>
  )
}

export const InfoModal = ({ ref }: ModalProps) => {
  useClickOutside(ref)
  return (
    <dialog
      ref={ref}
      className="mt-30 dark:bg-gray-700 dark:text-white
        bg-white rounded-xl p-6 w-[90%] max-w-md mx-auto shadow-xl
       text-center border border-white"
    >
      <div className="flex flex-col gap-4 relative">
        <h2 className="otherHead text-md font-bold">How To List</h2>
        <div>Fill in the form below to list your property.</div>

        <X
          onClick={() => ref.current && ref.current.close()}
          size={40}
          color="darkred"
          className="
         absolute right-0 top-[-8px]
         cursor-pointer dark:bg-gray-200 bg-gray-500/20 rounded-full p-1"
        />

        <div>
          You may select <strong>only one main image</strong>, which will be used as the cover photo
          on the homepage.
        </div>
        <div>
          Additionally, you can upload up to <strong>five supplementary images</strong> to provide
          more views of your listing.
        </div>
        <div>
          A fee of <strong>₦500</strong> is required to complete and publish your listing.
        </div>
      </div>
    </dialog>
  )
}
