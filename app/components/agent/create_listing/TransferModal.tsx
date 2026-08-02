import { Check, Copy, X } from "lucide-react"
import { useState } from "react"
import { useRemoveWheel } from "@utils/useRemoveWheel"

type Props = {
  isOpen: boolean
  onClose: () => void
  onClick: () => void
  amount: any
  accountNum: string
  accountName: string
  setAccountNum: (value: string) => void
  setAccountName: (value: string) => void
}

const ACCOUNT_NUMBER = "8137955560"
const ACCOUNT_NAME = "First Estates"
const BANK_NAME = "MoniePoint"

const TransferModal = ({
  isOpen,
  onClose,
  onClick,
  amount,
  accountNum,
  accountName,
  setAccountNum,
  setAccountName,
}: Props) => {
  const [copied, setCopied] = useState(false)
  const inputRef = useRemoveWheel()
  const isDisabled = !accountNum && !accountName
  if (!isOpen) return null

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ACCOUNT_NUMBER)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleInput = (e: any) => {
    const { value, name } = e.target
    if (name === "accountNum") {
      setAccountNum(value)
    }
    if (name === "accountName") {
      setAccountName(value)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-darkGray p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 transition hover:bg-gray-500/20"
        >
          <X className="h-5 w-5 text-foreground" />
        </button>

        <h2 className="text-xl font-semibold text-foreground">Bank Transfer (₦{amount})</h2>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Transfer the exact amount to the account below. After making the payment, click the
          confirmation button and we'll verify your payment.
        </p>

        <div className="mt-6 rounded-lg border bg-gray-50 dark:bg-gray-600/40 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">Bank</p>
          <p className="font-medium text-foreground">{BANK_NAME}</p>

          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">
              Account Number
            </p>

            <div className="mt-1 flex items-center justify-between rounded-md border bg-background px-3 py-2">
              <span className="text-lg font-bold tracking-wider text-foreground">
                {ACCOUNT_NUMBER}
              </span>

              <button
                onClick={handleCopy}
                className="rounded p-2 transition hover:bg-gray-500/20"
                title="Copy account number"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Copy className="h-5 w-5 text-foreground" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">
              Account Name
            </p>
            <p className="font-medium text-foreground">{ACCOUNT_NAME}</p>
          </div>
        </div>

        <div className="mt-4 text-xs text-foreground">
          Provide your account number, account name, or both to make the verification process
          easier.
        </div>
        <div className="flex gap-2 items-center  w-full">
          <input
            ref={inputRef}
            type="number"
            name="accountNum"
            value={accountNum}
            onChange={handleInput}
            placeholder="Enter your account number"
            className="mt-4 w-full rounded-md border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="accountName"
            value={accountName}
            onChange={handleInput}
            placeholder="Enter your account name"
            className="mt-4 w-full rounded-md border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={onClick}
          disabled={isDisabled}
          className={`block mt-6 w-[60%] text-sm  rounded-xl justify-self-center mx-auto darkblue-gradient py-3 
          font-medium text-white transition gloss clickable ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          I've Made the Transfer
        </button>

        <ol className="mt-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300">
          <li>
            Your payment won't be confirmed immediately. We'll verify it and notify you once it's
            confirmed.
          </li>
          <li>
            You'll, however see your newly created listing in your dashboard with it's status marked
            as pending
          </li>
        </ol>
      </div>
    </div>
  )
}

export default TransferModal
