'use client'

import { useEffect, useState } from 'react'
import { axiosdata } from '@utils/axiosUrl'
import Button from '@lib/Button'
import { WhiteLoader } from '@utils/loaders'
import { Signal } from '@preact/signals-react'
import { makePayment } from '@lib/server/makePayment'
import Paystack from '@paystack/inline-js';

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
  const [paystackReady, setPaystackReady] = useState(false)
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || ''
 const popup = new Paystack()

  // Detect when Paystack is ready
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (typeof window !== 'undefined' && (window as any).PaystackPop) {
  //       setPaystackReady(true)
  //       clearInterval(interval)
  //     }
  //   }, 100)

  //   return () => clearInterval(interval)
  // }, [])

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
      currency: 'NGN',
      // metadata,
      reference,
      onSuccess: async function (response: any) {
        try {
          const res = await axiosdata.value.get(`/api/transaction?ref=${response.reference}`)
          const data = res.data

          if (data.status && data.data.status === 'success') {
            creating.value = false
            await makePayment({
              userId: email,
              amount: data.data.amount / 100,
              status: data.data.status,
              reference: data.data.reference,
            })

            successFunction()
          } else {
            creating.value = false
            alert('Payment verification failed')
          }
        } catch (err) {
          creating.value = false
          console.error('Verification error:', err)
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
      className="clickable directional darkblueBtn"
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
