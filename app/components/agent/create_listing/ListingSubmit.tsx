"use client"
import dynamic from "next/dynamic"
import { MoreHorizontal } from "lucide-react"


const PaystackBtn = dynamic(() => import("@components/PayStackButton"), { ssr: false })

export default function ListingSubmit({ email, incomplete, creating, amount, handleMutate }: any) {

  return (
    <div className="form_group col-span-2 mx-auto">
      {email ? (
        incomplete ? (
          <div className="mx-auto font-semibold text-gray-700 dark:text-white text-center">
            Fill The Form To Proceed
          </div>
        ) : (
          <PaystackBtn
            text={creating.value ? "Creating Listing..." : "Create Listing"}
            email={email || ""}
            amount={amount}
            successFunction={() => handleMutate()}
          />
        )
      ) : (
        <div className="flex mx-auto items-center justify-center gap-2 font-semibold text-gray-600 dark:text-white">
          <span>Loading</span>
          <MoreHorizontal
            size={20}
            className="animate-pulse self-end"
          />
        </div>
      )}
    </div>
  )
}
