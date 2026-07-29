"use client"
import { CreditCard } from "lucide-react"
import { axiosdata } from "@utils/axiosUrl"
import Button from "@lib/Button"
import { WhiteLoader } from "@utils/loaders"
import { Signal } from "@preact/signals-react"
import { makePayment } from "@lib/server/makePayment"
import Paystack from "@paystack/inline-js"
import { useSignals, useSignal } from "@preact/signals-react/runtime"

interface PaystackBtnProps {
  text: string
  email: string
  amount: number
  metadata?: any
  creating?: Signal<boolean>
  successFunction: () => void
  className?: string
  otherFunc?: () => void
}

const PaystackBtn = ({
  email,
  amount,
  metadata,
  text,
  className,
  otherFunc,
  successFunction,
}: PaystackBtnProps) => {
  useSignals()
  const creating = useSignal(false)

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || ""
  const popup = new Paystack()

  const handlePaystack = () => {
    // if (!paystackReady) {
    //   alert('Paystack script not yet ready.')
    //   creating.value = false
    //   return
    // }

    const reference = new Date().getTime().toString()

    const handler = popup.newTransaction({
      key: publicKey,
      email: email,
      amount: amount * 100,
      currency: "NGN",
      // metadata,
      reference,
      onSuccess: async (response: any) => {
        try {
          const res = await axiosdata.value.get(`/api/transaction?ref=${response.reference}`)
          const data = res.data
          creating.value = true

          if (data.status && data.data.status === "success") {
            await makePayment({
              userId: email,
              amount: data.data.amount / 100,
              status: data.data.status,
              reference: data.data.reference,
            })

            successFunction()
            creating.value = false
          } else {
            creating.value = false
            alert("Payment verification failed")
          }
        } catch (err) {
          creating.value = false
          console.error("Verification error:", err)
        } finally {
          creating.value = false
        }
      },
      onCancel: function () {
        creating.value = false
      },
    })
  }

  return (
    <Button
      text={text}
      reverse={true}
      className={`${className || "clickable gloss special-button"}`}
      onClick={() => {
        otherFunc && otherFunc()
        creating.value = true
        handlePaystack()
      }}
    >
      {creating.value ? <WhiteLoader /> : <CreditCard size={25} />}
    </Button>
  )
}

export default PaystackBtn
