"use client"

import { axiosdata } from "@utils/axiosUrl"
import Button from "@lib/Button"
import { WhiteLoader } from "@utils/loaders"
import { Signal } from "@preact/signals-react"
import { makePayment } from "@lib/server/makePayment"
import Paystack from "@paystack/inline-js"

interface PaystackBtnProps {
  text: string
  email: string
  amount: number
  metadata?: any
  creating: Signal<boolean>
  successFunction: () => void
}

const PaystackBtn = ({
  creating,
  email,
  amount,
  metadata,
  text,
  successFunction,
}: PaystackBtnProps) => {
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
      className="self-center clickable text-white bg-darkblue hover:scale-99 dark:outline-gray-700 outline-2 outline-black transition-all duration-300 gloss font-bold py-3.5 px-8.5 rounded-md"
      functions={() => {
        creating.value = true
        handlePaystack()
      }}
    >
      {creating.value && <WhiteLoader />}
    </Button>
  )
}

export default PaystackBtn
