"use client"
import Image from "next/image"
// import { logOut } from "@lib/server/auth"
import { signOut } from "next-auth/react"
import { deleteListing, markAsFeatured, reportListing } from "@lib/server/listing"
import { useNotification } from "@utils/Toast"
import { sendNotification } from "@lib/server/notificationFunctions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LogOut, Trash, AlertCircle, Loader2, X, Check, House } from "lucide-react"
import dynamic from "next/dynamic"
import { useSignals, useSignal } from "@preact/signals-react/runtime"
import useClickOutside from "@utils/useClickOutside"
import { useRouter } from "next/navigation"
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
      className="modal-shell"
    >
      <div className="modal-shell__content">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-300">
          <Trash size={26} />
        </div>
        <h2 className="mt-5 text-xl font-bold tracking-tight">Delete this listing?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">This will remove the listing from your dashboard and it cannot be undone.</p>
        <div className="modal-shell__actions">
          <button type="button" className="modal-action modal-action--cancel" onClick={() => ref?.current?.close()}>Cancel</button>
          <button type="button" disabled={mutation.isPending} className="modal-action modal-action--danger" onClick={() => mutation.mutate()}>{mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Trash size={18} />} Delete</button>
        </div>
      </div>
    </dialog>
  )
}

export const LogOutModal = ({ ref }: ModalProps) => {
  const router = useRouter()
  useClickOutside(ref)
  const handleLogout = async () => {
    await signOut({
      redirect: false,
    })
    router.push("/logged-out")
  }
  return (
    <dialog
      ref={ref}
      className="modal-shell"
    >
      <div className="modal-shell__content">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/15">
          <LogOut size={26} />
        </div>
        <h2 className="mt-5 text-xl font-bold tracking-tight">Log out of First Estates?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">You can sign back in whenever you are ready.</p>
        <div className="modal-shell__actions">
          <button type="button" className="modal-action modal-action--cancel" onClick={() => ref?.current?.close()}>Stay signed in</button>
          <button type="button" className="modal-action modal-action--danger" onClick={() => { handleLogout(); ref?.current?.close() }}><LogOut size={18} /> Log out</button>
        </div>
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
  const featuredAmount = 1000

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
      className="modal-shell"
    >
      <div className="modal-shell__content">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"><House size={26} /></div>
      <h2 className="mt-5 text-xl font-bold tracking-tight">Make listing featured</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">
        Do you wish to <strong>boost the visibility</strong> of your listing?
        <span className="mt-2 block font-semibold text-foreground">Payment required: ₦{featuredAmount}</span>
      </p>
      <p className="mt-3 rounded-xl bg-amber-500/10 p-3 text-left text-xs leading-5 text-amber-800 dark:text-amber-200">Only listings created within the last 30 days are eligible.</p>
      <div className="modal-shell__actions">
        <div className="flex min-h-11 flex-1 items-center justify-center" onClick={() => ref.current?.close()}>
          {email && (
            <PaystackBtn
              text="Proceed"
              email={email}
              amount={featuredAmount}
              successFunction={() => makeFeaturedMutation.mutate()}
            />
          )}
        </div>
        <button type="button" onClick={() => ref.current?.close()} className="modal-action modal-action--cancel">Cancel</button>
      </div>
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
  useClickOutside(ref)
  const notification = useNotification()
  const actionText = action ? action.charAt(0).toUpperCase() + action.slice(1) : "chat"
  const makeReport = async (val: any) => {
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
  // console.log(ref.current)
  return (
    <dialog ref={ref} className="modal-shell">
      <div className="modal-shell__content">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"><AlertCircle size={27} /></div>
        <h2 className="mt-5 text-xl font-bold tracking-tight">Report {actionText}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">Are you sure you want to report this {action?.toLowerCase() || "conversation"}?</p>
        <p className="mt-3 rounded-xl bg-red-500/5 p-3 text-left text-xs leading-5 text-red-700 dark:text-red-200">Reports are reviewed by the First Estates team and cannot be withdrawn after submission.</p>
        <div className="modal-shell__actions">
          <button type="button" onClick={() => ref.current?.close()} className="modal-action modal-action--cancel">Cancel</button>
          <button type="button" disabled={makeReportMutation.isPending} onClick={handleReport} className="modal-action modal-action--primary">{makeReportMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <AlertCircle size={18} />} Report</button>
        </div>
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
    <dialog ref={ref} className="modal-shell">
      <div className="modal-shell__content">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-300"><AlertCircle size={27} /></div>
        <h2 className="mt-5 text-xl font-bold tracking-tight">Report listing</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">Tell us what needs attention. A clear description helps us review this listing faster.</p>
        <label htmlFor="listing-report-message" className="sr-only">Reason for reporting this listing</label>
        <textarea id="listing-report-message" required minLength={5} placeholder="Describe the issue..." value={message.value} onChange={(e) => (message.value = e.target.value)} className="mt-5 min-h-36 w-full resize-none rounded-2xl border border-border bg-secondary/40 p-4 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10" />
        <div className="modal-shell__actions">
          <button type="button" onClick={() => ref.current?.close()} className="modal-action modal-action--cancel">Cancel</button>
          <button type="button" disabled={makeReportMutation.isPending || message.value.trim().length < 5} onClick={handleReport} className="modal-action modal-action--danger disabled:cursor-not-allowed disabled:opacity-50">{makeReportMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <AlertCircle size={18} />} Report listing</button>
        </div>
      </div>
    </dialog>
  )
}

// export const InfoModal = ({ ref }: ModalProps) => {
//   useClickOutside(ref)
//   return (
//     <dialog
//       ref={ref}
//       className="mt-30 dark:bg-gray-700 dark:text-white
//         bg-white rounded-xl p-6 w-[90%] max-w-md mx-auto shadow-xl
//        text-center border border-white dark:border-black"
//     >
//       <div className="flex flex-col gap-4 relative text-sm">
//         <h2 className="otherHead text-md font-bold">How To List</h2>
//         <div>Fill in the form below to list your property.</div>

//         <X
//           onClick={() => ref.current && ref.current.close()}
//           size={35}
//           className="
//           text-red-500
//          absolute right-0 top-[-8px]
//          cursor-pointer dark:bg-black/30 bg-gray-500/20 rounded-full p-1"
//         />

//         <ul className="px-2 tracking-wide text-justify list-disc  flex flex-col gap-2 justify-start items-start">
//           <li>
//             You may select <strong>only one main image</strong>, which will be used as the cover
//             photo for your listing.
//           </li>
//           <li>
//             You can also select <strong>supplementary images</strong> determined by your listing
//             tier.
//           </li>
//           <li>
//             A fee <strong>determined by your listing tier</strong> is required to complete and
//             publish your listing.
//           </li>
//         </ul>
//       </div>
//     </dialog>
//   )
// }
export const InfoModal = ({ ref }: ModalProps) => {
  useClickOutside(ref)

  const instructions = [
    {
      number: "01",
      title: "Main image",
      description: (
        <>
          Select <strong>only one main image</strong>. This will serve as the cover photo for your
          property listing.
        </>
      ),
    },
    {
      number: "02",
      title: "Supplementary images",
      description: (
        <>
          You can upload additional <strong>supplementary images</strong> depending on your selected
          listing tier.
        </>
      ),
    },
    {
      number: "03",
      title: "Listing payment",
      description: (
        <>
          A fee <strong>determined by your listing tier</strong> is required to complete and publish
          your property listing.
        </>
      ),
    },
    {
      number: "04",
      title: "Description box",
      description: (
        <>
          Use the <strong>description box</strong> to provide additional details, such as kitchen
          availability, whether a roommate is required, any extra utility costs, and differences
          between the first year's rent and subsequent years.
        </>
      ),
    },
  ]

  return (
    <dialog
      ref={ref}
      className="
        m-auto mt-6 w-[calc(100%-2rem)] max-w-lg
        rounded-2xl border border-gray-200/80
        bg-white p-0 text-gray-800 shadow-2xl
        backdrop:bg-black/50 backdrop:backdrop-blur-sm
        dark:border-white/10 bar-custom gold-bar dark:bg-gray-900 dark:text-gray-100
      "
    >
      <div className="relative p-6 sm:p-8">
        {/* Close button */}
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close modal"
          className="
            absolute right-5 top-5 flex size-9 items-center justify-center
            rounded-full bg-gray-100 text-gray-500 transition-colors
            hover:bg-red-50 hover:text-red-500
            dark:bg-white/10 dark:text-gray-300 dark:hover:bg-red-500/20
          "
        >
          <X size={19} />
        </button>

        {/* Header */}
        <div className="mb-7 pr-8">
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <House size={24} />
          </div>

          <h2 className="otherHead text-xl font-bold tracking-tight sm:text-2xl">
            How to List Your Property
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            A few things to know before publishing your property. Follow these steps to get your
            listing ready.
          </p>
        </div>

        {/* Instructions */}
        <div className="flex flex-col gap-3">
          {instructions.map((item) => (
            <div
              key={item.number}
              className="
                flex gap-4 rounded-xl border border-gray-100
                bg-gray-50/80 p-4
                dark:border-white/5 dark:bg-white/[0.03]
              "
            >
              <div
                className="
                flex size-9 shrink-0 items-center justify-center
                rounded-lg bg-blue-100 text-sm font-bold text-blue-700
                dark:bg-blue-500/15 dark:text-blue-400
              "
              >
                {item.number}
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {item.title}
                </h3>

                <p className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-gray-100 pt-5 dark:border-white/10">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="
              w-full rounded-xl bg-blue-600 px-5 py-3
              text-sm font-semibold text-white transition-all
              hover:bg-blue-700 active:scale-[0.98]
            "
          >
            Got it, Continue
          </button>
        </div>
      </div>
    </dialog>
  )
}
