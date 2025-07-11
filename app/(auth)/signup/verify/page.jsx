"use client"

import { useSignal, useSignals } from "@preact/signals-react/runtime"
import { WhiteLoader, DotsLoader } from "@utils/loaders"
import Button from "@lib/Button"
import { useEffect, useState } from "react"
import { useNotification } from "@lib/Notification"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyOTP, sendOTP, signInWithCredentials } from "@lib/server/auth"

const Verify = () => {
  useSignals()
  const notification = useNotification()
  const validTime = useSignal(60)
  const router = useRouter()
  const role = useSearchParams().get("role")
  const username = useSearchParams().get("username")
  const email = useSearchParams().get("email")
  const password = useSearchParams().get("password")
  const phone = useSearchParams().get("phone")
  const whatsapp = useSearchParams().get("whatsapp")
  const address = useSearchParams().get("address")
  const school = useSearchParams().get("school")
  const [verifying, setVerifying] = useState(false)
  const otpValues = {
    otp1: useSignal(""),
    otp2: useSignal(""),
    otp3: useSignal(""),
    otp4: useSignal(""),
    otp5: useSignal(""),
  }
  const compiledOtp = useSignal("")
  const [loggingIn, setLoggingIn] = useState(false)

  useEffect(() => {
    setInterval(() => {
      if (validTime <= 0) {
        clearInterval()
      } else {
        validTime.value -= 1
      }
    }, 1000)
  }, [])

  const handleResend = async (e) => {
    e.preventDefault()
    validTime.value = 60
    await sendOTP({ email })
  }

  //Write OTP
  const writeOtp = (e) => {
    const { value, id } = e.target

    if (id !== "otp5" && value.length > 0) {
      e.target.nextElementSibling.focus()
    } else {
      e.target.blur()
    }
    if (id !== "otp1" && value.length === 0) {
      e.target.previousElementSibling.focus()
    } else {
      e.target.blur()
    }

    otpValues[id].value = value
    compiledOtp.value = Object.values(otpValues)
    .map(input => input.value)
    .join("")
  }
  const writeOtpKeyBoard = (e) => {
    const { id, value } = e.target

    if (e.key !== "Backspace" && e.key !== "Delete") {
      return
    }

    if (id === "otp1" && value === "") {
      return
    }

    const previousInput = e.target.previousElementSibling

    e.target.value = ""
     otpValues[id].value = ""

    if (previousInput) {
      if (value === "" || e.key === "Delete") {
      setTimeout(() => previousInput.focus(), 10);
      }
      
    }

    compiledOtp.value = Object.values(otpValues)
    .map(input => input.value)
    .join("");
  }

  //Verify
  const handleVerify = async (e) => {
    e.preventDefault()
    setVerifying(true)
    try {
      const res = await verifyOTP({
        clientOtp: compiledOtp.value.toString(),
        role,
        username,
        email,
        userPassword: password,
        school,
        ...(phone && { phone }),
        ...(whatsapp && { whatsapp }),
        ...(address && { address }),
      })
      notification.setIsActive(true)
      notification.setMessage(res.message)
      notification.setType(res.status)
      notification.setDuration(2000)
      setVerifying(false)
      if (res.status === "success") {
        setLoggingIn(true)
        await signInWithCredentials(email, password)
        router.push("/")
      }
    } catch (err) {
      console.log(err)
      setVerifying(false)
    }
  }

  useEffect(() => {
    if (!email && !password && !username) {
      //  return router.push('/login')
    }
  }, [])

  if (loggingIn) {
    return (
      <div className="blackboard">
        <div className="blackboardItems">
          <div className="subheading">Signing You In</div>
          <DotsLoader />
        </div>
      </div>
    )
  }
  return (
    <div className="verify">
      <h2 className="subheading">Verify Your Email Address</h2>
      <p className="verify_description">
        Input the 5-digits OTP sent to your provided email address.
      </p>
      <p className="my[-90px]">OTP is valid for 5 minutes.</p>
      {validTime.value > 0 && (
        <p className="verify_description">
          You can resend in <strong className="timer">{validTime.value}</strong> seconds.
        </p>
      )}
      {validTime.value === 0 && (
        <span
          onClick={handleResend}
          className="quickLink resend "
        >
          Resend OTP
        </span>
      )}
      <form onSubmit={handleVerify}>
        <div className="inputContainer">
          <input
            type="text"
            inputMode="numeric"
            className="otp-input"
            maxLength="1"
            onChange={writeOtp}
            onKeyDown={(e) => writeOtpKeyBoard(e)}
            id="otp1"
            value={otpValues.otp1.value}
            required
          />
          <input
            type="text"
            inputMode="numeric"
            className="otp-input"
            maxLength="1"
            onChange={writeOtp}
            onKeyDown={(e) => writeOtpKeyBoard(e)}
            id="otp2"
            value={otpValues.otp2.value}
            required
          />
          <input
            type="text"
            inputMode="numeric"
            className="otp-input"
            maxLength="1"
            onChange={writeOtp}
            onKeyDown={(e) => writeOtpKeyBoard(e)}
            id="otp3"
            value={otpValues.otp3.value}
            required
          />
          <input
            type="text"
            inputMode="numeric"
            className="otp-input"
            maxLength="1"
            onChange={writeOtp}
            onKeyDown={(e) => writeOtpKeyBoard(e)}
            id="otp4"
            value={otpValues.otp4.value}
            required
          />
          <input
            type="text"
            inputMode="numeric"
            className="otp-input"
            maxLength="1"
            onChange={writeOtp}
            onKeyDown={(e) => writeOtpKeyBoard(e)}
            id="otp5"
            value={otpValues.otp5.value}
            required
          />
        </div>
        <Button
          type="submit"
          text="verify"
          className="clickable directional  darkblueBtn"
        >
          {verifying && <WhiteLoader />}
        </Button>
      </form>
    </div>
  )
}

export default Verify
