'use client'
import { axiosdata } from '@utils/axiosUrl';
import { usePaystackPayment } from 'react-paystack';
import Button from '@lib/Button';
import { WhiteLoader } from '@utils/loaders';
import { Signal } from '@preact/signals-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { makePayment } from '@lib/server/makePayment';


interface PaystackBtnProps {
  email: string;
  amount: number;
  metadata?: any;
  onVerified?: (data: any) => void;
  creating: Signal<boolean>;
  successFunction: () => void;
}


const PaystackBtn = ({creating,email, amount, metadata, onVerified,successFunction}:PaystackBtnProps) => {
const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || '';

 let status:string;
 let payAmount:number;
 let reference:string;

interface PaystackOptions {
  reference: string;
  email: string;
  amount: number;
  metadata?: any;
  publicKey: string;
}

interface PaystackRef {
  reference: string;
  [key: string]: any;
}

  const paystackOptions = {
   reference: (new Date()).getTime().toString(),
    email:email,
    amount: amount * 100,
    metadata,
    publicKey,
  };

  const handleVerify = async (ref: any) => {
    try {
   const res = await axiosdata.value.get(`/api/transaction?ref=${ref.reference}`)
   const data = res.data
     if (data.status && data.data.status === 'success') {
       status = data.data.status
       payAmount = data.data.amount /100
        reference = data.data.reference
    } else {
        alert('Verification failed');
      }  
} 
    
    
    catch(err) {
        console.log(err)
    }  
};

const handlePay = async() => {
      await makePayment({
    userId: email,
    amount:  payAmount,
    status: status,
    reference: reference
         })
 
}

  const onSuccess = async (ref:any) => {
    try { 
    console.log(ref)
    await handleVerify(ref)
    await handlePay()

    creating.value = false
    successFunction()
  } catch(err) {
    console.log(err)
  }
}

  
  const onClose = () => {
    creating.value = false
    console.log('closed')
  }


  const initializePayment = usePaystackPayment(paystackOptions)

  return (
    <>
    <div className='text-white'>
    </div>
 <Button
text="Create Listing"
className="clickable directional darkblueBtn"
functions={() => {
    creating.value = true
    initializePayment({ onSuccess,onClose })
}}
>
 {creating.value && <WhiteLoader />}
</Button>
    </>
   

  )
}

export default PaystackBtn;
