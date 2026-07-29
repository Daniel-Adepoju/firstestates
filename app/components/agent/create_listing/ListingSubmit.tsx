"use client"
import dynamic from "next/dynamic"
import { MoreHorizontal, Plus, Send, Share, Wallet, Wallet2, WalletCards } from "lucide-react"
import Button from "@lib/Button"
import { WhiteLoader } from "@utils/loaders"
import { useSignals } from "@preact/signals-react/runtime"
const PaystackBtn = dynamic(() => import("@components/PayStackButton"), { ssr: false })

export default function ListingSubmit({
  isAdmin,
  email,
  incomplete,
  creating,
  amount,
  handleMutate,
  setIsTransferOpen,
}: any) {
  useSignals()

  return (
    <div className="form_group col-span-2 mx-auto my-6">
      {email ? (
        incomplete ? (
          <div className="mx-auto font-semibold text-gray-700 dark:text-white text-center">
            Fill all required fields to proceed
          </div>
        ) : (
          <>
            <p className="mx-auto text-center text-gray-500 dark:text-gray-300 text-sm">
              Choose a payment method to proceed
            </p>
            <div className="w-full md:w-[85%] lg:w-[60%] flex flex-1 flex-wrap gap-2 items-center justify-around mx-auto">
              <PaystackBtn
                text={creating.value ? "Paying..." : "Pay Online"}
                email={email || ""}
                amount={amount}
                successFunction={() => handleMutate("online")}
              />
              <Button
                text="transfer"
                disabled={creating.value}
                reverse={true}
                onClick={() => setIsTransferOpen()}
                className=" special-button gloss clickable capitalize"
              >
                <Share size={25} />
              </Button>
              {isAdmin && (
                <Button
                  text="Create Demo"
                  disabled={creating.value}
                  reverse={true}
                  onClick={() => handleMutate("demo")}
                  className=" special-button gloss clickable capitalize"
                >
                  <Plus size={25} />
                </Button>
              )}
            </div>
          </>
        )
      ) : (
        <div className="flex mx-auto items-center justify-center gap-2 font-semibold text-gray-600 dark:text-white">
          <span>Initializing</span>
          <MoreHorizontal
            size={20}
            className="animate-pulse self-end"
          />
        </div>
      )}
    </div>
  )
}
